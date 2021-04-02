"use strict";
const GatewayAbl = require("../../abl/gateway-abl.js");

class GatewayController {

  update(ucEnv) {
    return GatewayAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  create(ucEnv) {
    return GatewayAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

}

module.exports = new GatewayController();
