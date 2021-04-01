"use strict";

const Biot21sft02MainUseCaseError = require("./biot21sft02-use-case-error.js");
const DATASET_ERROR_PREFIX = `${Biot21sft02MainUseCaseError.ERROR_PREFIX}dataset/`;

const Get = {
  UC_CODE: `${DATASET_ERROR_PREFIX}get/`,
  
};

module.exports = {
  Get
};
