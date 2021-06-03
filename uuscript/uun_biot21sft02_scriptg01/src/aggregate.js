const AppClient = require("uu_appg01_server").AppClient;
const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UseCaseError } = require("uu_appg01_server").AppServer;

const moment = require("moment");

const { dtoIn, console, session } = scriptContext;

// validation schema
const DTOIN_SCHEMA = `
const checkGatewayDtoInType = shape({
  baseUri: uri().isRequired()
});`;

// defaults

// constants
const AGGREGATION_LEVELS = ["hourly", "daily", "weekly", "monthly"];
const AGGREGATION_SOURCE = {
  hourly: "detailed",
  daily: "hourly",
  weekly: "daily",
  monthly: "daily"
};
const DATASET_TYPES = {
  hourly: {
    labelFormat: "YYYY-MM-DDTHH",
    entryOffset: {
      hours: 1
    }
  },
  daily: {
    labelFormat: "YYYY-MM-DD",
    entryOffset: {
      days: 1
    }
  },
  weekly: {
    labelFormat: "YYYY-[W]WW",
    entryOffset: {
      weeks: 1
    }
  },
  monthly: {
    labelFormat: "YYYY-[M]MM",
    entryOffset: {
      months: 1
    }
  }
};
const TYPE_IS_NESTED = {
  detailed: false,
  hourly: true,
  daily: true,
  weekly: true,
  monthly: true
};

// errors
const ScriptError = class extends UseCaseError {
  constructor(dtoOut, paramMap = {}, cause = null) {
    if (paramMap instanceof Error) {
      cause = paramMap;
      paramMap = {};
    }
    super({ dtoOut, paramMap, status: 400 }, cause);
  }
};

