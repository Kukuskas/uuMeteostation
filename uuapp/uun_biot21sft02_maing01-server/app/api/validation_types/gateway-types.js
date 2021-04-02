/* eslint-disable */

const gatewayCreateDtoInType = shape({
  code: code(),
  name: string(200),
  location: gps(),
  uuEe: uuIdentity().isRequired(), //uuId of the uuEE worker
});
