"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Permission, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const Errors = require("../api/errors/gateway-error.js");

const instanceAbl = require("./uu-app-instance-abl.js");

const random = require("crypto-random-string");
const defaultsDeep = require("lodash.defaultsdeep");

const WARNINGS = {
  create: {
    unsupportedKeys: {
      code: `${Errors.Create.UC_CODE}unsupportedKeys`
    }
  },
  update: {
    unsupportedKeys: {
      code: `${Errors.Update.UC_CODE}unsupportedKeys`
    },
    gatewayCodeIsChanged: {
      code: `${Errors.Update.UC_CODE}gatewayCodeIsChanged`,
      message: `Gateway code has been changed. If this gateway has any external references, please change them.`
    }
  },
  get: {
    unsupportedKeys: {
      code: `${Errors.Get.UC_CODE}unsupportedKeys`
    },
  },
  list: {
    unsupportedKeys: {
      code: `${Errors.List.UC_CODE}unsupportedKeys`
    },
  }
};

class GatewayAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("gateway");
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

    const enteredCode = dtoIn.hasOwnProperty("code");

    const defaults = {
      code: this._generateUniqueCode(awid),
      name: "",
      location: null
    }
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
          awid, uuEe: dtoIn.uuEe,
          existingCode: existingGatewayByUuEe.code
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
      throw (e);
    }

    // 6
    let gateway = { ...dtoIn };
    const gatewayDefaults = {
      awid,
      state: "created",
      current: {
        temperature: null,
        humidity: null,
        timestamp: null
      },
      min: {
        temperature: null,
        humidity: null
      },
      max: {
        temperature: null,
        humidity: null
      }
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

    // 3
    let gateway = await this.dao.get(awid, dtoIn.id);
    if (gateway) {
      throw new Errors.Update.GatewayDoesNotExist({ uuAppErrorMap }, { awid, id: dtoIn.id });
    }

    // 4
    if (gateway.state === "closed" && dtoIn.state === "closed") {
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
    gateway = defaultsDeep(gateway, dtoIn);
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
        [identifier]: dtoIn[identifier]
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
        pageSize: 100
      }
    }
    dtoIn = defaultsDeep(dtoIn, defaults);

    // 3
    if (uuAppInstance.state === "restricted" && !instanceAbl.isAuthority(authorizationResult)) {
      throw new Errors.List.NotAuthorized();
    }

    // 4
    let dtoOut;
    if (dtoIn.state) {
      dtoOut = await this.dao.listByState(awid, dtoIn.state, dtoIn.pageInfo)
    } else {
      dtoOut = await this.dao.list(awid, dtoIn.pageInfo);
    }

    // 5
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async _generateUniqueCode(awid) {
    let code = null;
    let instance = null;
    do {
      code = random(10);
      instance = await this.dao.getByCode(awid, code);
    } while (instance !== null)
    return code;
  }

}

module.exports = new GatewayAbl();
