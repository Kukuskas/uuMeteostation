/* eslint-disable */

const gatewayCreateDtoInType = shape({
  code: code(),
  name: string(200),
  location: gps(),
  uuEe: uuIdentity().isRequired(), //uuId of the uuEE worker
});

const gatewayUpdateDtoInType = {
  id: id().isRequired(),
  name: string(200),
  location: gps(),
  code: code(),
  uuEe: uuIdentity(), // uuId of the uuEE worker
  state: oneOf(["active", "closed"])
};

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
