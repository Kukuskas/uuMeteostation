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

const uuAppInstanceLoadDtoInType = shape({});

const uuAppInstanceScheduleScriptsDtoInType = shape({
  uuConsoleUri: uri(),
  uuScriptEngineUri: uri(),
  uuConsoleCode: code(),
  authorizationUriMap: shape({
    Authorities: uri(),
    Writers: uri(),
    Readers: uri()
  }),
  scripts: map(
    oneOf(["aggregate","trim","checkGateway"]),
    shape({
      scriptUri: uri().isRequired(),
      cron: string(/^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|(^((?!\*-)((\d+,)+\d+|([\d\*]+(\/|-)\d+)|\d+|(?<!\d)\*(?!\d)) ?){5,7})$/),
      progressCode: code()
    })
  ),
  removeExisting: boolean(),
  rescheduleScripts: boolean()
});

const uuAppInstanceScriptCallbackDtoInType = shape({
  sysScript: shape({
    scriptEngineBaseUri: uri().isRequired(),
    scriptRunId: id().isRequired(),
    scriptRepeatedRunId: id(),
    scriptUri: uri(),
    scriptRunState: oneOf(["COMPLETED", "FAILED", "CANCELED"]),
    callbackData: shape({
      script: oneOf(["aggregate", "checkGateway", "trim"])
    }, true, 2000).isRequired()
  }),
  uuAppErrorMap: shape({}, true)
}, true);
