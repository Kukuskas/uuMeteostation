/* eslint-disable */

const gatewayCreateDtoInType = shape({
  code: code(),
  name: string(200),
  location: gps(),
  locationDesc: string(200),
  timezone: string(100).isRequired(),
  uuEe: uuIdentity().isRequired()
});

const gatewayUpdateDtoInType = shape({
  id: id().isRequired(),
  name: string(200),
  location: gps(),
  locationDesc: string(200),
  timezone: string(100),
  code: code(),
  uuEe: uuIdentity(),
  state: oneOf(["active", "closed"])
});

const gatewayGetDtoInType = shape({
  id: id().isRequired(["code", "uuEe"]),
  code: code().isRequired(["id", "uuEe"]),
  uuEe: uuIdentity().isRequired(["id", "code"])
});

const gatewayListDtoInType = shape({
  state: oneOf([
    array(oneOf(["created","active","disconnected","closed"])),
    "created","active","disconnected","closed"
  ]),
  pageInfo: shape({
    pageIndex: integer(0, null),
    pageSize: integer(1, 100)
  })
});

const gatewayPostDataDtoInType = shape({
  id: mongoId(),
  data: array(shape({
    timestamp: datetime().isRequired(),
    temperature: float(-273.15, null, 3),
    humidity: float(0, 100, 3)
  }), 1, null).isRequired()
});

const gatewayLogMessageDtoInType = shape({
  type: oneOf(["info", "warn", "error"]).isRequired(),
  message: string().isRequired(),
  info: shape({}, true)
});

const gatewayDeleteDtoInType = shape({
  id: id().isRequired()
 });
