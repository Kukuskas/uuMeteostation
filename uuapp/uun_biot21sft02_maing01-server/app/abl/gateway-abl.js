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
  }
};

class GatewayAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("gateway");
  }

  async create(awid, dtoIn) {
    // 1
    let uuAppInstance = instanceAbl.checkAndGet(
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
    let gateway = {...dtoIn};
    const gatewayDefaults = {
      awid,
      state: "created",
      current: {
        temperature: null,
        humidity: null,
        timestamp: null
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
