const { generateCall } = require("../call-helper.js");

const DEFAULTS = {
  get: {},
  listByDates: {
    type: "detailed"
  },
  listUnaggregatedData: {
    type: "detailed"
  },
  markAggregated: {},
  postAggregatedData: {},
  trimData: {}
}

module.exports = {
  defaults: DEFAULTS,
  get: generateCall("GET", "dataset/get", DEFAULTS.get, "Public"),
  listByDates: generateCall("GET", "dataset/listByDates", DEFAULTS.listByDates, "Public"),
  listUnaggregatedData: generateCall("GET", "dataset/listUnaggregatedData", DEFAULTS.listUnaggregatedData, "Authorities"),
  markAggregated: generateCall("POST", "dataset/markAggregated", DEFAULTS.markAggregated, "Authorities"),
  postAggregatedData: generateCall("POST", "dataset/postAggregatedData", DEFAULTS.postAggregatedData, "Authorities"),
  trimData: generateCall("POST", "dataset/trimData", DEFAULTS.trimData, "Authorities")
}