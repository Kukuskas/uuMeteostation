const { generateCall } = require("../call-helper.js");

const DEFAULTS = {
  init: {
    uuAppProfileAuthorities: "urn:uu:GGALL"
  }
}

module.exports = {
  defaults: DEFAULTS,
  init: generateCall("POST", "sys/uuAppWorkspace/init", DEFAULTS.init, "AwidLicenseOwner")
}