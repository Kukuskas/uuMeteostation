"use strict";
const Biot21sft02MainAbl = require("../../abl/biot21sft02-main-abl.js");

class Biot21sft02MainController {
  init(ucEnv) {
    return Biot21sft02MainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new Biot21sft02MainController();
