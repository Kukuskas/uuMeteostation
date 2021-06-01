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
const AGGREGATED_REQUIREMENTS = {
  detailed: ["hourly"],
  hourly: ["daily"],
  daily: ["weekly", "monthly"]
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

// global vars
let weatherstationClient = null;
let progressClient = null;
let progressCode = null;
let startedAt = moment.parseZone();

// helpers
async function proceed({ message = "Script is running.", state = "running", totalWork = null, doneWork = null }, uuAppErrorMap = {}) {
  try {
    await progressClient.post("progress/proceed", {
      code: progressCode,
      message,
      state,
      totalWork,
      doneWork
    });
  } catch (e) {
    await addWarning(WARNINGS.progressProceedFailed, uuAppErrorMap, { cause: e }, false);
  }
}

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

async function addWarning(warning, uuAppErrorMap, paramMap = {}, updateProgress = true) {
  ValidationHelper.addWarning(uuAppErrorMap, warning.code, warning.message ?? null, paramMap);
}

// steps
function validateDtoIn() {
  const validator = new Validator(DTOIN_SCHEMA);
  const validationResult = validator.validate("checkGatewayDtoInType", dtoIn);

  return ValidationHelper.processValidationResult(dtoIn, validationResult, WARNINGS.unsupportedKeys.code, ERRORS.InvalidDtoIn);
}

async function loadAppInstance(uuAppErrorMap) {
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

async function listUnaggregatedDatasets(type, uuAppErrorMap) {
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
      await console.log(`Getting unaggregated data page ${dtoIn.pageInfo.pageIndex}`);
      dtoOut = await weatherstationClient.post("dataset/listUnaggregatedData", dtoIn);
      await console.log(`Received unaggregated data ${JSON.stringify(dtoOut.pageInfo)}`);
      datasets.push(...dtoOut.itemList);
    } catch (e) {
      throw e;
      await throwError(new ScriptError());
    }
  } while ((dtoOut.pageInfo.pageIndex + 1) * dtoOut.pageInfo.pageSize < dtoOut.pageInfo.total);
  return datasets;
}

// helpers

/**
 * Returns the period, which is affected by unaggregated datasets
 * @param {*} dataset
 */
