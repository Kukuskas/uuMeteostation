/* eslint-disable */

const datasetGetDtoInType = shape({
  gatewayId: mongoId().isRequired(["gatewayCode"]),
  gatewayCode: code().isRequired(["gatewayId"]),
  type: oneOf(["detailed", "hourly", "daily", "weekly", "monthly"]).isRequired(),
  date: date().isRequired()
});
