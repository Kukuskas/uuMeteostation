"use strict";
const UuAppInstanceAbl = require("../../abl/uu-app-instance-abl.js");

class UuAppInstanceController {

  init(ucEnv) {
    return UuAppInstanceAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

}

module.exports = new UuAppInstanceController();