function _getDatasetAggregatePeriod(dataset, aggregationLevel) {
  switch (aggregationLevel) {
    // data for the whole period is already contained in the lower level aggregation
    case ("hourly", "daily", "monthly"): {
      return {
        startDate: dataset.startDate,
        endDate: dataset.endDate
      };
    }
    case "weekly": {
      return {
        startDate: moment
          .parseZone(dataset.startDate)
          .startOf("isoWeek")
          .format("YYYY-MM-DD"),
        endDate: moment
          .parseZone(dataset.startDate)
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
  let nextDate = moment.parseZone(_getStartDate(startDate, type)).startOf("day");
  const maxDate = moment.parseZone(endDate).endOf("day");
  // console.log({ startDate, endDate, nextDate, maxDate, type, calculatedStartDate: _getStartDate(startDate, type) });
  while (nextDate.isSameOrBefore(maxDate)) {
    startDates.push(nextDate.format("YYYY-MM-DD"));
    nextDate = moment.parseZone(_getEndDate(nextDate, type)).add(1, "day");
  }
  return startDates;
}

async function listDatasets(type, startDate, endDate, gatewayId, uuAppErrorMap) {
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

function _extractDataEntries(datasets, startDate, endDate) {
  const start = moment.parseZone(startDate);
  const end = moment.parseZone(endDate);
  const dataPoints = [];
  datasets.forEach(d => {
    dataPoints.push(...d.data);
  });
  return dataPoints.filter(d => start.isSameOrBefore(d.timestamp) && end.isAfter(d.timestamp));
}

async function getDataset(type, date, gatewayId, uuAppErrorMap) {
  try {
    return weatherstationClient.get("dataset/getOrCreate", { gatewayId, type, date });
  } catch (e) {
    throwError(new Error(e));
  }
}

async function postAggregatedDataset(dataset) {
  try {
    await console.info(dataset);
    return weatherstationClient.post("dataset/postAggregatedData", dataset);
  } catch (e) {
    await console.warning(e);
  }
}

function _trimDecimals(val, dec) {
  const coef = 10 ** dec;
  return Math.floor(val * coef) / coef;
}

async function _calculatePeriod(entries, timestamp, label) {
  const nested = entries.hasOwnProperty("avg");

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
  const relevantDatasets = await listDatasets(sourceType, start, end, gatewayId);
  const relevantDataEntries = _extractDataEntries(relevantDatasets, start, end);
  const generatedEntry = _calculatePeriod(relevantDataEntries, start, label);
  // await console.warning({ sourceType, start, end, gatewayId, label, relevantDatasets, relevantDataEntries, generatedEntry });
  return generatedEntry;
}

function _nextTimestamp(timestamp, datasetType) {
  const offset = DATASET_TYPES[datasetType].entryOffset;
  return moment.parseZone(timestamp).add(offset);
}

function _getStartDate(timestamp, datasetType) {
  switch (datasetType) {
    case "weekly": {
      return moment
        .parseZone(timestamp)
        .isoWeek(1)
        .startOf("isoWeek")
        .format("YYYY-MM-DD");
    }
    case "daily":
    case "monthly": {
      return moment
        .parseZone(timestamp)
        .startOf("year")
        .format("YYYY-MM-DD");
    }
    case "hourly":
    case "detailed":
    default: {
      return moment
        .parseZone(timestamp)
        .startOf("day")
        .format("YYYY-MM-DD");
    }
  }
}

function _getEndDate(timestamp, datasetType) {
  switch (datasetType) {
    case "weekly": {
      const m = moment.parseZone(timestamp);
      return m
        .isoWeek(m.isoWeeksInYear())
        .endOf("isoWeek")
        .format("YYYY-MM-DD");
    }
    case "daily":
    case "monthly": {
      return moment
        .parseZone(timestamp)
        .endOf("year")
        .format("YYYY-MM-DD");
    }
    case "hourly":
    case "detailed":
    default: {
      return moment
        .parseZone(timestamp)
        .endOf("day")
        .format("YYYY-MM-DD");
    }
  }
}

async function main() {
  // 1
  const uuAppErrorMap = validateDtoIn();

  // 2
  weatherstationClient = new AppClient({ baseUri: dtoIn.baseUri, session });

  // 3
  const uuAppInstance = await loadAppInstance(uuAppErrorMap);

  // 4
  await setReferences(uuAppInstance, uuAppErrorMap);

  await console.info("Initial setup done.");

  // 5
  for (const aggregationLevel of AGGREGATION_LEVELS) {
    await console.info(`Aggregating to ${aggregationLevel}`);
    const sourceLevel = AGGREGATION_SOURCE[aggregationLevel];
    const unaggregatedDatasets = await listUnaggregatedDatasets(sourceLevel, uuAppErrorMap);
    await console.log(`Unaggregated dataset count: ${unaggregatedDatasets.length}`);

    // list all periods that are may be affected by unaggregated datasets
    const affectedDatasets = unaggregatedDatasets.reduce((periods, dataset) => {
      const periodBounds = _getDatasetAggregatePeriod(dataset, aggregationLevel);
      const affectedDatasets = _getAllDatasetStartDatesBetween(periodBounds.startDate, periodBounds.endDate, dataset.type);
      // console.log({ dataset, periodBounds, affectedDatasets });
      affectedDatasets.forEach(startDate => {
        const marker = `${dataset.gatewayId}|${startDate}`;
        periods[marker] = {
          gatewayId: dataset.gatewayId,
          startDate
        };
      });
      return periods;
    }, {});

    await console.log(affectedDatasets);

    for (const datasetMarker in affectedDatasets) {
      const datasetDesc = affectedDatasets[datasetMarker];

      const dataset = (await getDataset(aggregationLevel, datasetDesc.startDate, datasetDesc.gatewayId, uuAppErrorMap)).data;

      console.log({ datasetMarker, datasetDesc, dataset });

      for (const index in dataset.data) {
        const entry = dataset.data[index];
        // await console.log({ datasetMarker, index, entry });
        const nextTimestamp = _nextTimestamp(entry.timestamp, aggregationLevel);

        dataset.data[index] = await _generateEntry(sourceLevel, entry.timestamp, nextTimestamp, dataset.gatewayId, entry.label);
      }

      dataset.gatewayId = datasetDesc.gatewayId;

      await postAggregatedDataset(dataset);
    }

    // await markAggregated(unaggregatedDatasets, aggregationLevel);
  }

  return { uuAppErrorMap };
}

main();
