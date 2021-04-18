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
