/* eslint-disable no-prototype-builtins */
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
const cloneDeep = require("lodash.clonedeep");

const WARNINGS = {
  init: {
    unsupportedKeys: {
      code: `${Errors.Init.UC_CODE}unsupportedKeys`,
    },
    applicationIsAlreadyConnected: {
      code: `${Errors.Init.UC_CODE}applicationIsAlreadyConnected`,
      message: "Awsc already exists.",
    },
  },
  load: {
    unsupportedKeys: {
      code: `${Errors.Load.UC_CODE}unsupportedKeys`,
    },
  },
  scheduleScripts: {
    unsupportedKeys: {
      code: `${Errors.ScheduleScripts.UC_CODE}unsupportedKeys`,
    },
    oldConsoleSetStateFailed: {
      code: `${Errors.ScheduleScripts.UC_CODE}oldConsoleSetStateFailed`,
      message: "Failed to delete old console.",
    },
    oldConsoleDeleteFailed: {
      code: `${Errors.ScheduleScripts.UC_CODE}oldConsoleDeleteFailed`,
      message: "Failed to delete old console.",
    },
    oldProgressSetStateFailed: {
      code: `${Errors.ScheduleScripts.UC_CODE}oldProgressSetStateFailed`,
      message: "Failed to set old progress to final before removing it. It will not be removed.",
    },
    oldProgressDeleteFailed: {
      code: `${Errors.ScheduleScripts.UC_CODE}oldProgressDeleteFailed`,
      message: "Failed to delete old progress.",
    },
    scriptScheduleFailed: {
      code: `${Errors.ScheduleScripts.UC_CODE}scriptScheduleFailed`,
      message: "Script schedule failed.",
    },
    cancelScriptFailed: {
      code: `${Errors.ScheduleScripts.UC_CODE}cancelScriptFailed`,
      message: "Script cancel failed.",
    },
  },
};

