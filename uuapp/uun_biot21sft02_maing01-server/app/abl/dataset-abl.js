"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/dataset-error.js");

const instanceAbl = require("./uu-app-instance-abl.js");

const defaultsDeep = require("lodash.defaultsdeep");
const moment = require("moment-timezone");

const WARNINGS = {
  get: {
    unsupportedKeys: {
      code: `${Errors.Get.UC_CODE}unsupportedKeys`
    },
  },
  listByDates: {
    unsupportedKeys: {
      code: `${Errors.ListByDates.UC_CODE}unsupportedKeys`
    },
  },
  listUnaggregatedData: {
    unsupportedKeys: {
      code: `${Errors.ListUnaggregatedData.UC_CODE}unsupportedKeys`
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
          date: dtoIn.date
        }
      );
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
        pageSize: 100
      }
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
      case "daily", "monthly": {
        dtoIn.startDate = moment(dtoIn.startDate).startOf("year").format("YYYY-MM-DD");
        dtoIn.endDate = moment(dtoIn.endDate).endOf("year").format("YYYY-MM-DD");
        break;
      }
      case "detailed", "hourly":
      default: {
        break;
      }
    }

    // 6
    let dtoOut = this.dao.listByTypeAndDateRange(awid, gateway.id, dtoIn.type, dtoIn.startDate, dtoIn.endDate, dtoIn.pageInfo);

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
        pageSize: 100
      }
    };
    dtoIn = defaultsDeep(dtoIn, defaults);

    // 3
    let dtoOut = await this.dao.listByAggregation(awid, dtoIn.type, false, dtoIn.pageInfo);

    // 4
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

}

module.exports = new DatasetAbl();
