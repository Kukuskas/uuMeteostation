"use strict";
const UuAppInstanceAbl = require("../../abl/uu-app-instance-abl.js");

class UuAppInstanceController {
  init(ucEnv) {
    return UuAppInstanceAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  load(ucEnv) {
    return UuAppInstanceAbl.load(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getAuthorizationResult());
  }

  scheduleScripts(ucEnv) {
    return UuAppInstanceAbl.scheduleScripts(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getUri(),
      ucEnv.getSession()
    );
  }
}

module.exports = new UuAppInstanceController();
