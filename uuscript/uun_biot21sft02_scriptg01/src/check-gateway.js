const AppClient = require("uu_appg01_server").AppClient;
const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UseCaseError } = require("uu_appg01_server").AppServer;

const { dtoIn, console, session } = scriptContext;

// validation schema
const DTOIN_SCHEMA = `
const checkGatewayDtoInType = shape({
  baseUri: uri().isRequired()
});`;

// defaults

// constants

// errors
const ScriptError = class extends UseCaseError {
  constructor(dtoOut, paramMap = {}, cause = null) {
    if (paramMap instanceof Error) {
      cause = paramMap;
      paramMap = {};
    }
    super({ dtoOut, paramMap, status: 400 }, cause);
  }
};

const ERRORS = {
  ERROR_PREFIX: "uun-biot21sft02-scriptg01/checkGateway/",

  InvalidDtoIn: class extends ScriptError {
    constructor() {
      super(...arguments);
      this.code = `${ERRORS.ERROR_PREFIX}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  WeatherstationLoadFailed: class extends ScriptError {
    constructor() {
      super(...arguments);
      this.code = `${ERRORS.ERROR_PREFIX}weatherstationLoadFailed`;
      this.message = "Failed to load weatherstation instance.";
    }
  },

  WeatherstationIsClosed: class extends ScriptError {
    constructor() {
      super(...arguments);
      this.code = `${ERRORS.ERROR_PREFIX}weatherstationIsClosed`;
      this.message = "WeatherStation is in closed state and can't be updated.";
    }
  }
};

// warnings
const WARNINGS = {
  unsupportedKeys: {
    code: `${ERRORS.ERROR_PREFIX}unsupportedKeys`
  },
  progressProceedFailed: {
    code: ` ${ERRORS.ERROR_PREFIX}progressProceedFailed`,
    message: `Progress proceed call failed.`
  }
};

// global vars
let weatherstationClient = null;
let progressClient = null;
let progressCode = null;

// helpers
async function proceed({ message = "Script is running.", state = "running", totalWork = null, doneWork = null }, logError = true, uuAppErrorMap = {}) {
  try {
    await progressClient.post("progress/proceed", {
      code: progressCode,
      message,
      state,
      totalWork,
      doneWork
    });
  } catch (e) {
    await addWarning(WARNINGS.progressProceedFailed, uuAppErrorMap, { cause: e });
  }
}

// error and warning processing
async function throwError(error) {
  await progressClient.post("progress/setState", {
    code: progressCode,
    state: "runningWithCode",
    message: "Script has exited with an error.",
    data: error
  });

  // no need to write it into console, it will be logged automatically
  throw error;
}

async function addWarning(warning, uuAppErrorMap, paramMap = {}) {
  ValidationHelper.addWarning(uuAppErrorMap, warning.code, warning.message ?? null, paramMap);
}

// steps
function validateDtoIn() {
  const validator = new Validator(DTOIN_SCHEMA);
  const validationResult = validator.validate("checkGatewayDtoInType", dtoIn);

  return ValidationHelper.processValidationResult(dtoIn, validationResult, WARNINGS.unsupportedKeys.code, ERRORS.InvalidDtoIn);
}

async function loadAppInstance(uuAppErrorMap) {
  let dtoOut;
  try {
    dtoOut = await weatherstationClient.get("uuAppInstance/load", {});
  } catch (e) {
    throw new ERRORS.WeatherstationLoadFailed({ uuAppErrorMap }, { baseUri: dtoIn.baseUri });
  }

  if (dtoOut.state === "closed") {
    throw new ERRORS.WeatherstationIsClosed({ uuAppErrorMap }, { baseUri: dtoIn.baseUri, uuAppInstance: dtoOut });
  }

  delete dtoOut.uuAppErrorMap;
  return dtoOut;
}

function setReferences(uuAppInstance) {
  progressClient = new AppClient({ baseUri: uuAppInstance.externalReferences.uuConsoleUri, session });
  progressCode = uuAppInstance.externalReferences.scripts.checkGateway.progressCode;
}

async function main() {
  // 1
  const uuAppErrorMap = validateDtoIn();

  // 2
  weatherstationClient = new AppClient({ baseUri: dtoIn.baseUri, session });

  // 3
  const uuAppInstance = await loadAppInstance(uuAppErrorMap);

  // 4
  await setReferences(uuAppInstance, uuAppErrorMap);

  return { uuAppErrorMap };
}

main();