const ERRORS = {
  ERROR_PREFIX: "uun-biot21sft02-scriptg01/aggregate/",

  InvalidDtoIn: class extends ScriptError {
    constructor() {
      super(...arguments);
      this.code = `${ERRORS.ERROR_PREFIX}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  WeatherstationLoadFailed: class extends ScriptError {
    constructor() {
      super(...arguments);
      this.code = `${ERRORS.ERROR_PREFIX}weatherstationLoadFailed`;
      this.message = "Failed to load weatherstation instance.";
    }
  },

  WeatherstationIsClosed: class extends ScriptError {
    constructor() {
      super(...arguments);
      this.code = `${ERRORS.ERROR_PREFIX}weatherstationIsClosed`;
      this.message = "WeatherStation is in closed state and can't be updated.";
    }
  }
};

// warnings
const WARNINGS = {
  unsupportedKeys: {
    code: `${ERRORS.ERROR_PREFIX}unsupportedKeys`
  },
  progressProceedFailed: {
    code: ` ${ERRORS.ERROR_PREFIX}progressProceedFailed`,
    message: `Progress proceed call failed.`
  }
};

// custom classes
class AggregationStatusTracker {
  // datasets that are waiting to be fully aggregated
  _waitingDatasets = {};
  // datasets that have been aggregated enough
  _readyDatasets = [];
  // template objects for waitingDatasets
  _blankStatuses = {};

  _AGGREGATED_REQUIREMENTS = {
    detailed: ["hourly"],
    hourly: ["daily"],
    daily: ["weekly", "monthly"]
  };

  constructor() {
    this._waitingDatasets = {};
    this._readyDatasets = [];
    this._blankStatuses = {};

    for (const type in this._AGGREGATED_REQUIREMENTS) {
      const requirements = this._AGGREGATED_REQUIREMENTS[type];
      this._blankStatuses[type] = requirements.reduce((o, requirement) => {
        o[requirement] = null;
        return o;
      }, {});
    }
  }

  // track a dataset that is yet to be aggregated
  markForAggregation(datasetIds, datasetType, type) {
    datasetIds.forEach(id => {
      if (!this._waitingDatasets[id]) {
        this._waitingDatasets[id] = { ...this._blankStatuses[datasetType] };
      }
      this._waitingDatasets[id][type] = (this._waitingDatasets[id][type] ?? 0) + 1;
    });
  }

  markAsAggregated(datasetIds, type) {
    datasetIds.forEach(id => {
      const status = this._waitingDatasets[id];
      if (!status) {
        return;
      }
      status[type] = (status[type] ?? 0) - 1;
      const isFullyAggregated = !Object.values(status).some(v => v > 0 || v === null);
      if (isFullyAggregated) {
        this._readyDatasets.push(id);
        delete this._waitingDatasets[id];
      }
    });
  }

  getFullyAggregated(deleteIds = true) {
    const datasetIds = this._readyDatasets;
    if (deleteIds) {
      this._readyDatasets = [];
    }
    return datasetIds;
  }
}

class RequestCache {
  _savedRequests;

  constructor() {
    this._savedRequests = {};
  }

  withCache(fn) {
    return (...args) => {
      const key = this._stringify(args);
      if (!this.has(key)) {
        const value = fn(...args);
        this.store(key, value);
        return value;
      }
      return this.get(key);
    };
  }

  withAsyncCache(fn) {
    return async (...args) => {
      const key = this._stringify(args);
      if (!this.has(key)) {
        const value = await fn(...args);
        this.store(key, value);
        return value;
      }
      return this.get(key);
    };
  }

  has(key) {
    return this._savedRequests.hasOwnProperty(key);
  }

  store(key, value) {
    this._savedRequests[key] = value;
  }

  get(key) {
    return this._savedRequests[key];
  }

  _stringify(key) {
    return JSON.stringify(key);
  }
}

// global vars
let weatherstationClient = null;
let progressClient = null;
let progressCode = null;
let uuAppErrorMap = {};

// error and warning processing
async function throwError(error) {
  await progressClient.post("progress/setState", {
    code: progressCode,
    state: "runningWithCode",
    message: "Script has exited with an error.",
    data: error
  });

  // no need to write it into console, it will be logged automatically
  throw error;
}

async function addWarning(warning, paramMap = {}, updateProgress = true) {
  ValidationHelper.addWarning(uuAppErrorMap, warning.code, warning.message ?? null, paramMap);
}

// steps
function validateDtoIn() {
  const validator = new Validator(DTOIN_SCHEMA);
  const validationResult = validator.validate("checkGatewayDtoInType", dtoIn);

  return ValidationHelper.processValidationResult(dtoIn, validationResult, WARNINGS.unsupportedKeys.code, ERRORS.InvalidDtoIn);
}

async function loadAppInstance() {
  let dtoOut;
  try {
    dtoOut = await weatherstationClient.get("uuAppInstance/load", {});
  } catch (e) {
    throw new ERRORS.WeatherstationLoadFailed({ uuAppErrorMap }, { baseUri: dtoIn.baseUri });
  }

  const uuAppInstance = dtoOut.uuAppInstance;

  if (uuAppInstance.state === "closed") {
    throw new ERRORS.WeatherstationIsClosed({ uuAppErrorMap }, { baseUri: dtoIn.baseUri, uuAppInstance });
  }

  return uuAppInstance;
}

function setReferences(uuAppInstance) {
  // console.log(uuAppInstance);
  progressClient = new AppClient({ baseUri: uuAppInstance.externalResources.uuConsoleUri, session });
  progressCode = uuAppInstance.externalResources.scripts.checkGateway.progressCode;
}

// calls
async function listUnaggregatedDatasets(type) {
  let dtoOut = {};
  let datasets = [];
  do {
    const dtoIn = {
      type,
      pageInfo: {
        pageSize: 1000,
        pageIndex: (dtoOut.pageInfo?.pageIndex ?? -1) + 1
      }
    };
    try {
      dtoOut = await weatherstationClient.post("dataset/listUnaggregatedData", dtoIn);
      datasets.push(...dtoOut.itemList);
    } catch (e) {
      throw e;
      await throwError(new ScriptError());
    }
  } while ((dtoOut.pageInfo.pageIndex + 1) * dtoOut.pageInfo.pageSize < dtoOut.pageInfo.total);
  return datasets;
}

async function listDatasets(type, startDate, endDate, gatewayId) {
  let dtoOut = {};
  let datasets = [];
  do {
    const dtoIn = {
      type,
      gatewayId,
      startDate: moment.parseZone(startDate).format("YYYY-MM-DD"),
      endDate: moment.parseZone(endDate).format("YYYY-MM-DD"),
      pageInfo: {
        pageSize: 100,
        pageIndex: (dtoOut.pageInfo?.pageIndex ?? -1) + 1
      }
    };
    try {
      dtoOut = await weatherstationClient.get("dataset/listByDates", dtoIn);
      // await console.log(`Fetched page ${dtoOut.pageInfo.pageIndex + 1}/${Math.ceil(dtoOut.pageInfo.total / dtoOut.pageInfo.pageSize)} of unaggregated datasets of type ${type}`);
      datasets.push(...dtoOut.itemList);
    } catch (e) {
      throw e;
      // throwError(new ScriptError());
    }
  } while ((dtoOut.pageInfo.pageIndex + 1) * dtoOut.pageInfo.pageSize < dtoOut.pageInfo.total);
  return datasets;
}
const listCache = new RequestCache();
const cachedListDataset = listCache.withAsyncCache(listDatasets);

async function getDataset(type, date, gatewayId) {
  try {
    return weatherstationClient.get("dataset/getOrCreate", { gatewayId, type, date });
  } catch (e) {
    throwError(new Error(e));
  }
}
const getCache = new RequestCache();
const cachedGetDataset = getCache.withAsyncCache(getDataset);

async function postAggregatedDataset(dataset) {
  try {
    // await console.info(dataset);
    return weatherstationClient.post("dataset/postAggregatedData", dataset);
  } catch (e) {
    await console.warning(e);
  }
}

async function markAggregated(datasetIds, modifiedBefore) {
  const dtoIn = {
    datasetIdList: datasetIds,
    modifiedBefore: modifiedBefore.format("YYYY-MM-DDTHH:mm:ss.SSSZ")
  };
  try {
    return weatherstationClient.post("dataset/markAggregated", dtoIn);
  } catch (e) {
    await console.warning(e);
  }
}

// helpers

/**
 * Returns the period, which is affected by unaggregated datasets
 * @param {*} dataset
 */
function _getDatasetAffectedPeriod(dataset, aggregationLevel) {
  switch (aggregationLevel) {
    // data for the whole period is already contained in the lower level aggregation
    case "hourly":
    case "daily": {
      return {
        startDate: dataset.startDate,
        endDate: dataset.endDate
      };
    }
    case "monthly": {
      return {
        startDate: moment
          .parseZone(dataset.startDate)
          .startOf("month")
          .format("YYYY-MM-DD"),
        endDate: moment
          .parseZone(dataset.endDate)
          .endOf("month")
          .format("YYYY-MM-DD")
      };
    }
    case "weekly": {
      return {
        startDate: moment
          .parseZone(dataset.startDate)
          .startOf("isoWeek")
          .format("YYYY-MM-DD"),
        endDate: moment
          .parseZone(dataset.endDate)
          .endOf("isoWeek")
          .format("YYYY-MM-DD")
      };
    }
    default: {
      return {
        startDate: dataset.startDate,
        endDate: dataset.endDate
      };
    }
  }
}

function _getAllDatasetStartDatesBetween(startDate, endDate, type) {
  const startDates = [];
  const minDate = moment.parseZone(startDate).startOf("day");
  let nextDate = moment.parseZone(_getStartDate(startDate, type)).startOf("day");
  const maxDate = moment.parseZone(endDate).endOf("day");
  while (nextDate.isSameOrBefore(maxDate)) {
    if (nextDate.isSameOrAfter(minDate)) {
      startDates.push(nextDate.format("YYYY-MM-DD"));
    }
    nextDate = moment.parseZone(_getEndDate(nextDate, type)).add(1, "day");
  }
  return startDates;
}

function _extractDataEntries(datasets, startDate, endDate) {
  const start = moment.parseZone(startDate);
  const end = moment.parseZone(endDate);
  const dataPoints = [];
  datasets.forEach(d => {
    dataPoints.push(...d.data);
  });
  return dataPoints.filter(d => start.isSameOrBefore(d.timestamp) && end.isAfter(d.timestamp));
}

function _trimDecimals(val, dec) {
  const coef = 10 ** dec;
  return Math.floor(val * coef) / coef;
}

function _calculatePeriod(entries, timestamp, label, nested) {
  const periodEntry = {
    timestamp,
    label,
    min: {
      temperature: null,
      humidity: null
    },
    avg: {
      temperature: null,
      humidity: null
    },
    max: {
      temperature: null,
      humidity: null
    }
  };

  const temperaturesMin = entries.map(entry => (nested ? entry.min.temperature : entry.temperature)).filter(temperature => temperature !== null);
  const temperaturesAvg = entries.map(entry => (nested ? entry.avg.temperature : entry.temperature)).filter(temperature => temperature !== null);
  const temperaturesMax = entries.map(entry => (nested ? entry.max.temperature : entry.temperature)).filter(temperature => temperature !== null);

  const humiditiesMin = entries.map(entry => (nested ? entry.min.humidity : entry.humidity)).filter(humidity => humidity !== null);
  const humiditiesAvg = entries.map(entry => (nested ? entry.avg.humidity : entry.humidity)).filter(humidity => humidity !== null);
  const humiditiesMax = entries.map(entry => (nested ? entry.max.humidity : entry.humidity)).filter(humidity => humidity !== null);

  periodEntry.min.temperature = temperaturesMin.length ? Math.min(...temperaturesMin) : null;
  periodEntry.avg.temperature = temperaturesAvg.length ? _trimDecimals(temperaturesAvg.reduce((sum, val) => sum + val, 0) / temperaturesAvg.length, 3) : null;
  periodEntry.max.temperature = temperaturesMax.length ? Math.max(...temperaturesMax) : null;

  periodEntry.min.humidity = humiditiesMin.length ? Math.min(...humiditiesMin) : null;
  periodEntry.avg.humidity = humiditiesAvg.length ? _trimDecimals(humiditiesAvg.reduce((sum, val) => sum + val, 0) / humiditiesAvg.length, 3) : null;
  periodEntry.max.humidity = humiditiesMax.length ? Math.max(...humiditiesMax) : null;

  return periodEntry;
}

async function _generateEntry(sourceType, start, end, gatewayId, label) {
  const relevantDatasets = await cachedListDataset(sourceType, _getStartDate(start, sourceType), _getEndDate(end, sourceType), gatewayId);
  const relevantDataEntries = _extractDataEntries(relevantDatasets, start, end);
  const generatedEntry = _calculatePeriod(relevantDataEntries, start, label, TYPE_IS_NESTED[sourceType]);
  return generatedEntry;
}

function _nextTimestamp(timestamp, datasetType) {
  const offset = DATASET_TYPES[datasetType].entryOffset;
  return moment.parseZone(timestamp).add(offset);
}

function _getStartDate(timestamp, datasetType) {
  const m = moment.parseZone(timestamp);
  switch (datasetType) {
    case "weekly": {
      return m
        .isoWeek(1)
        .startOf("isoWeek")
        .format("YYYY-MM-DD");
    }
    case "daily":
    case "monthly": {
      return m.startOf("year").format("YYYY-MM-DD");
    }
    case "hourly":
    case "detailed":
    default: {
      return m.startOf("day").format("YYYY-MM-DD");
    }
  }
}

function _getEndDate(timestamp, datasetType) {
  const m = moment.parseZone(timestamp);
  switch (datasetType) {
    case "weekly": {
      // workaround to prevent getting week count of a different year
      m.isoWeek(2);
      return m
        .isoWeek(m.isoWeeksInYear())
        .endOf("isoWeek")
        .format("YYYY-MM-DD");
    }
    case "daily":
    case "monthly": {
      return m.endOf("year").format("YYYY-MM-DD");
    }
    case "hourly":
    case "detailed":
    default: {
      return m.endOf("day").format("YYYY-MM-DD");
    }
  }
}

async function main() {
  // 1
  uuAppErrorMap = validateDtoIn();

  // 2
  weatherstationClient = new AppClient({ baseUri: dtoIn.baseUri, session });

  // 3
  const uuAppInstance = await loadAppInstance(uuAppErrorMap);

  // 4
  await setReferences(uuAppInstance, uuAppErrorMap);

  await console.info("Initial setup done.");

  // 5
  const aggregationTracker = new AggregationStatusTracker();

  for (const aggregationLevel of AGGREGATION_LEVELS) {
    const aggregationLevelStart = moment();
    await console.info(`Aggregating to ${aggregationLevel}`);
    const sourceLevel = AGGREGATION_SOURCE[aggregationLevel];
    const unaggregatedDatasets = await listUnaggregatedDatasets(sourceLevel, uuAppErrorMap);
    await console.log(`Unaggregated dataset count: ${unaggregatedDatasets.length}`);

    // list all datasets at aggregationLevel that are may be affected by unaggregated datasets
    const affectedDatasets = unaggregatedDatasets.reduce((periods, dataset) => {
      const periodBounds = _getDatasetAffectedPeriod(dataset, aggregationLevel);
      const datasetStarts = _getAllDatasetStartDatesBetween(_getStartDate(periodBounds.startDate, aggregationLevel), _getEndDate(periodBounds.endDate, aggregationLevel), aggregationLevel);
      datasetStarts.forEach(startDate => {
        const marker = `${dataset.gatewayId}|${startDate}|${aggregationLevel}`;
        const blankDatasetDesc = {
          gatewayId: dataset.gatewayId,
          startDate,
          endDate: _getEndDate(startDate, aggregationLevel),
          unaggregatedIds: []
        };
        periods[marker] = periods[marker] ?? blankDatasetDesc;
        periods[marker].unaggregatedIds.push(dataset.id);
        aggregationTracker.markForAggregation([dataset.id], sourceLevel, aggregationLevel);
      });
      return periods;
    }, {});

    for (const datasetMarker in affectedDatasets) {
      const datasetDesc = affectedDatasets[datasetMarker];

      const dataset = (await cachedGetDataset(aggregationLevel, datasetDesc.startDate, datasetDesc.gatewayId)).data;

      for (const index in dataset.data) {
        const entry = dataset.data[index];
        const nextTimestamp = _nextTimestamp(entry.timestamp, aggregationLevel);

        dataset.data[index] = await _generateEntry(sourceLevel, entry.timestamp, nextTimestamp, dataset.gatewayId, entry.label);
      }

      dataset.gatewayId = datasetDesc.gatewayId;

      await postAggregatedDataset(dataset);
      aggregationTracker.markAsAggregated(datasetDesc.unaggregatedIds, aggregationLevel);
    }

    const aggregatedDatasets = aggregationTracker.getFullyAggregated();
    await console.log(await markAggregated(aggregatedDatasets, aggregationLevelStart));
  }

  return { uuAppErrorMap };
}

main();
