const { ObjectId } = require("bson");

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

function convertToDate(d) {
  const canBeConverted = !(d instanceof Date) && !isNaN(Date.parse(d));
  if (canBeConverted) {
    return new Date(d);
  }
  return d;
}

module.exports = {
  convertToObjectId,
  convertArrayToIn,
  convertToDate
}