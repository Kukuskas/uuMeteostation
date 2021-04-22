/* eslint-disable */

const datasetGetDtoInType = shape({
  gatewayId: mongoId().isRequired(["gatewayCode"]),
  gatewayCode: code().isRequired(["gatewayId"]),
  type: oneOf(["detailed", "hourly", "daily", "weekly", "monthly"]).isRequired(),
  date: date().isRequired()
});

const datasetListByDatesDtoInType = shape({
  gatewayId: mongoId().isRequired(["gatewayCode"]),
  gatewayCode: code().isRequired(["gatewayId"]),
  type: oneOf(["detailed", "hourly", "daily", "weekly", "monthly"]).isRequired(),
  startDate: date().isRequired(),
  endDate: date().isRequired(),
  pageInfo: shape({
    pageIndex: integer(0, null),
    pageSize: integer(1, 100)
  })
});

const datasetListUnaggregatedDataDtoInType = shape({
  type: oneOf(["detailed", "hourly", "daily"]).isRequired(),
  pageInfo: shape({
    pageIndex: integer(0, null),
    pageSize: integer(1, 2000)
  })
});

const datasetPostAggregatedDataDtoInType = shape({
  id: id(),
  gatewayId: id().isRequired(),
  type: oneOf(["hourly", "daily", "weekly", "monthly"]).isRequired(),
  startDate: date().isRequired(),
  endDate: date().isRequired(),
  data: array(shape({
    timestamp: datetime().isRequired(),
    label: oneOf([
      datetime("%Y-M%m"),
      datetime("%Y-W%V"),
      datetime("%Y-%m-%d"),
      datetime("%Y-%m-%dT%H")
    ]).isRequired(),
    min: shape({
      temperature: float(-273.15, null, 3),
      humidity: float(0, 100, 3)
    }).isRequired(),
    avg: shape({
      temperature: float(-273.15, null, 3),
      humidity: float(0, 100, 3)
    }).isRequired(),
    max: shape({
      temperature: float(-273.15, null, 3),
      humidity: float(0, 100, 3)
    }).isRequired()
  }), 1, 366).isRequired()
});

const datasetMarkAggregatedDtoInType = shape({
  datasetIdList: array(id()).isRequired(),
  modifiedBefore: datetime().isRequired()
});