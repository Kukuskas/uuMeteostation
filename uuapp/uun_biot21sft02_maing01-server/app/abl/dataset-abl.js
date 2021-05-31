"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/dataset-error.js");

const instanceAbl = require("./uu-app-instance-abl.js");
const mergeArrays = require("./helpers/array-merger.js");
const { sortObjectArrayByDate } = require("./helpers/date-helper.js");

const defaultsDeep = require("lodash.defaultsdeep");
const moment = require("moment-timezone");

const WARNINGS = {
  get: {
    unsupportedKeys: {
      code: `${Errors.Get.UC_CODE}unsupportedKeys`,
    },
  },
  getOrCreate: {
    unsupportedKeys: {
      code: `${Errors.GetOrCreate.UC_CODE}unsupportedKeys`,
    },
  },
  listByDates: {
    unsupportedKeys: {
      code: `${Errors.ListByDates.UC_CODE}unsupportedKeys`,
    },
  },
  listUnaggregatedData: {
    unsupportedKeys: {
      code: `${Errors.ListUnaggregatedData.UC_CODE}unsupportedKeys`,
    },
  },
  postAggregatedData: {
    unsupportedKeys: {
      code: `${Errors.PostAggregatedData.UC_CODE}unsupportedKeys`,
    },
    datasetAlreadyExists: {
      code: `${Errors.PostAggregatedData.UC_CODE}datasetAlreadyExists`,
      message: "Dataset of this type for this gateway and period already exist. Specified data will be merged into it.",
    },
  },
  markAggregated: {
    unsupportedKeys: {
      code: `${Errors.MarkAggregated.UC_CODE}unsupportedKeys`,
    },
    datasetsDoNotExist: {
      code: `${Errors.MarkAggregated.UC_CODE}datasetsDoNotExist`,
      message: "Some datasets requested to be marked do not exist.",
    },
  },
  trimData: {
    unsupportedKeys: {
      code: `${Errors.TrimData.UC_CODE}unsupportedKeys`,
    },
  },
};

const DATASET_TYPES = {
  hourly: {
    labelFormat: "YYYY-MM-DDTHH",
    entryOffset: {
      hours: 1,
    },
  },
  daily: {
    labelFormat: "YYYY-MM-DD",
    entryOffset: {
      days: 1,
    },
  },
  weekly: {
    labelFormat: "YYYY-[W]WW",
    entryOffset: {
      weeks: 1,
    },
  },
  monthly: {
    labelFormat: "YYYY-[M]MM",
    entryOffset: {
      months: 1,
    },
  },
};

class DatasetAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("dataset");
    this.gatewayDao = DaoFactory.getDao("gateway");
  }

  async get(awid, dtoIn, authorizationResult) {
    // 1
    let uuAppInstance = await instanceAbl.checkAndGet(
      awid,
      Errors.Get.UuAppInstanceDoesNotExist,
      ["active", "restricted"],
      Errors.Get.UuAppInstanceIsNotInCorrectState
    );

    // 2
    let validationResult = this.validator.validate("datasetGetDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.get.unsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // 3
    if (uuAppInstance.state === "restricted" && !instanceAbl.isAuthority(authorizationResult)) {
      throw new Errors.Get.NotAuthorized();
    }

    // 4
    let gateway, identifier;
    if (dtoIn.gatewayCode) {
      gateway = await this.gatewayDao.getByCode(awid, dtoIn.gatewayCode);
      identifier = { awid, code: dtoIn.gatewayCode };
    } else {
      gateway = await this.gatewayDao.get(awid, dtoIn.gatewayId);
      identifier = { awid, id: dtoIn.gatewayId };
    }

    if (!gateway) {
      throw new Errors.Get.GatewayDoesNotExist({ uuAppErrorMap }, identifier);
    }

    // 5
    let dataset = await this.dao.getByTypeAndDate(awid, gateway.id, dtoIn.type, dtoIn.date);
    if (!dataset) {
      throw new Errors.Get.DatasetDoesNotExist(
        { uuAppErrorMap },
        {
          awid,
          gatewayId: gateway.id,
          type: dtoIn.type,
          date: dtoIn.date,
        }
      );
    }

    // 6
    let dtoOut = { ...dataset, uuAppErrorMap };
    return dtoOut;
  }

  async getOrCreate(awid, dtoIn, authorizationResult) {
    // 1
    let uuAppInstance = await instanceAbl.checkAndGet(
      awid,
      Errors.GetOrCreate.UuAppInstanceDoesNotExist,
      ["active", "restricted"],
      Errors.GetOrCreate.UuAppInstanceIsNotInCorrectState
    );

    // 2
    let validationResult = this.validator.validate("datasetGetOrCreateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getOrCreate.unsupportedKeys.code,
      Errors.GetOrCreate.InvalidDtoIn
    );

    // 3
    if (uuAppInstance.state === "restricted" && !instanceAbl.isAuthority(authorizationResult)) {
      throw new Errors.GetOrCreate.NotAuthorized();
    }

    // 4
    let gateway, identifier;
    if (dtoIn.gatewayCode) {
      gateway = await this.gatewayDao.getByCode(awid, dtoIn.gatewayCode);
      identifier = { awid, code: dtoIn.gatewayCode };
    } else {
      gateway = await this.gatewayDao.get(awid, dtoIn.gatewayId);
      identifier = { awid, id: dtoIn.gatewayId };
    }

    if (!gateway) {
      throw new Errors.GetOrCreate.GatewayDoesNotExist({ uuAppErrorMap }, identifier);
    }

    // 5
    let dataset = await this.dao.getByTypeAndDate(awid, gateway.id, dtoIn.type, dtoIn.date);
    if (!dataset) {
      dataset = this._generateDataset(dtoIn.type, dtoIn.date, gateway.timezone);
      dataset.gatewayId = gateway.id;
    }

    // 6
    let dtoOut = { ...dataset, uuAppErrorMap };
    return dtoOut;
  }

  async listByDates(awid, dtoIn, authorizationResult) {
    // 1
    let uuAppInstance = await instanceAbl.checkAndGet(
      awid,
      Errors.ListByDates.UuAppInstanceDoesNotExist,
      ["active", "restricted"],
      Errors.ListByDates.UuAppInstanceIsNotInCorrectState
    );

    // 2
    let validationResult = this.validator.validate("datasetListByDatesDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listByDates.unsupportedKeys.code,
      Errors.ListByDates.InvalidDtoIn
    );

    const defaults = {
      pageInfo: {
        pageIndex: 0,
        pageSize: 100,
      },
    };
    dtoIn = defaultsDeep(dtoIn, defaults);

    // 3
    if (uuAppInstance.state === "restricted" && !instanceAbl.isAuthority(authorizationResult)) {
      throw new Errors.ListByDates.NotAuthorized();
    }

    // 4
    let gateway, identifier;
    if (dtoIn.gatewayCode) {
      gateway = await this.gatewayDao.getByCode(awid, dtoIn.gatewayCode);
      identifier = { awid, code: dtoIn.gatewayCode };
    } else {
      gateway = await this.gatewayDao.get(awid, dtoIn.gatewayId);
      identifier = { awid, id: dtoIn.gatewayId };
    }

    if (!gateway) {
      throw new Errors.ListByDates.GatewayDoesNotExist({ uuAppErrorMap }, identifier);
    }

    // 5
    switch (dtoIn.type) {
      case "weekly": {
        dtoIn.startDate = moment(dtoIn.startDate).startOf("year").subtract(7, "day").format("YYYY-MM-DD");
        dtoIn.endDate = moment(dtoIn.endDate).endOf("year").add(7, "day").format("YYYY-MM-DD");
        break;
      }
      case ("daily", "monthly"): {
        dtoIn.startDate = moment(dtoIn.startDate).startOf("year").format("YYYY-MM-DD");
        dtoIn.endDate = moment(dtoIn.endDate).endOf("year").format("YYYY-MM-DD");
        break;
      }
      case ("detailed", "hourly"):
      default: {
        break;
      }
    }

    // 6
    let dtoOut = this.dao.listByTypeAndDateRange(
      awid,
      gateway.id,
      dtoIn.type,
      dtoIn.startDate,
      dtoIn.endDate,
      dtoIn.pageInfo
    );

    // 7
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async listUnaggregatedData(awid, dtoIn) {
    // 1
    let uuAppInstance = await instanceAbl.checkAndGet(
      awid,
      Errors.ListUnaggregatedData.UuAppInstanceDoesNotExist,
      ["active", "restricted"],
      Errors.ListUnaggregatedData.UuAppInstanceIsNotInCorrectState
    );

    // 2
    let validationResult = this.validator.validate("datasetListUnaggregatedDataDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnaggregatedData.unsupportedKeys.code,
      Errors.ListUnaggregatedData.InvalidDtoIn
    );

    const defaults = {
      pageInfo: {
        pageIndex: 0,
        pageSize: 100,
      },
    };
    dtoIn = defaultsDeep(dtoIn, defaults);

    // 3
    let dtoOut = await this.dao.listByAggregation(awid, dtoIn.type, false, dtoIn.pageInfo);

    // 4
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async postAggregatedData(awid, dtoIn) {
    // 1
    let uuAppInstance = await instanceAbl.checkAndGet(
      awid,
      Errors.PostAggregatedData.UuAppInstanceDoesNotExist,
      ["active", "restricted"],
      Errors.PostAggregatedData.UuAppInstanceIsNotInCorrectState
    );

    // 2
    let validationResult = this.validator.validate("datasetPostAggregatedDataDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.postAggregatedData.unsupportedKeys.code,
      Errors.PostAggregatedData.InvalidDtoIn
    );

    // 3
    const gateway = await this.gatewayDao.get(awid, dtoIn.gatewayId);
    if (!gateway) {
      throw new Errors.PostAggregatedData.GatewayDoesNotExist({ uuAppErrorMap }, { awid, id: dtoIn.gatewayId });
    }

    // 4
    // 4.1
    const startMoment = moment(dtoIn.startDate);
    const endMoment = moment(dtoIn.endDate);
    let expectedStart;
    let expectedEnd;
    switch (dtoIn.type) {
      case "weekly":
        expectedStart = startMoment.clone().isoWeek(1).startOf("isoWeek");
        expectedEnd = startMoment.clone().isoWeek(expectedStart.isoWeeksInISOWeekYear()).endOf("isoWeek");
        break;
      case ("monthly", "daily"):
        expectedStart = startMoment.clone().startOf("year");
        expectedEnd = startMoment.clone().endOf("year");
        break;
      case "hourly":
      default:
        expectedStart = startMoment.clone();
        expectedEnd = startMoment.clone();
        break;
    }

    if (!expectedStart.isSame(startMoment) || !expectedEnd.isSame(endMoment)) {
      throw new Errors.PostAggregatedData.InvalidDateBoundaries(
        { uuAppErrorMap },
        {
          type: dtoIn.type,
          startDate: dtoIn.startDate,
          endDate: dtoIn.endDate,
          expectedStartDate: this._momentToDateString(expectedStart),
          expectedEndDate: this._momentToDateString(expectedEnd),
        }
      );
    }

    // 4.2
    dtoIn.data.forEach((entry) => {
      const tsMoment = moment(entry.timestamp);
      if (!moment(tsMoment).isBetween(startMoment, endMoment, "day", "[]")) {
        throw new Errors.PostAggregatedData.InvalidDataEntryTime(
          { uuAppErrorMap },
          {
            entry,
            startDate: this._momentToDateString(expectedStart),
            endDate: this._momentToDateString(expectedEnd),
          }
        );
      }

      const expectedLabel = this._formatToLabel(tsMoment, dtoIn.type);
      if (entry.label !== expectedLabel) {
        throw new Errors.PostAggregatedData.InvalidDataEntryLabel(
          { uuAppErrorMap },
          {
            type: dtoIn.type,
            entry,
            expectedLabel,
          }
        );
      }
    });

    // 4.3
    dtoIn.data.forEach((entry, index, data) => {
      let expectedTimestamp;
      if (index === 0) {
        expectedTimestamp = startMoment.clone();
      } else {
        expectedTimestamp = this._nextTimestamp(data[index - 1].timestamp, dtoIn.type);
      }

      if (!expectedTimestamp.isSame(entry.timestamp)) {
        throw new Errors.PostAggregatedData.MissingDataEntry(
          { uuAppErrorMap },
          {
            entry,
            expectedTimestamp: this._momentToDateTimeString(expectedTimestamp),
          }
        );
      }
    });

    // 5
    let dataset;
    if (dtoIn.id) {
      dataset = await this.dao.get(awid, dtoIn.id);
      if (!dataset) {
        throw new Errors.PostAggregatedData.DatasetDoesNotExist(
          { uuAppErrorMap },
          {
            awid,
            id: dtoIn.id,
          }
        );
      }
      const identifiers = ["id", "gatewayId", "type", "startDate", "endDate"];
      const identifiersDoNotMatch = identifiers.some((key) => dataset[key] !== dtoIn[key]);
      if (identifiersDoNotMatch) {
        const filterKeys = (o, keys) =>
          keys.reduce((state, key) => {
            state[key] = o[key];
            return state;
          }, {});
        const existingDataset = filterKeys(dataset, ["awid", ...identifiers]);
        const newDataset = { awid, ...filterKeys(dtoIn, identifiers) };
        throw new Errors.PostAggregatedData.DatasetDoesNotMatch(
          { uuAppErrorMap },
          {
            existingDataset,
            newDataset,
          }
        );
      }
    } else {
      dataset = await this.dao.getByTypeAndDate(awid, dtoIn.gatewayId, dtoIn.type, dtoIn.startDate);
      if (dataset) {
        ValidationHelper.addWarning(
          uuAppErrorMap,
          WARNINGS.postAggregatedData.datasetAlreadyExists.code,
          WARNINGS.postAggregatedData.datasetAlreadyExists.message,
          { awid, id: dataset.id }
        );
      }
    }

    // 6
    if (dataset) {
      dataset.data = mergeArrays(dataset.data, dtoIn.data, "timestamp");
    } else {
      dataset = dtoIn;
      dataset.awid = awid;
    }

    // 7
    dataset.data = sortObjectArrayByDate(dataset.data, "timestamp");

    // 8
    const typesWithAggregation = ["hourly", "daily"];
    if (typesWithAggregation.includes(dataset.type)) {
      dataset.aggregated = false;
    }

    // 9
    let dtoOut;
    if (dataset.id) {
      try {
        dtoOut = await this.dao.update(dataset);
      } catch (e) {
        if (e instanceof ObjectStoreError) {
          throw new Errors.PostAggregatedData.DatasetDaoUpdateFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    } else {
      try {
        dtoOut = await this.dao.create(dataset);
      } catch (e) {
        if (e instanceof ObjectStoreError) {
          throw new Errors.PostAggregatedData.DatasetDaoCreateFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    }

    // 10
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async markAggregated(awid, dtoIn) {
    let uuAppInstance = await instanceAbl.checkAndGet(
      awid,
      Errors.MarkAggregated.UuAppInstanceDoesNotExist,
      ["active", "restricted"],
      Errors.MarkAggregated.UuAppInstanceIsNotInCorrectState
    );

    // 2
    let validationResult = this.validator.validate("datasetMarkAggregatedDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.markAggregated.unsupportedKeys.code,
      Errors.MarkAggregated.InvalidDtoIn
    );

    // 3
    let dtoOut = {
      requested: dtoIn.datasetIdList.length,
      marked: 0,
      unmarked: 0,
      umarkedIdList: [],
    };

    let datasetsDoNotExist = {
      awid,
      count: 0,
      invalidIdList: [],
    };

    // 4
    const beforeDate = new Date(dtoIn.modifiedBefore);
    for (const datasetId of dtoIn.datasetIdList) {
      const dataset = await this.dao.get(awid, datasetId);
      if (!dataset) {
        datasetsDoNotExist.invalidIdList.push(datasetId);
        datasetsDoNotExist.count++;
      } else if (dataset.sys.mts >= beforeDate) {
        dtoOut.umarkedIdList.push(datasetId);
        dtoOut.unmarked++;
      } else {
        dataset.aggregated = true;
        try {
          await this.dao.update(dataset);
        } catch (e) {
          if (e instanceof ObjectStoreError) {
            throw new Errors.MarkAggregated.DatasetDaoUpdateFailed({ uuAppErrorMap }, { awid, id: datasetId }, e);
          }
          throw e;
        }
        dtoOut.marked++;
      }
    }

    // 5
    if (datasetsDoNotExist.count > 0) {
      ValidationHelper.addWarning(
        uuAppErrorMap,
        WARNINGS.markAggregated.datasetsDoNotExist.code,
        WARNINGS.markAggregated.datasetsDoNotExist.message,
        datasetsDoNotExist
      );
    }

    // 6
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async trimData(awid, dtoIn) {
    let uuAppInstance = await instanceAbl.checkAndGet(
      awid,
      Errors.TrimData.UuAppInstanceDoesNotExist,
      ["active", "restricted"],
      Errors.TrimData.UuAppInstanceIsNotInCorrectState
    );

    // 2
    let validationResult = this.validator.validate("datasetTrimDataDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.trimData.unsupportedKeys.code,
      Errors.TrimData.InvalidDtoIn
    );

    // 3
    try {
      await this.dao.deleteByTypeAndAggregationAndDate(awid, dtoIn.datasetType, true, dtoIn.endsBefore);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.TrimData.DatasetDaoDeleteFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // 4
    let dtoOut = { uuAppErrorMap };
    return dtoOut;
  }

  _momentToDateString(d) {
    return moment(d).format("YYYY-MM-DD");
  }

  _momentToDateTimeString(d) {
    return moment(d).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  }

  _formatToLabel(d, type) {
    const format = DATASET_TYPES[type].labelFormat;
    return moment(d).format(format);
  }

  _nextTimestamp(d, type) {
    const offset = DATASET_TYPES[type].entryOffset;
    return moment(d).add(offset);
  }

  _getStartDate(timestamp, datasetType) {
    switch (datasetType) {
      case "weekly": {
        return moment(timestamp).isoWeek(1).startOf("isoWeek").format("YYYY-MM-DD");
      }
      case "hourly": {
        return moment(timestamp).startOf("day").format("YYYY-MM-DD");
      }
      case "daily":
      case "monthly": {
        return moment(timestamp).startOf("year").format("YYYY-MM-DD");
      }
    }
  }

  _getEndDate(timestamp, datasetType) {
    switch (datasetType) {
      case "weekly": {
        const m = moment(timestamp);
        return m.isoWeek(m.isoWeeksInYear()).endOf("isoWeek").format("YYYY-MM-DD");
      }
      case "hourly": {
        return moment(timestamp).endOf("day").format("YYYY-MM-DD");
      }
      case "daily":
      case "monthly": {
        return moment(timestamp).endOf("year").format("YYYY-MM-DD");
      }
    }
  }

  _generateDataset(type, date, timezone) {
    const dataset = {
      startDate: this._getStartDate(date, type),
      endDate: this._getEndDate(date, type),
      type,
      data: [],
    };

    if (type === "detailed") {
      return dataset;
    }

    let nextMoment = moment.tz(dataset.startDate, timezone);
    const endMoment = moment.tz(dataset.endDate, timezone).endOf("day");

    do {
      const entry = {
        label: this._formatToLabel(nextMoment, type),
        timestamp: this._momentToDateTimeString(nextMoment),
        min: {
          temperature: null,
          humidity: null,
        },
        avg: {
          temperature: null,
          humidity: null,
        },
        max: {
          temperature: null,
          humidity: null,
        },
      };
      dataset.data.push(entry);
      nextMoment = this._nextTimestamp(nextMoment, type);
    } while (nextMoment.isBefore(endMoment));

    return dataset;
  }
}

module.exports = new DatasetAbl();
