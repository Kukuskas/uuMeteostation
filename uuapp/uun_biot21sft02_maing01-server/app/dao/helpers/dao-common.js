const { ObjectId } = require("bson");
const moment = require("moment-timezone");

function convertToObjectId(id) {
  if (ObjectId.isValid(id)) {
    return new ObjectId(id);
  }
  return id;
}

function convertArrayToIn(arr) {
  if (Array.isArray(arr)) {
    return { $in: arr }
  }
  return arr;
}

function convertToDate(d, timezone = "UTC") {
  const canBeConverted = moment(d).isValid();
  if (!canBeConverted) {
    return d;
  }
  return moment.tz(d, timezone).toDate();
}

function convertToDateString(d, timezone = "UTC") {
  const canBeConverted = moment(d).isValid();
  if (!canBeConverted) {
    return d;
  }
  return moment.tz(d, timezone).format("YYYY-MM-DD");
}

module.exports = {
  convertToObjectId,
  convertArrayToIn,
  convertToDate,
  convertToDateString,
};
