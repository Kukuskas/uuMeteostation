
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
  const stringsWithDates = [...arr].map((is) => ({ d: new Date(is), is }));
  const sortedSDs = stringsWithDates.sort(_compareIsoEntries);
  return sortedSDs.map(entry => entry.is);
}

// compares two iso date strings, if they happened at the same time,
// the earliest timezone is greater
function _compareIsoEntries(is1, is2) {
  if (is1.d > is2.d) {
    return 1;
  } else if (is1.d < is2.d) {
    return -1;
  } else if (is1.is === is2.is) {
    return 0;
  }
  return _compareTimeZones(is1, is2);
}

// compares timezone offsets as numbers
// (-01:00) < (Z/+00:00)
function _compareTimeZones(is1, is2) {
  return _parseTimezone(is1) - _parseTimezone(is2);
}

function _parseTimezone(isoString) {
  const tz = isoString.slice(23);
  if (tz === "Z") {
    return 0;
  }
  const [, c, h, m] = tz.match(/^([\+\-])(\d{2}):(\d{2})$/);
  if (!c || !h || !m) return null;
  const timeShift = parseInt(h) + parseInt(m) / 60;
  switch (c) {
    case "-":
      return -timeShift;
    case "+":
    default:
      return timeShift;
  }
}

module.exports = {
  strToDate,
  isSameDate,
  sortIsoDates
}