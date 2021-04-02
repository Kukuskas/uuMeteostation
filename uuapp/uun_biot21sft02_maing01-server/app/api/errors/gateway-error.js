"use strict";

const Biot21sft02UseCaseError = require("./biot21sft02-use-case-error.js");
const GATEWAY_ERROR_PREFIX = `${Biot21sft02UseCaseError.ERROR_PREFIX}gateway/`;

const Create = {
  UC_CODE: `${GATEWAY_ERROR_PREFIX}create/`,

  UuAppInstanceDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}uuAppInstanceDoesNotExist`;
      this.message = "UuAppInstance does not exist.";
    }
  },

  UuAppInstanceIsNotInCorrectState: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}uuAppInstanceIsNotInCorrectState`;
      this.message = "UuAppInstance is not in correct state.";
    }
  },

  InvalidDtoIn: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  CodeIsNotUnique: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}codeIsNotUnique`;
      this.message = "Gateway with this code already exists.";
    }
  },

  UuEeIsNotUnique: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}uuEeIsNotUnique`;
      this.message = "Gateway with this uuEe already exists.";
    }
  },

  PermissionCreateFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Create.UC_CODE}uuEeIsNotUnique`;
      this.message = "Failed to set add uuEe to gateways group.";
    }
  },

  GatewayDaoCreateFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Create.UC_CODE}gatewayDaoCreateFailed`;
      this.message = "Failed to create gateway uuObject in object store.";
    }
  },
};

const Update = {
  UC_CODE: `${GATEWAY_ERROR_PREFIX}update/`,
  
  UuAppInstanceDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}uuAppInstanceDoesNotExist`;
      this.message = "UuAppInstance does not exist.";
    }
  },

  UuAppInstanceIsNotInCorrectState: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}uuAppInstanceIsNotInCorrectState`;
      this.message = "UuAppInstance is not in correct state.";
    }
  },

  InvalidDtoIn: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  GatewayDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}gatewayDoesNotExist`;
      this.message = "This gateway does not exist.";
    }
  },

  GatewayIsNotInCorrectState: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}gatewayIsNotInCorrectState`;
      this.message = "Gateway is in final state and thus cannot be updated. If you want to update it's values, set it to active.";
    }
  },

  CodeAlreadyExists: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}codeAlreadyExists`;
      this.message = "Gateway with the new code already exists.";
    }
  },

  PermissionDeleteFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Update.UC_CODE}permissionDeleteFailed`;
      this.message = "Failed to remove old uuEE permission.";
    }
  },

  PermissionCreateFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Update.UC_CODE}permissionCreateFailed`;
      this.message = "Failed to create new uuEE permission.";
    }
  },

  GatewayDaoUpdateFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Update.UC_CODE}gatewayDaoUpdateFailed`;
      this.message = "Failed to update gateway in uuAppObjectStore.";
    }
  },
};

module.exports = {
  Create,
  Update
};
