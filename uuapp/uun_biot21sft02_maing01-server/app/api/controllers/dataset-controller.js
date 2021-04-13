"use strict";
const DatasetAbl = require("../../abl/dataset-abl.js");

class DatasetController {

  get(ucEnv) {
    return DatasetAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getAuthorizationResult());
  }

}

module.exports = new DatasetController();
