"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/dataset-error.js");

const instanceAbl = require("./uu-app-instance-abl.js");

const defaultsDeep = require("lodash.defaultsdeep");

const WARNINGS = {
  get: {
    unsupportedKeys: {
      code: `${Errors.Get.UC_CODE}unsupportedKeys`
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
    const identifiedByCode = dtoIn.hasOwnProperty("gatewayCode");
    let gateway, identifier;
    if (identifiedByCode) {
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

}

module.exports = new DatasetAbl();
