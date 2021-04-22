"use strict";
const DatasetAbl = require("../../abl/dataset-abl.js");

class DatasetController {

  markAggregated(ucEnv) {
    return DatasetAbl.markAggregated(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  postAggregatedData(ucEnv) {
    return DatasetAbl.postAggregatedData(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  listUnaggregatedData(ucEnv) {
    return DatasetAbl.listUnaggregatedData(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  get(ucEnv) {
    return DatasetAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getAuthorizationResult());
  }

  listByDates(ucEnv) {
    return DatasetAbl.listByDates(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getAuthorizationResult());
  }

}

module.exports = new DatasetController();
