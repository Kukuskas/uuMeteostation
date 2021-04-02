"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, AppClientTokenService, UuAppWorkspace, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { LoggerFactory } = require("uu_appg01_server").Logging;
const { AppClient } = require("uu_appg01_server");
const Errors = require("../api/errors/uu-app-instance-error.js");

const defaultsDeep = require("lodash.defaultsdeep");

const WARNINGS = {
  init: {
    unsupportedKeys: {
      code: `${Errors.Init.UC_CODE}unsupportedKeys`,
    },
    applicationIsAlreadyConnected: {
      code: `${Errors.Init.UC_CODE}applicationIsAlreadyConnected`,
      message: "Awsc already exists."
    }
  }
};

const logger = LoggerFactory.get("Biot21sft02MainAbl");

class UuAppInstanceAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("uuAppInstance");
  }

  async init(uri, dtoIn, session) {
    const awid = uri.getAwid();

    // 1
    let instance = await this.dao.getByAwid(awid);

    if (instance) {
      throw new Errors.Init.InstanceAlreadyExists({ uuAppErrorMap: {} }, { awid });
    }

    // 2
    let validationResult = this.validator.validate("initDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.init.unsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );

    const defaults = {
      state: "active",

      sysState: "active",
      uuAppProfileAuthorities: null,
      uuBtLocationUri: null,

      retentionPolicy: {
        detailed: null,
        daily: null
      }
    }

    dtoIn = defaultsDeep(dtoIn, defaults);

    // 3
    const schemas = ["uuAppInstance", "gateway", "dataset"];
    let schemaCreateResults = schemas.map(async (schema) => {
      try {
        return await DaoFactory.getDao(schema).createSchema();
      } catch (e) {
        // A3
        throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, { schema }, e);
      }
    });
    await Promise.all(schemaCreateResults);

    // 4
    if (dtoIn.uuBtLocationUri) {
      const baseUri = uri.getBaseUri();
      const uuBtUriBuilder = UriBuilder.parse(dtoIn.uuBtLocationUri);
      const location = uuBtUriBuilder.getParameters().id;
      const uuBtBaseUri = uuBtUriBuilder.toUri().getBaseUri();

      const createAwscDtoIn = {
        name: "UunBiot21sft02",
        typeCode: "uun-biot21sft02-maing01",
        location: location,
        uuAppWorkspaceUri: baseUri,
      };

      const awscCreateUri = uuBtUriBuilder.setUseCase("uuAwsc/create").toUri();
      const appClientToken = await AppClientTokenService.createToken(uri, uuBtBaseUri);
      const callOpts = AppClientTokenService.setToken({ session }, appClientToken);

      let awscId;
      try {
        const awscDtoOut = await AppClient.post(awscCreateUri, createAwscDtoIn, callOpts);
        awscId = awscDtoOut.id;
      } catch (e) {
        if (e.code.includes("applicationIsAlreadyConnected") && e.paramMap.id) {
          logger.warn(`Awsc already exists id=${e.paramMap.id}.`, e);
          awscId = e.paramMap.id;
        } else {
          throw new Errors.Init.CreateAwscFailed({ uuAppErrorMap }, { location: dtoIn.uuBtLocationUri }, e);
        }
      }

      const artifactUri = uuBtUriBuilder.setUseCase(null).clearParameters().setParameter("id", awscId).toUri();

      await UuAppWorkspace.connectArtifact(
        baseUri,
        {
          artifactUri: artifactUri.toString(),
          synchronizeArtifactBasicAttributes: false,
        },
        session
      );
    }

    // 5
    if (dtoIn.uuAppProfileAuthorities) {
      try {
        await Profile.set(awid, "Authorities", dtoIn.uuAppProfileAuthorities);
      } catch (e) {
        if (e instanceof UuAppWorkspaceError) {
          // A4
          throw new Errors.Init.SysSetProfileFailed({ uuAppErrorMap }, { role: dtoIn.uuAppProfileAuthorities }, e);
        }
        throw e;
      }
    }

    // 6
    let uuAppInstance = {
      awid
    }

    const copiedProps = ["name", "desc", "state", "retentionPolicy"];
    copiedProps.forEach((prop) => {
      uuAppInstance[prop] = dtoIn[prop]
    });

    const emptyScriptData = {
      scriptUri: null,
      cron: null,
      lastCallback: null,
      lastDtoOut: {},
      jobId: null,
      progressCode: null
    }
    uuAppInstance.externalResources = {
      uuConsoleUri: null,
      uuConsoleCode: null,
      uuScriptEngineUri: null,
      scripts: {
        aggregate: emptyScriptData,
        trim: emptyScriptData,
        checkGateway: emptyScriptData
      }
    }

    try {
      uuAppInstance = await this.dao.create(uuAppInstance);
    } catch (e) {
      throw new Errors.Init.UuAppInstanceDaoCreateFailed({ uuAppErrorMap }, { awid }, e);
    }

    // 7
    const workspace = await UuAppWorkspace.get(awid);

    // 8
    return {
      ...uuAppInstance,
      workspace,
      uuAppErrorMap,
    };
  }



  async checkAndGet(awid, notExistError, allowedStates = null, incorrectStateError = null, dtoOut = {}, ) {
    let uuAppInstance = await this.dao.getByAwid(awid);
    if (!uuAppInstance) {
      throw new notExistError(dtoOut, { awid });
    } else if (allowedStates && !allowedStates.includes(uuAppInstance.state)) {
      throw new incorrectStateError(dtoOut, { awid, state: uuAppInstance.state, allowedStates });
    }
    return uuAppInstance;
  }

}

module.exports = new UuAppInstanceAbl();
