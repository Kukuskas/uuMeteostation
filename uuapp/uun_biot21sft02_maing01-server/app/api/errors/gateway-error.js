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

module.exports = {
  Create
};
