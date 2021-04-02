/* eslint-disable */

const initDtoInType = shape({
  uuAppProfileAuthorities: uri().isRequired("uuBtLocationUri"),
  uuBtLocationUri: uri(),
  
  name: uu5String(512),
  desc: uu5String(2000),
  state: oneOf(["underConstruction","active","closed"]),
  
  sysState: oneOf(["active","restricted","readOnly"]),
  adviceNote: shape({
    message: uu5String().isRequired(),
    severity: oneOf(["debug", "info", "warning", "error", "fatal"]),
    estimatedEndTime: datetime(),
  }),
  
  retentionPolicy: map(
    oneOf(["detailed", "hourly"]),
    string(/P[0-9]{4}-(0[0-9]|1[0-2])-([0-2][0-9]|3[0-1])$/)  
  )
});
