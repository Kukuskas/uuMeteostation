"use strict";
const GatewayAbl = require("../../abl/gateway-abl.js");

class GatewayController {

  create(ucEnv) {
    return GatewayAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  update(ucEnv) {
    return GatewayAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  get(ucEnv) {
    return GatewayAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getAuthorizationResult());
  }

  list(ucEnv) {
    return GatewayAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getAuthorizationResult());
  }

}

module.exports = new GatewayController();
