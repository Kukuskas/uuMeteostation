"use strict";
const Biot21sft02MainUseCaseError = require("./biot21sft02-use-case-error.js");
const UU_APP_INSTANCE_ERROR_PREFIX = `${Biot21sft02MainUseCaseError.ERROR_PREFIX}/uuAppInstance`

const Init = {
  UC_CODE: `${UU_APP_INSTANCE_ERROR_PREFIX}init/`,

  InvalidDtoIn: class extends Biot21sft02MainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  SchemaDaoCreateSchemaFailed: class extends Biot21sft02MainUseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Init.UC_CODE}schemaDaoCreateSchemaFailed`;
      this.message = "Create schema by Dao createSchema failed.";
    }
  },

  SetProfileFailed: class extends Biot21sft02MainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}sys/setProfileFailed`;
      this.message = "Set profile failed.";
    }
  },

  CreateAwscFailed: class extends Biot21sft02MainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}createAwscFailed`;
      this.message = "Create uuAwsc failed.";
    }
  },
};

module.exports = {
  Init,
};
