"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/dataset-error.js");

const WARNINGS = {

};

class DatasetAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("dataset");
  }

  async get(awid, dtoIn) {
    
  }

}

module.exports = new DatasetAbl();