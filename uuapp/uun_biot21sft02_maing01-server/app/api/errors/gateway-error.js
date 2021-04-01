"use strict";

const Biot21sft02MainUseCaseError = require("./biot21sft02-use-case-error.js");
const GATEWAY_ERROR_PREFIX = `${Biot21sft02MainUseCaseError.ERROR_PREFIX}gateway/`;

const Create = {
  UC_CODE: `${GATEWAY_ERROR_PREFIX}create/`,
  
};

module.exports = {
  Create
};