const SCRIPTS = ["aggregate", "trim", "checkGateway"];

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

  async load(awid, dtoIn, authorizationResult) {
    // 1
    let uuAppInstance = await this.checkAndGet(
      awid,
      Errors.Load.UuAppInstanceDoesNotExist,
      ["active", "restricted"],
      Errors.Load.UuAppInstanceIsNotInCorrectState
    );

    // 2
    let validationResult = this.validator.validate("uuAppInstanceLoadDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.load.unsupportedKeys.code,
      Errors.Load.InvalidDtoIn
    );

    // 3
    const workspace = await UuAppWorkspace.get(awid);

    // 4
    if (!this.isAuthority(authorizationResult)) {
      delete uuAppInstance.externalResources;
    }

    // 5
    const authorizedProfilesList = authorizationResult.getAuthorizedProfiles();

    // 6
    let dtoOut = {
      uuAppInstance,
      authorizedProfilesList,
      workspace,
      uuAppErrorMap
    };
    return dtoOut;
  }

  async scheduleScripts(awid, dtoIn, uri, session) {
    // 1
    let uuAppInstance = await this.checkAndGet(
      awid,
      Errors.ScheduleScripts.UuAppInstanceDoesNotExist,
      ["active", "restricted"],
      Errors.ScheduleScripts.UuAppInstanceIsNotInCorrectState
    );

    // 2
    let validationResult = this.validator.validate("uuAppInstanceScheduleScriptsDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.scheduleScripts.unsupportedKeys.code,
      Errors.ScheduleScripts.InvalidDtoIn
    );

    const DEFAULTS = {
      removeExisting: true,
      rescheduleScripts: false,
      uuConsoleCode: `UUN_WS_MG01_${awid.substr(-8)}`,
      scripts: {
        aggregate: {
          cron: "0 5 * * * *",
          progressCode: `UUN_WS_MG01_${awid.substr(-8)}_aggregate`,
        },
        trim: {
          cron: "0 30 3 * * *",
          progressCode: `UUN_WS_MG01_${awid.substr(-8)}_trim`,
        },
        checkGateway: {
          cron: "0 25,55 * * * *",
          progressCode: `UUN_WS_MG01_${awid.substr(-8)}_checkGateway`,
        },
      },
    };

    const EXISTING_DEFAULTS = ["uuConsoleUri", "uuScriptEngineUri", "uuConsoleCode"];
    const SCRIPT_DEFAULTS = ["scriptUri", "cron", "progressCode"];
    const AUTHORIZATION_DEFAULTS = ["Authorities", "Writers", "Readers"];

    const existingValues = this.copyEnteredProps(uuAppInstance.externalResources, EXISTING_DEFAULTS);
    existingValues.scripts = {};
    SCRIPTS.forEach((script) => {
      existingValues.scripts[script] = this.copyEnteredProps(
        uuAppInstance.externalResources.scripts[script],
        SCRIPT_DEFAULTS
      );
    });
    existingValues.authorizationUriMap = this.copyEnteredProps(
      uuAppInstance.externalResources.authorizationUriMap,
      AUTHORIZATION_DEFAULTS
    );

    dtoIn = defaultsDeep(dtoIn, existingValues, DEFAULTS);

    // 3
    const TO_BASE_URIS = ["uuConsoleUri", "uuScriptEngineUri"];
    TO_BASE_URIS.forEach((key) => {
      dtoIn[key] = UriBuilder.parse(dtoIn[key]).toUri().getBaseUri().toString();
    });

    // 4
    const MANDATORY_KEYS = ["uuConsoleUri", "uuScriptEngineUri", "uuConsoleCode"];
    const MANDATORY_AUTH_KEYS = ["Authorities", "Writers", "Readers"];
    let missingKeys = [
      ...MANDATORY_KEYS.filter((key) => dtoIn.hasOwnProperty(key)),
      ...MANDATORY_AUTH_KEYS.filter((key) => dtoIn.authorizationUriMap.hasOwnProperty(key)).map(
        (key) => `authorizationUriMap.${key}`
      ),
    ];

    if (missingKeys.length > 0) {
      throw new Errors.ScheduleScripts.InsufficientConfig({ uuAppErrorMap }, { missingKeys });
    }

    // 5
    const previousConfig = cloneDeep(uuAppInstance.externalResources);

    // 6
    let console = null;
    const consoleClient = new AppClient({ baseUri: dtoIn.uuConsoleUri, session });
    try {
      console = await consoleClient.get("console/load", { code: dtoIn.uuConsoleCode });
    } catch (e) {
      console.log("Console does not already exist.", e);
    }

    const authorizationUriMapChanged = [...Object.keys(dtoIn.authorizationUriMap)].some(
      (key) => dtoIn.authorizationUriMap[key] !== previousConfig.authorizationUriMap[key]
    );

    if (!console) {
      const consoleCreateDtoIn = {
        code: dtoIn.uuConsoleCode, // uuConsoleCode
        name: "uunWeatherStation console",
        desc: "Log for uunWeatherStation external services",
        authorizationStrategy: "roleGroupInterface",
        authorizationUriMap: dtoIn.authorizationUriMap,
      };
      try {
        console = await consoleClient.post("console/create", consoleCreateDtoIn);
      } catch (e) {
        throw new Errors.ScheduleScripts.ConsoleCreateFailed(
          { uuAppErrorMap },
          { location: dtoIn.uuConsoleUri, code: dtoIn.uuConsoleCode },
          e
        );
      }
    } else if (authorizationUriMapChanged) {
      const consoleUpdateDtoIn = {
        code: dtoIn.uuConsoleCode,
        authorizationUriMap: dtoIn.authorizationUriMap,
      };
      try {
        console = await consoleClient.post("console/update", consoleUpdateDtoIn);
      } catch (e) {
        throw new Errors.ScheduleScripts.ConsoleUpdateFailed(
          { uuAppErrorMap },
          { location: dtoIn.uuConsoleUri, code: dtoIn.uuConsoleCode, dtoIn: consoleUpdateDtoIn },
          e
        );
      }
    }

    const hadConsole = previousConfig.uuConsoleUri && previousConfig.uuConsoleCode;
    const changedConsole =
      previousConfig.uuConsoleUri !== dtoIn.uuConsoleUri || previousConfig.uuConsoleCode !== dtoIn.uuConsoleCode;
    if (hadConsole && changedConsole && dtoIn.removeExisting) {
      const oldConsoleClient = new AppClient({ baseUri: previousConfig.uuConsoleUri, session });
      const consoleSetStateDtoIn = {
        code: previousConfig.uuConsoleCode,
        state: "final",
      };
      let consoleStateIsSet = false;
      try {
        console = await oldConsoleClient.post("console/setState", consoleSetStateDtoIn);
        consoleStateIsSet = true;
      } catch (e) {
        ValidationHelper.addWarning(
          uuAppErrorMap,
          WARNINGS.scheduleScripts.oldConsoleSetStateFailed.code,
          WARNINGS.scheduleScripts.oldConsoleSetStateFailed.message,
          {
            location: dtoIn.uuConsoleUri,
            code: dtoIn.uuConsoleCode,
            dtoIn: consoleSetStateDtoIn,
            cause: e,
          }
        );
      }

      if (consoleStateIsSet) {
        const consoleDeleteDtoIn = {
          code: previousConfig.uuConsoleCode,
        };
        try {
          console = await oldConsoleClient.post("console/delete", consoleDeleteDtoIn);
        } catch (e) {
          ValidationHelper.addWarning(
            uuAppErrorMap,
            WARNINGS.scheduleScripts.oldConsoleDeleteFailed.code,
            WARNINGS.scheduleScripts.oldConsoleDeleteFailed.message,
            {
              location: previousConfig.uuConsoleUri,
              code: previousConfig.uuConsoleCode,
              dtoIn: consoleDeleteDtoIn,
              cause: e,
            }
          );
        }
      }
    }

    if (changedConsole) {
      dtoIn.rescheduleScripts = true;
      uuAppInstance.externalResources.uuConsoleUri = dtoIn.uuConsoleUri;
      uuAppInstance.externalResources.uuConsoleCode = dtoIn.uuConsoleCode;
      try {
        uuAppInstance = await this.dao.update(uuAppInstance);
      } catch (e) {
        if (e instanceof ObjectStoreError) {
          throw new Errors.ScheduleScripts.ConsoleRefUuAppInstanceDaoUpdateFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    }

    // 7
    const progressCreateDtoInBase = {
      authorizationStrategy: "roleGroupInterface",
      authorizationUriMap: dtoIn.authorizationUriMap,
    };
    for (const script of SCRIPTS) {
      let progress = null;
      try {
        const progressGetDtoIn = {
          code: dtoIn.scripts[script].progressCode,
        };
        progress = await consoleClient.get("progress/get", progressGetDtoIn);
      } catch (e) {
        console.log(`Progress for script ${script} does not already exist.`, e);
      }

      const authorizationUriMapChanged = [...Object.keys(dtoIn.authorizationUriMap)].some(
        (key) => dtoIn.authorizationUriMap[key] !== previousConfig.authorizationUriMap[key]
      );

      if (!progress) {
        const progressCreateDtoIn = {
          ...progressCreateDtoInBase,
          code: dtoIn.scripts[script].progressCode,
          name: `${script} progress`,
          desc: `uunWeatherStation ${script} monitoring`,
        };
        try {
          progress = await consoleClient.post("progress/create", progressCreateDtoIn);
        } catch (e) {
          throw new Errors.ScheduleScripts.ProgressCreateFailed(
            { uuAppErrorMap },
            {
              location: dtoIn.uuConsoleUri,
              code: dtoIn.scripts[script].progressCode,
              dtoIn: progressCreateDtoIn,
              cause: e,
            }
          );
        }
      } else if (authorizationUriMapChanged) {
        const progressUpdateDtoIn = {
          code: dtoIn.scripts[script].progressCode,
          authorizationUriMap: dtoIn.authorizationUriMap,
        };
        try {
          progress = await consoleClient.post("progress/update", progressUpdateDtoIn);
        } catch (e) {
          throw new Errors.ScheduleScripts.ProgressUpdateFailed(
            { uuAppErrorMap },
            {
              location: dtoIn.uuConsoleUri,
              code: dtoIn.scripts[script].progressCode,
              dtoIn: progressUpdateDtoIn,
              cause: e,
            }
          );
        }
      }

      const hadProgress = previousConfig.uuConsoleUri && previousConfig.scripts[script].progressCode;
      const changedProgress =
        previousConfig.scripts[script].progressCode !== dtoIn.scripts[script].progressCode ||
        previousConfig.uuConsoleUri !== dtoIn.uuConsoleUri;
      if (hadProgress && changedProgress && dtoIn.removeExisting) {
        const oldConsoleClient = new AppClient({ baseUri: previousConfig.uuConsoleUri, session });
        let progressStateIsSet = false;
        const progressSetStateDtoIn = {
          code: previousConfig.scripts[script].progressCode,
          state: "final",
        };
        try {
          progress = await oldConsoleClient.post("progress/setState", progressSetStateDtoIn);
          progressStateIsSet = true;
        } catch (e) {
          ValidationHelper.addWarning(
            uuAppErrorMap,
            WARNINGS.scheduleScripts.oldProgressSetStateFailed.code,
            WARNINGS.scheduleScripts.oldProgressSetStateFailed.message,
            {
              location: previousConfig.uuConsoleUri,
              code: previousConfig.scripts[script].progressCode,
              dtoIn: progressSetStateDtoIn,
              cause: e,
            }
          );
        }

        if (progressStateIsSet) {
          const progressDeleteDtoIn = {
            code: previousConfig.scripts[script].progressCode,
          };
          try {
            progress = await oldConsoleClient.post("progress/delete", progressDeleteDtoIn);
          } catch (e) {
            ValidationHelper.addWarning(
              uuAppErrorMap,
              WARNINGS.scheduleScripts.oldProgressDeleteFailed.code,
              WARNINGS.scheduleScripts.oldProgressDeleteFailed.message,
              {
                location: previousConfig.uuConsoleUri,
                code: previousConfig.scripts[script].progressCode,
                dtoIn: progressDeleteDtoIn,
                cause: e,
              }
            );
          }
        }
      }
    }

    const anyProgressChanged = SCRIPTS.some(
      (script) => previousConfig.scripts[script].progressCode !== dtoIn.scripts[script].progressCode
    );
    if (anyProgressChanged) {
      SCRIPTS.forEach(
        (script) => (uuAppInstance.externalResources.scripts[script] = dtoIn.scripts[script].progressCode)
      );
      try {
        uuAppInstance = await this.dao.update(uuAppInstance);
      } catch (e) {
        if (e instanceof ObjectStoreError) {
          throw new Errors.ScheduleScripts.ProgressRefUuAppInstanceDaoUpdateFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    }

    // 8
    const baseUri = UriBuilder.parse(uri).toUri().getBaseUri().toString();
    const callbackUri = UriBuilder.parse(uri).getBaseUri().setUseCase("uuAppInstance/scriptCallback");
    const consoleLogUri = UriBuilder.parse(dtoIn.uuConsoleUri)
      .setUseCase("console/logMessage")
      .setParameter("code", dtoIn.uuConsoleCode)
      .toUri()
      .toString();
    const runScriptDtoInBase = {
      notBeforeTime: "...", // now + 10 mins
      consoleUri: consoleLogUri, // uuConsole uri from dtoIn with code set to uuConsoleCode
      callbackUri,
      callbackHttpMethod: "POST",
      invokeRetryAfter: [],
    };
    const scriptClient = new AppClient({ baseUri: dtoIn.uuScriptEngineUri, session });
    for (const script of SCRIPTS) {
      const scriptShouldBeScheduled =
        dtoIn.rescheduleScripts ||
        previousConfig.scripts[script].scriptUri !== dtoIn.scripts[script].scriptUri ||
        previousConfig.uuScriptEngineUri !== dtoIn.uuScriptEngineUri;
      if (scriptShouldBeScheduled) {
        const runScriptDtoIn = {
          ...runScriptDtoInBase,
          scriptUri: dtoIn.scripts[script].scriptUri,
          scriptDtoIn: {
            uuConsoleUri: dtoIn.uuConsoleUri,
            progressCode: dtoIn.scripts[script].progressCode,
            baseUri,
          },
          repeatTrigger: {
            type: "cron",
            concurrencyPolicy: "forbid",
            timeZone: "...", // config timezone
            repeatCount: -1,
            cronExpression: dtoIn.scripts[script].cron,
          },
          callbackData: {
            script,
          },
        };
        let runScriptDtoOut = null;
        try {
          runScriptDtoOut = await scriptClient.post("engine/runScript", runScriptDtoIn);
        } catch (e) {
          ValidationHelper.addWarning(
            uuAppErrorMap,
            WARNINGS.scheduleScripts.scriptScheduleFailed.code,
            WARNINGS.scheduleScripts.scriptScheduleFailed.message,
            {
              location: dtoIn.uuScriptEngineUri,
              script,
              dtoIn: runScriptDtoIn,
              cause: e,
            }
          );
        }
        uuAppInstance.externalResources.scripts[script].scriptRunId = runScriptDtoOut.scriptRunId;
        uuAppInstance.externalResources.scripts[script].lastDtoOut = {};
        uuAppInstance.externalResources.scripts[script].lastCallback = null;
      }

      const rescheduledScript =
        uuAppInstance.externalResources.scripts[script].scriptRunId !== previousConfig.scripts[script].scriptRunId ||
        uuAppInstance.externalResources.scripts[script].scriptRunId !== null;
      if (rescheduledScript) {
        const oldScriptClient = new AppClient({ baseUri: previousConfig.uuScriptEngineUri, session });
        const cancelScriptDtoIn = {
          scriptRunId: previousConfig.scripts[script].scriptRunId,
        };
        try {
          await oldScriptClient.post("engine/cancelScript", cancelScriptDtoIn);
        } catch (e) {
          ValidationHelper.addWarning(
            uuAppErrorMap,
            WARNINGS.scheduleScripts.cancelScriptFailed.code,
            WARNINGS.scheduleScripts.cancelScriptFailed.message,
            {
              location: previousConfig.uuScriptEngineUri,
              script,
              dtoIn: cancelScriptDtoIn,
              cause: e,
            }
          );
        }
      }
    }

    // 9
    uuAppInstance.externalResources.uuScriptEngineUri = dtoIn.uuScriptEngineUri;
    try {
      uuAppInstance = await this.dao.update(uuAppInstance);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.ScheduleScripts.UuAppInstanceDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // 10
    let dtoOut = {
      ...uuAppInstance,
      uuAppErrorMap,
    };
    return dtoOut;
  }

  async checkAndGet(awid, notExistError, allowedStates = null, incorrectStateError = null, dtoOut = {}) {
    let uuAppInstance = await this.dao.getByAwid(awid);
    if (!uuAppInstance) {
      throw new notExistError(dtoOut, { awid });
    } else if (allowedStates && !allowedStates.includes(uuAppInstance.state)) {
      throw new incorrectStateError(dtoOut, { awid, state: uuAppInstance.state, allowedStates });
    }
    return uuAppInstance;
  }

  isAuthority(authorizationResult) {
    const userProfiles = authorizationResult.getAuthorizedProfiles();
    const authorityProfiles = ["Authorities", "AwidLicenseOwner"];

    return authorityProfiles.some((aprof) => userProfiles.includes(aprof));
  }

  copyEnteredProps(o, keys = []) {
    return keys.reduce((newObj, key) => {
      const value = o[key];
      if (value != undefined) {
        newObj[key] = value;
      }
      return newObj;
    }, {});
  }
}

module.exports = new UuAppInstanceAbl();
