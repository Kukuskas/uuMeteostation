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

const ScheduleScripts = {
  UC_CODE: `${UU_APP_INSTANCE_ERROR_PREFIX}scheduleScripts/`,

  UuAppInstanceDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ScheduleScripts.UC_CODE}uuAppInstanceDoesNotExist`;
      this.message = "UuAppInstance does not exist.";
    }
  },

  UuAppInstanceIsNotInCorrectState: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ScheduleScripts.UC_CODE}uuAppInstanceIsNotInCorrectState`;
      this.message = "UuAppInstance is not in correct state.";
    }
  },

  InvalidDtoIn: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ScheduleScripts.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  InsufficientConfig: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ScheduleScripts.UC_CODE}insufficientConfig`;
      this.message = "Insufficient configuration info for external services set up.";
    }
  },

  ConsoleCreateFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ScheduleScripts.UC_CODE}consoleCreateFailed`;
      this.message = "Console create failed.";
    }
  },

  ConsoleUpdateFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ScheduleScripts.UC_CODE}consoleUpdateFailed`;
      this.message = "Console authorization update failed.";
    }
  },

  ProgressCreateFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ScheduleScripts.UC_CODE}progressCreateFailed`;
      this.message = "Progress could not be created.";
    }
  },

  ConsoleRefUuAppInstanceDaoUpdateFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${ScheduleScripts.UC_CODE}consoleRefUuAppInstanceDaoUpdateFailed`;
      this.message = "Failed to update console references in uuAppInstance.";
    }
  },

  ProgressUpdateFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ScheduleScripts.UC_CODE}progressUpdateFailed`;
      this.message = "Progress authorization could not be updated.";
    }
  },

  ProgressRefUuAppInstanceDaoUpdateFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${ScheduleScripts.UC_CODE}progressRefUuAppInstanceDaoUpdateFailed`;
      this.message = "Failed to update progress references in uuAppInstance.";
    }
  },

  ScriptScheduleFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ScheduleScripts.UC_CODE}scriptScheduleFailed`;
      this.message = "Script schedule failed.";
    }
  },

  UuAppInstanceDaoUpdateFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${ScheduleScripts.UC_CODE}uuAppInstanceDaoUpdateFailed`;
      this.message = "UuAppInstance DAO update failed.";
    }
  },
};

module.exports = {
  Init,
  Load,
  ScheduleScripts,
};
