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

const Get = {
  UC_CODE: `${GATEWAY_ERROR_PREFIX}get/`,
  
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
};

const List = {
  UC_CODE: `${GATEWAY_ERROR_PREFIX}list/`,
  
  UuAppInstanceDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}uuAppInstanceDoesNotExist`;
      this.message = "UuAppInstance does not exist.";
    }
  },

  UuAppInstanceIsNotInCorrectState: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}uuAppInstanceIsNotInCorrectState`;
      this.message = "UuAppInstance is not in correct state.";
    }
  },

  InvalidDtoIn: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  NotAuthorized: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}notAuthorized`;
      this.message = "User is not authorized to access this workspace in its current state.";
    }
  },
};

const PostData = {
  UC_CODE: `${GATEWAY_ERROR_PREFIX}postData/`,
  
  UuAppInstanceDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${PostData.UC_CODE}uuAppInstanceDoesNotExist`;
      this.message = "UuAppInstance does not exist.";
    }
  },

  UuAppInstanceIsNotInCorrectState: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${PostData.UC_CODE}uuAppInstanceIsNotInCorrectState`;
      this.message = "UuAppInstance is not in correct state.";
    }
  },

  InvalidDtoIn: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${PostData.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  NotAuthorizedToSpecifyId: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${PostData.UC_CODE}notAuthorizedToSpecifyId`;
      this.message = "User is not authorized to specify the id of the gateway.";
    }
  },

  GatewayDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${PostData.UC_CODE}gatewayDoesNotExist`;
      this.message = "Gateway does not exist.";
    }
  },

  GatewayIsNotInCorrectState: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${PostData.UC_CODE}gatewayIsNotInCorrectState`;
      this.message = "Only gateways which are not closed may receive new data.";
    }
  },

  InvalidEntryDate: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${PostData.UC_CODE}invalidEntryDate`;
      this.message = "At least one of the entries is not from the same date.";
    }
  },

  DatasetDaoUpdateFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${PostData.UC_CODE}datasetDaoUpdateFailed`;
      this.message = "Failed to update dataset uuObject";
    }
  },

  DatasetDaoCreateFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${PostData.UC_CODE}datasetDaoUpdateFailed`;
      this.message = "Failed to create new dataset uuObject.";
    }
  },

  GatewayDaoUpdateFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${PostData.UC_CODE}gatewayDaoUpdateFailed`;
      this.message = "Failed to update gateway uuObject.";
    }
  },
};

const Delete = {
  UC_CODE: `${GATEWAY_ERROR_PREFIX}delete/`,
  
  UuAppInstanceDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}uuAppInstanceDoesNotExist`;
      this.message = "UuAppInstance does not exist.";
    }
  },

  UuAppInstanceIsNotInCorrectState: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}uuAppInstanceIsNotInCorrectState`;
      this.message = "UuAppInstance is not in correct state.";
    }
  },

  InvalidDtoIn: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  GatewayDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}gatewayDoesNotExist`;
      this.message = "Gateway does not exist.";
    }
  },

  GatewayIsNotInCorrectState: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}gatewayIsNotInCorrectState`;
      this.message = "Only gateways which are in closed state may be deleted.";
    }
  },

  DatasetDaoDeleteFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Delete.UC_CODE}datasetDaoDeleteFailed`;
      this.message = "Failed to delete related dataset uuObjects.";
    }
  },

  PermissionDeleteFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Delete.UC_CODE}permissionDeleteFailed`;
      this.message = "Failed to remove related uuEE from Gateways profile.";
    }
  },

  GatewayDaoDeleteFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Delete.UC_CODE}gatewayDaoDeleteFailed`;
      this.message = "Failed to delete gateway uuObject.";
    }
  },
};

module.exports = {
  Create,
  Update,
  Get,
  List,
  Delete,
  PostData,
};
