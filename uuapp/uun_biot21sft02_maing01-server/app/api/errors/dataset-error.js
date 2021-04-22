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

const ListUnaggregatedData = {
  UC_CODE: `${DATASET_ERROR_PREFIX}listUnaggregatedData/`,

  UuAppInstanceDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ListUnaggregatedData.UC_CODE}uuAppInstanceDoesNotExist`;
      this.message = "UuAppInstance does not exist.";
    }
  },

  UuAppInstanceIsNotInCorrectState: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ListUnaggregatedData.UC_CODE}uuAppInstanceIsNotInCorrectState`;
      this.message = "UuAppInstance is not in correct state.";
    }
  },

  InvalidDtoIn: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ListUnaggregatedData.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

};

const PostAggregatedData = {
  UC_CODE: `${DATASET_ERROR_PREFIX}postAggregatedData/`,

  UuAppInstanceDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${PostAggregatedData.UC_CODE}uuAppInstanceDoesNotExist`;
      this.message = "UuAppInstance does not exist.";
    }
  },

  UuAppInstanceIsNotInCorrectState: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${PostAggregatedData.UC_CODE}uuAppInstanceIsNotInCorrectState`;
      this.message = "UuAppInstance is not in correct state.";
    }
  },

  InvalidDtoIn: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${PostAggregatedData.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  GatewayDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${PostAggregatedData.UC_CODE}gatewayDoesNotExist`;
      this.message = "These identifiers do not correspond to an existing gateway.";
    }
  },

  InvalidDateBoundaries: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${PostAggregatedData.UC_CODE}invalidDateBoundaries`;
      this.message = "This startDate and endDate is invalid for this type of dataset.";
    }
  },

  InvalidDataEntryTime: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${PostAggregatedData.UC_CODE}invalidDataEntryTime`;
      this.message = "All dataset entries must be within the defined boundaries of startDate and endDate.";
    }
  },

  InvalidDataEntryLabel: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${PostAggregatedData.UC_CODE}invalidDataEntryLabel`;
      this.message = "Entry label is not consistent with expected label format.";
    }
  },

  MissingDataEntry: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${PostAggregatedData.UC_CODE}missingDateEntry`;
      this.message = "Timestamp of the first entry must be the first period available in the dataset. Following timestamps must be spaced out by period according to dataset type.";
    }
  },

  DatasetDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${PostAggregatedData.UC_CODE}datasetDoesNotExist`;
      this.message = "There is no dataset of this type for this gateway in the selected period.";
    }
  },

  DatasetDoesNotMatch: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${PostAggregatedData.UC_CODE}datasetDoesNotMatch`;
      this.message = "Received dataset identifiers do not match the existing dataset specified by dtoIn.id.";
    }
  },

  DatasetDaoUpdateFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${PostAggregatedData.UC_CODE}datasetDaoUpdateFailed`;
      this.message = "Failed to update dataset uuObject.";
    }
  },

  DatasetDaoCreateFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${PostAggregatedData.UC_CODE}datasetDaoCreateFailed`;
      this.message = "Failed to create new dataset uuObject.";
    }
  }
};

const MarkAggregated = {
  UC_CODE: `${DATASET_ERROR_PREFIX}markAggregated/`,
  
  UuAppInstanceDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${MarkAggregated.UC_CODE}uuAppInstanceDoesNotExist`;
      this.message = "UuAppInstance does not exist.";
    }
  },

  UuAppInstanceIsNotInCorrectState: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${MarkAggregated.UC_CODE}uuAppInstanceIsNotInCorrectState`;
      this.message = "UuAppInstance is not in correct state.";
    }
  },

  InvalidDtoIn: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${MarkAggregated.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  DatasetDaoUpdateFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${MarkAggregated.UC_CODE}datasetDaoUpdateFailed`;
      this.message = "Failed to update dataset uuObject.";
    }
  },
};

const TrimData = {
  UC_CODE: `${DATASET_ERROR_PREFIX}trimData/`,
  
  UuAppInstanceDoesNotExist: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${TrimData.UC_CODE}uuAppInstanceDoesNotExist`;
      this.message = "UuAppInstance does not exist.";
    }
  },

  UuAppInstanceIsNotInCorrectState: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${TrimData.UC_CODE}uuAppInstanceIsNotInCorrectState`;
      this.message = "UuAppInstance is not in correct state.";
    }
  },

  InvalidDtoIn: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${TrimData.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  DatasetDaoDeleteFailed: class extends Biot21sft02UseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${MarkAggregated.UC_CODE}datasetDaoDeleteFailed`;
      this.message = "Failed to delete datasets in the ObjectStore.";
    }
  },
};

module.exports = {
  TrimData,
  Get,
  ListByDates,
  ListUnaggregatedData,
  PostAggregatedData,
  MarkAggregated,
};
