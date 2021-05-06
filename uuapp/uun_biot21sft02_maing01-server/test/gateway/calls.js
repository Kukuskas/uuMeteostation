const { TestHelper } = require("uu_appg01_server-test");
const { generateCall } = require("../call-helper.js");

const DEFAULTS = {
  create: {
    name: "Test gateway",
    uuEe: "25-8074-1"
  },
  update: {},
  get: {},
  list: {
    pageInfo: {
      pageIndex: 0,
      pageSize: 100
    }
  },
  postData: {
    data: []
  },
  logMessage: {
    type: "error",
    message: "Test error message."
  },
  delete: {}
}

module.exports = {
  defaults: DEFAULTS,
  create: generateCall("POST", "gateway/create", DEFAULTS.create, "Authorities"),
  update: generateCall("POST", "gateway/update", DEFAULTS.update, "Authorities"),
  get: generateCall("GET", "gateway/get", DEFAULTS.get, "Public"),
  list: generateCall("GET", "gateway/list", DEFAULTS.list, "Gateways"),
  postData: generateCall("POST", "gateway/postData", DEFAULTS.postData, "Gateways"),
  logMessage: generateCall("POST", "gateway/logMessage", DEFAULTS.logMessage, "Gateways"),
  delete: generateCall("POST", "gateway/delete", DEFAULTS.delete, "Authorities")
}