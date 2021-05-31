"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Permission, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const { LoggerFactory } = require("uu_appg01_server").Logging;
const Errors = require("../api/errors/gateway-error.js");

const instanceAbl = require("./uu-app-instance-abl.js");

const { strToDate, isSameDate, sortIsoDates } = require("./helpers/date-helper.js");

const random = require("crypto-random-string");
const defaultsDeep = require("lodash.defaultsdeep");
const moment = require("moment-timezone");

const WARNINGS = {
  create: {
    unsupportedKeys: {
      code: `${Errors.Create.UC_CODE}unsupportedKeys`,
    },
  },
  update: {
    unsupportedKeys: {
      code: `${Errors.Update.UC_CODE}unsupportedKeys`,
    },
    gatewayCodeIsChanged: {
      code: `${Errors.Update.UC_CODE}gatewayCodeIsChanged`,
      message: `Gateway code has been changed. If this gateway has any external references, please change them.`,
    },
  },
  get: {
    unsupportedKeys: {
      code: `${Errors.Get.UC_CODE}unsupportedKeys`,
    },
  },
  list: {
    unsupportedKeys: {
      code: `${Errors.List.UC_CODE}unsupportedKeys`,
    },
  },
  postData: {
    unsupportedKeys: {
      code: `${Errors.PostData.UC_CODE}unsupportedKeys`,
    },
  },
  logMessage: {
    unsupportedKeys: {
      code: `${Errors.LogMessage.UC_CODE}unsupportedKeys`,
    },
  },
  delete: {
    unsupportedKeys: {
      code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
    },
  },
};

const gatewayLogLogger = LoggerFactory.get("Gateway:GatewayLog");

class GatewayAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("gateway");
    this.datasetDao = DaoFactory.getDao("dataset");
  }

  async create(awid, dtoIn) {
    // 1
    let uuAppInstance = await instanceAbl.checkAndGet(
      awid,
      Errors.Create.UuAppInstanceDoesNotExist,
      ["active", "restricted"],
      Errors.Create.UuAppInstanceIsNotInCorrectState
    );

    // 2
    let validationResult = this.validator.validate("gatewayCreateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.create.unsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    const validTimezones = moment.tz.names();
    if (!validTimezones.includes(dtoIn.timezone)) {
      throw new Errors.Create.InvalidTimezone({ uuAppErrorMap }, { timezone: dtoIn.timezone, validTimezones });
    }

    const enteredCode = dtoIn.hasOwnProperty("code");

    const defaults = {
      code: await this._generateUniqueCode(awid),
      name: "",
      location: null,
    };

    dtoIn = defaultsDeep(dtoIn, defaults);

    // 3
    if (enteredCode) {
      const existingGatewayByCode = await this.dao.getByCode(awid, dtoIn.code);
      if (existingGatewayByCode) {
        throw new Errors.Create.CodeIsNotUnique({ uuAppErrorMap }, { awid, code: dtoIn.code });
      }
    }

    // 4
    const existingGatewayByUuEe = await this.dao.getByUuEe(awid, dtoIn.uuEe);
    if (existingGatewayByUuEe) {
      throw new Errors.Create.UuEeIsNotUnique(
        { uuAppErrorMap },
        {
          awid,
          uuEe: dtoIn.uuEe,
          existingCode: existingGatewayByUuEe.code,
        }
      );
    }

    // 5
    try {
      await Permission.create(awid, "Gateways", dtoIn.uuEe);
    } catch (e) {
      if (e instanceof UuAppWorkspaceError) {
        throw new Errors.Create.PermissionCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // 6
    let gateway = { ...dtoIn };
    const gatewayDefaults = {
      awid,
      state: "created",
      log: [],
      current: {
        temperature: null,
        humidity: null,
        timestamp: null,
      },
      min: {
        temperature: null,
        humidity: null,
      },
      max: {
        temperature: null,
        humidity: null,
      },
    };
    gateway = defaultsDeep(gateway, gatewayDefaults);
    try {
      gateway = await this.dao.create(gateway);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Create.GatewayDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // 7
    let dtoOut = { ...gateway, uuAppErrorMap };
    return dtoOut;
  }

  async update(awid, dtoIn) {
    // 1
    let uuAppInstance = await instanceAbl.checkAndGet(
      awid,
      Errors.Update.UuAppInstanceDoesNotExist,
      ["active", "restricted"],
      Errors.Update.UuAppInstanceIsNotInCorrectState
    );

    // 2
    let validationResult = this.validator.validate("gatewayUpdateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.update.unsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    if (dtoIn.timezone) {
      const validTimezones = moment.tz.names();
      if (!validTimezones.includes(dtoIn.timezone)) {
        throw new Errors.Update.InvalidTimezone({ uuAppErrorMap }, { timezone: dtoIn.timezone, validTimezones });
      }
    }

    // 3
    let gateway = await this.dao.get(awid, dtoIn.id);
    if (!gateway) {
      throw new Errors.Update.GatewayDoesNotExist({ uuAppErrorMap }, { awid, id: dtoIn.id });
    }

    // 4
    if (gateway.state === "closed" && dtoIn.state !== "closed") {
      throw new Errors.Update.GatewayIsNotInCorrectState(
        { uuAppErrorMap },
        { awid, id: dtoIn.id, state: gateway.state }
      );
    }

    // 5
    if (dtoIn.code && dtoIn.code !== gateway.code) {
      const collidingGateway = await this.dao.getByCode(awid, dtoIn.code);
      if (collidingGateway) {
        throw new Errors.Update.CodeAlreadyExists({ uuAppErrorMap }, { awid, code: dtoIn.code });
      }
      ValidationHelper.addWarning(
        uuAppErrorMap,
        WARNINGS.update.gatewayCodeIsChanged.code,
        WARNINGS.update.gatewayCodeIsChanged.message,
        { awid, oldCode: gateway.code, newCode: dtoIn.code }
      );
    }

    // 6
    if (dtoIn.uuEe && dtoIn.uuEe !== gateway.uuEe) {
      try {
        await Permission.delete(awid, "Gateways", gateway.uuEe);
      } catch (e) {
        if (e instanceof UuAppWorkspaceError) {
          throw new Errors.Update.PermissionDeleteFailed({ uuAppErrorMap }, { uuEe: gateway.uuEe }, e);
        }
        throw e;
      }

      try {
        await Permission.create(awid, "Gateways", dtoIn.uuEe);
      } catch (e) {
        if (e instanceof UuAppWorkspaceError) {
          throw new Errors.Update.PermissionCreateFailed({ uuAppErrorMap }, { uuEe: dtoIn.uuEe }, e);
        }
        throw e;
      }
    }

    // 7
    gateway = defaultsDeep(dtoIn, gateway);
    try {
      gateway = await this.dao.update(gateway);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Update.GatewayDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // 8
    let dtoOut = { ...gateway, uuAppErrorMap };
    return dtoOut;
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
    let validationResult = this.validator.validate("gatewayGetDtoInType", dtoIn);
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
    let gateway;
    let identifier;
    if (dtoIn.id) {
      identifier = "id";
      gateway = await this.dao.get(awid, dtoIn.id);
    } else if (dtoIn.code) {
      identifier = "code";
      gateway = await this.dao.getByCode(awid, dtoIn.code);
    } else {
      identifier = "uuEe";
      gateway = await this.dao.getByUuEe(awid, dtoIn.uuEe);
    }

    if (!gateway) {
      const errorParams = {
        awid,
        [identifier]: dtoIn[identifier],
      };
      throw new Errors.Get.GatewayDoesNotExist({ uuAppErrorMap }, errorParams);
    }

    // 5
    let dtoOut = { ...gateway, uuAppErrorMap };
    return dtoOut;
  }

  async list(awid, dtoIn, authorizationResult) {
    // 1
    let uuAppInstance = await instanceAbl.checkAndGet(
      awid,
      Errors.Get.UuAppInstanceDoesNotExist,
      ["active", "restricted"],
      Errors.Get.UuAppInstanceIsNotInCorrectState
    );

    // 2
    let validationResult = this.validator.validate("gatewayListDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.list.unsupportedKeys.code,
      Errors.List.InvalidDtoIn
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
      throw new Errors.List.NotAuthorized();
    }

    // 4
    let dtoOut;
    if (dtoIn.state) {
      dtoOut = await this.dao.listByState(awid, dtoIn.state, dtoIn.pageInfo);
    } else {
      dtoOut = await this.dao.list(awid, dtoIn.pageInfo);
    }

    // 5
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async postData(awid, dtoIn, session, authorizationResult) {
    // 1
    let uuAppInstance = await instanceAbl.checkAndGet(
      awid,
      Errors.PostData.UuAppInstanceDoesNotExist,
      ["active", "restricted"],
      Errors.PostData.UuAppInstanceIsNotInCorrectState
    );

    // 2
    let validationResult = this.validator.validate("gatewayPostDataDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.postData.unsupportedKeys.code,
      Errors.PostData.InvalidDtoIn
    );

    // 3
    if (dtoIn.id && !instanceAbl.isAuthority(authorizationResult)) {
      throw new Errors.PostData.NotAuthorizedToSpecifyId();
    }

    // 4
    let gateway;
    let identifier;
    if (dtoIn.id) {
      gateway = await this.dao.get(awid, dtoIn.id);
      identifier = { awid, id: dtoIn.id };
    } else {
      const uuEe = session.getIdentity().getUuIdentity();
      identifier = { awid, uuEe };
      gateway = await this.dao.getByUuEe(awid, uuEe);
    }

    if (!gateway) {
      throw new Errors.PostData.GatewayDoesNotExist({ uuAppErrorMap }, identifier);
    }
    const allowedStates = ["created", "active", "disconnected"];
    if (!allowedStates.includes(gateway.state)) {
      throw new Errors.PostData.GatewayIsNotInCorrectState(
        { uuAppErrorMap },
        { awid, id: gateway.id, state: gateway.state, allowedStates }
      );
    }

    // 5
    const receivedDateString = dtoIn.data[0].timestamp;
    const datasetDate = strToDate(receivedDateString);
    dtoIn.data.forEach((entry) => {
      if (!isSameDate(receivedDateString, entry.timestamp)) {
        throw new Errors.PostData.InvalidEntryDate({ uuAppErrorMap }, { expectedDate: datasetDate, dataEntry: entry });
      }
    });

    // 6
    let dataset = await this.datasetDao.getByTypeAndDate(awid, gateway.id, "detailed", datasetDate);
    if (!dataset) {
      dataset = {
        awid,
        gatewayId: gateway.id,
        startDate: datasetDate,
        endDate: datasetDate,
        type: "detailed",
        data: [],
        aggregated: false,
      };
    }

    // 7
    dataset.data = this._mergeDatasetData(dataset.data, dtoIn.data);

    // 8
    if (dataset.id) {
      try {
        dataset = await this.datasetDao.update(dataset);
      } catch (e) {
        if (e instanceof ObjectStoreError) {
          throw new Errors.PostData.DatasetDaoUpdateFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    } else {
      try {
        dataset = await this.datasetDao.create(dataset);
      } catch (e) {
        if (e instanceof ObjectStoreError) {
          throw new Errors.PostData.DatasetDaoCreateFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    }

    // 9
    const latestEntry = dataset.data[dataset.data.length - 1];
    const lastEnteredTimestamp = new Date(latestEntry.timestamp);
    const lastGatewayUpdate = new Date(gateway.current.timestamp);
    if (lastGatewayUpdate < lastEnteredTimestamp || gateway.current.timestamp === null) {
      gateway.current = latestEntry;
      if (!dtoIn.id) {
        gateway.state = "active";
      }
      try {
        gateway = await this.dao.update(gateway);
      } catch (e) {
        throw new Errors.PostData.GatewayDaoUpdateFailed({ uuAppErrorMap }, e);
      }
    }

    // 10
    let dtoOut = { ...dataset, gateway, uuAppErrorMap };
    return dtoOut;
  }

  async logMessage(awid, dtoIn, session) {
    // 1
    let uuAppInstance = await instanceAbl.checkAndGet(
      awid,
      Errors.LogMessage.UuAppInstanceDoesNotExist,
      ["active", "restricted"],
      Errors.LogMessage.UuAppInstanceIsNotInCorrectState
    );

    // 2
    let validationResult = this.validator.validate("gatewayLogMessageDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.logMessage.unsupportedKeys.code,
      Errors.LogMessage.InvalidDtoIn
    );

    // 3'
    const uuEe = session.getIdentity().getUuIdentity();
    let gateway = await this.dao.getByUuEe(awid, uuEe);
    if (!gateway) {
      throw new Errors.LogMessage.GatewayDoesNotExist({ uuAppErrorMap }, { awid, uuEe });
    }
    const allowedStates = ["created", "active"];
    if (!allowedStates.includes(gateway.state)) {
      throw new Errors.LogMessage.GatewayIsNotInCorrectState(
        { uuAppErrorMap },
        { awid, id: gateway.id, state: gateway.state, allowedStates }
      );
    }

    // 4
    let gatewayLog = {
      awid,
      gatewayId: gateway.id,
      ...dtoIn,
    };
    gatewayLogLogger.log(gatewayLog);

    // 5
    let gatewayLogEntry = {
      timestamp: new Date().toISOString(),
      ...dtoIn,
    };
    if (!gateway.log) {
      gateway.log = [];
    }
    gateway.log.unshift(gatewayLogEntry);
    gateway.log = gateway.log.slice(0, 10);
    try {
      gateway = await this.dao.update(gateway);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.LogMessage.GatewayDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // 6
    let dtoOut = { ...gateway, uuAppErrorMap };
    return dtoOut;
  }

  async delete(awid, dtoIn) {
    // 1
    let uuAppInstance = await instanceAbl.checkAndGet(
      awid,
      Errors.Delete.UuAppInstanceDoesNotExist,
      ["active", "restricted"],
      Errors.Delete.UuAppInstanceIsNotInCorrectState
    );

    // 2
    let validationResult = this.validator.validate("gatewayDeleteDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.delete.unsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    // 3
    const gateway = await this.dao.get(awid, dtoIn.id);
    if (!gateway) {
      throw new Errors.Delete.GatewayDoesNotExist({ uuAppErrorMap }, { awid, id: dtoIn.id });
    }
    const allowedStates = ["closed"];
    if (!allowedStates.includes(gateway.state)) {
      throw new Errors.Delete.GatewayIsNotInCorrectState(
        { uuAppErrorMap },
        { awid, id: dtoIn.id, state: gateway.state, allowedStates }
      );
    }

    // 4
    try {
      await this.datasetDao.deleteByGatewayId(awid, dtoIn.id);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Delete.Dataset({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // 5
    try {
      await Permission.delete(awid, "Gateways", gateway.uuEe);
    } catch (e) {
      if (e instanceof UuAppWorkspaceError) {
        throw new Errors.Delete.PermissionDeleteFailed({ uuAppErrorMap }, { uuEe: gateway.uuEe }, e);
      }
      throw e;
    }

    // 6
    try {
      await this.dao.delete(awid, dtoIn.id);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Delete.GatewayDaoDeleteFailed({ uuAppErrorMap }, { awid, id: dtoIn.id }, e);
      }
      throw e;
    }

    // 7
    let dtoOut = { success: true, uuAppErrorMap };
    return dtoOut;
  }

  async _generateUniqueCode(awid) {
    let code = null;
    let instance = null;
    do {
      code = random(10);
      instance = await this.dao.getByCode(awid, code);
    } while (instance !== null);
    return code;
  }

  _mergeDatasetData(...dataArrays) {
    let dataObject = {};
    dataArrays.forEach((dataArray) => {
      dataArray.forEach((entry) => {
        dataObject[entry.timestamp] = entry;
      });
    });

    let timestamps = Object.keys(dataObject);
    timestamps = sortIsoDates(timestamps);

    let dataArray = [];
    timestamps.forEach((entry) => {
      dataArray.push(dataObject[entry]);
    });

    return dataArray;
  }
}

module.exports = new GatewayAbl();
