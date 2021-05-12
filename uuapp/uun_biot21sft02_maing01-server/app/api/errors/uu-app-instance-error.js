"use strict";
const Biot21sft02UseCaseError = require("./biot21sft02-use-case-error.js");
const UU_APP_INSTANCE_ERROR_PREFIX = `${Biot21sft02UseCaseError.ERROR_PREFIX}/uuAppInstance`

const Init = {
  UC_CODE: `${UU_APP_INSTANCE_ERROR_PREFIX}init/`,

  InstanceAlreadyExists: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}instanceAlreadyExists`;
      this.message = "This instance has already been initialized.";
    }
  },

  InvalidDtoIn: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  SchemaDaoCreateSchemaFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Init.UC_CODE}schemaDaoCreateSchemaFailed`;
      this.message = "Create schema by Dao createSchema failed.";
    }
  },

  SetProfileFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}sys/setProfileFailed`;
      this.message = "Set profile failed.";
    }
  },

  CreateAwscFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}createAwscFailed`;
      this.message = "Create uuAwsc failed.";
    }
  },

  UuAppInstanceDaoCreateFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}uuAppInstanceDaoCreateFailed`;
      this.message = "Failed to insert uuAppInstance into uuAppObjectStore.";
    }
  }
};

const PlugInExternalServices = {
  UC_CODE: `${UU_APP_INSTANCE_ERROR_PREFIX}plugInExternalServices/`,
  
};

const Load = {
  UC_CODE: `${UU_APP_INSTANCE_ERROR_PREFIX}load/`,
  
  UuAppInstanceDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}uuAppInstanceDoesNotExist`;
      this.message = "UuAppInstance does not exist.";
    }
  },

  UuAppInstanceIsNotInCorrectState: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}uuAppInstanceIsNotInCorrectState`;
      this.message = "UuAppInstance is not in correct state.";
    }
  },

  InvalidDtoIn: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

module.exports = {
  PlugInExternalServices,
  Init,
  Load,
};
