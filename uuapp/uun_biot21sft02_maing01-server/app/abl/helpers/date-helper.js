
const moment = require("moment-timezone");

// returns a Date obj generated only from the date
function strToDate(isoString) {
  return new Date(isoString.slice(0, 10));
}

// checks that isoStrings occur on the same day regardless of timezones
function isSameDate(isoString1, isoString2) {
  return isoString1.startsWith(isoString2.slice(0, 10));
}

// sorts an ISO string datetime array
function sortIsoDates(arr) {
  // reduce number of needed date objects
  const stringsWithDates = [...arr].map((is) => ({ m: moment(is), is }));
  const sortedSDs = stringsWithDates.sort(_compareIsoEntries);
  return sortedSDs.map(entry => entry.is);
}

function sortObjectArrayByDate(arr, dateKey) {
  const entryObj = arr.reduce((o, entry) => {
    const key = entry[dateKey];
    o[key] = entry;
    return o;
  }, {});
  const sortedKeys = sortIsoDates(Object.keys(entryObj));
  return sortedKeys.map(key => entryObj[key]);
}

// compares two iso date strings, if they happened at the same time,
// the earliest timezone is greater
function _compareIsoEntries(is1, is2) {
  return is1.m.diff(is2.m);
}

module.exports = {
  strToDate,
  isSameDate,
  sortIsoDates,
  sortObjectArrayByDate
}