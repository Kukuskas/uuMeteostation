"use strict";
const DatasetAbl = require("../../abl/dataset-abl.js");

class DatasetController {
  get(ucEnv) {
    return DatasetAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getAuthorizationResult());
  }

  getOrCreate(ucEnv) {
    return DatasetAbl.getOrCreate(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getAuthorizationResult());
  }

  listByDates(ucEnv) {
    return DatasetAbl.listByDates(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getAuthorizationResult());
  }

  listUnaggregatedData(ucEnv) {
    return DatasetAbl.listUnaggregatedData(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  postAggregatedData(ucEnv) {
    return DatasetAbl.postAggregatedData(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  trimData(ucEnv) {
    return DatasetAbl.trimData(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  markAggregated(ucEnv) {
    return DatasetAbl.markAggregated(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new DatasetController();
