const { generateCall } = require("../call-helper.js");

const DEFAULTS = {
  init: {
    uuAppProfileAuthorities: "urn:uu:GGALL"
  },
  load: {}
}

module.exports = {
  defaults: DEFAULTS,
  init: generateCall("POST", "sys/uuAppWorkspace/init", DEFAULTS.init, "AwidLicenseOwner"),
  load: generateCall("GET", "uuAppInstance/load", DEFAULTS.load, "Public"),
}