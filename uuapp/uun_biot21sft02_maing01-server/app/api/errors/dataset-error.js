"use strict";

const Biot21sft02UseCaseError = require("./biot21sft02-use-case-error.js");
const DATASET_ERROR_PREFIX = `${Biot21sft02UseCaseError.ERROR_PREFIX}dataset/`;

const Get = {
  UC_CODE: `${DATASET_ERROR_PREFIX}get/`,
  
  UuAppInstanceDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}uuAppInstanceDoesNotExist`;
      this.message = "UuAppInstance does not exist.";
    }
  },

  UuAppInstanceIsNotInCorrectState: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}uuAppInstanceIsNotInCorrectState`;
      this.message = "UuAppInstance is not in correct state.";
    }
  },

  InvalidDtoIn: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  NotAuthorized: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}notAuthorized`;
      this.message = "User is not authorized to access this workspace in its current state.";
    }
  },

  GatewayDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}gatewayDoesNotExist`;
      this.message = "These identifiers do not correspond to an existing gateway.";
    }
  },

  DatasetDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}datasetDoesNotExist`;
      this.message = "There is no dataset of this type for this gateway in the selected period.";
    }
  },
};

const ListByDates = {
  UC_CODE: `${DATASET_ERROR_PREFIX}listByDates/`,
  
  UuAppInstanceDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ListByDates.UC_CODE}uuAppInstanceDoesNotExist`;
      this.message = "UuAppInstance does not exist.";
    }
  },

  UuAppInstanceIsNotInCorrectState: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ListByDates.UC_CODE}uuAppInstanceIsNotInCorrectState`;
      this.message = "UuAppInstance is not in correct state.";
    }
  },

  InvalidDtoIn: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ListByDates.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  NotAuthorized: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ListByDates.UC_CODE}notAuthorized`;
      this.message = "User is not authorized to access this workspace in its current state.";
    }
  },

  GatewayDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ListByDates.UC_CODE}gatewayDoesNotExist`;
      this.message = "These identifiers do not correspond to an existing gateway.";
    }
  },
};

module.exports = {
  ListByDates,
  Get
};
