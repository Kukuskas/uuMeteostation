/**
 * Server calls of application client.
 */
import UU5 from "uu5g04";
import Plus4U5 from "uu_plus4u5g01";

let Calls = {
  /** URL containing app base, e.g. "https://uuos9.plus4u.net/vnd-app/awid/". */
  APP_BASE_URI: location.protocol + "//" + location.host + UU5.Environment.getAppBasePath(),

  async call(method, url, dtoIn, clientOptions) {
    let response = await Plus4U5.Common.Calls.call(method, url, dtoIn, clientOptions);
    return response.data;
  },

  uuSubAppInstanceLoad(dtoIn) {
    let commandUri = Calls.getCommandUri("uuSubAppInstance/load", dtoIn.uri);
    return Calls.call("get", commandUri, dtoIn.data);
  },

  gatewayLoad(dtoIn) {
    let commandUri = Calls.getCommandUri("gateway/load", dtoIn.uri);
    return Calls.call("get", commandUri, dtoIn.data);
  },

  gatewayUpdate(baseUri, dtoIn) {
    let commandUri = Calls.getCommandUri("gateway/update", baseUri);
    return Calls.call("post", commandUri, dtoIn);
  },

  gatewaySetState(baseUri, dtoIn) {
    let commandUri = Calls.getCommandUri("gateway/setState", baseUri);
    return Calls.call("post", commandUri, dtoIn);
  },

  gatewaysList(baseUri, dtoIn) {
    // let commandUri = Calls.getCommandUri("gateways/list", baseUri);
    // return Calls.call("get", commandUri, dtoIn);
    return {
      "itemList": [
        {
          "code": "gw01",
          "name": "Gateway nr. 1",
          "location": "Praha 2",
          "uuEe": "26-1986-1",
          "awid": "44701e7183e94852859303f2bfca9a7f",
          "state": "active",
          "current": {
            "temperature": null,
            "humidity": null,
            "timestamp": "2021-04-17T14:00:00+02:00"
          },
          "min": {
            "temperature": null,
            "humidity": null
          },
          "max": {
            "temperature": null,
            "humidity": null
          },
          "sys": {
            "cts": "2021-04-13T16:58:29.451Z",
            "mts": "2021-04-17T12:10:00.551Z",
            "rev": 54
          },
          "id": "6075cdb589914000278109ac"
        },
        {
          "code": "gwmnpbout1",
          "name": "MnpB - outside",
          "location": "Praha 10",
          "uuEe": "4101-908-1",
          "awid": "44701e7183e94852859303f2bfca9a7f",
          "state": "active",
          "current": {
            "temperature": 12.9,
            "humidity": 64.2,
            "timestamp": "2021-05-01T19:50:00+02:00"
          },
          "min": {
            "temperature": null,
            "humidity": null
          },
          "max": {
            "temperature": null,
            "humidity": null
          },
          "sys": {
            "cts": "2021-04-17T13:22:10.797Z",
            "mts": "2021-05-01T18:00:02.056Z",
            "rev": 1340
          },
          "id": "607ae102ce50a00027c742fc"
        },
        {
          "name": "uuThing2 Meteostation",
          "location": "Praha 8",
          "uuEe": "26-1987-1",
          "code": "uut2l",
          "awid": "44701e7183e94852859303f2bfca9a7f",
          "state": "active",
          "current": {
            "temperature": 24.3,
            "humidity": 39.7,
            "timestamp": "2021-04-20T17:03:12+02:00"
          },
          "min": {
            "temperature": null,
            "humidity": null
          },
          "max": {
            "temperature": null,
            "humidity": null
          },
          "sys": {
            "cts": "2021-04-20T15:14:37.827Z",
            "mts": "2021-04-20T15:17:16.559Z",
            "rev": 2
          },
          "id": "607eefdd0d7c640027601db2"
        }
      ],
      "pageInfo": {
        "pageIndex": 0,
        "pageSize": 100,
        "total": 3
      },
      "uuAppErrorMap": {}
    }
  },

  loadDemoContent(dtoIn) {
    let commandUri = Calls.getCommandUri("loadDemoContent");
    return Calls.call("get", commandUri, dtoIn);
  },

  loadIdentityProfiles() {
    let commandUri = Calls.getCommandUri("sys/uuAppWorkspace/initUve");
    return Calls.call("get", commandUri, {});
  },

  initWorkspace(dtoInData) {
    let commandUri = Calls.getCommandUri("sys/uuAppWorkspace/init");
    return Calls.call("post", commandUri, dtoInData);
  },

  getWorkspace() {
    let commandUri = Calls.getCommandUri("sys/uuAppWorkspace/get");
    return Calls.call("get", commandUri, {});
  },

  async initAndGetWorkspace(dtoInData) {
    await Calls.initWorkspace(dtoInData);
    return await Calls.getWorkspace();
  },

  /*
  For calling command on specific server, in case of developing client site with already deployed
  server in uuCloud etc. You can specify url of this application (or part of url) in development
  configuration in *-client/env/development.json, for example:
   {
     ...
     "uu5Environment": {
       "gatewayUri": "https://uuos9.plus4u.net",
       "tid": "84723877990072695",
       "awid": "b9164294f78e4cd51590010882445ae5",
       "vendor": "uu",
       "app": "demoappg01",
       "subApp": "main"
     }
   }
   */
  getCommandUri(aUseCase, baseUri) {
    // useCase <=> e.g. "getSomething" or "sys/getSomething"
    // add useCase to the application base URI
    let properBaseUri = Calls.APP_BASE_URI;
    if (baseUri) properBaseUri = !baseUri.endsWith("/") ? baseUri.concat("/") : baseUri;

    let targetUriStr = properBaseUri + aUseCase.replace(/^\/+/, "");

    // override tid / awid if it's present in environment (use also its gateway in such case)
    if (process.env.NODE_ENV !== "production") {
      let env = UU5.Environment;
      if (env.tid || env.awid || env.vendor || env.app) {
        let url = Plus4U5.Common.Url.parse(targetUriStr);
        if (env.tid || env.awid) {
          if (env.gatewayUri) {
            let match = env.gatewayUri.match(/^([^:]*):\/\/([^/]+?)(?::(\d+))?(\/|$)/);
            if (match) {
              url.protocol = match[1];
              url.hostName = match[2];
              url.port = match[3];
            }
          }
          if (env.tid) url.tid = env.tid;
          if (env.awid) url.awid = env.awid;
        }
        if (env.vendor || env.app) {
          if (env.vendor) url.vendor = env.vendor;
          if (env.app) url.app = env.app;
          if (env.subApp) url.subApp = env.subApp;
        }
        targetUriStr = url.toString();
      }
    }

    return targetUriStr;
  },
};

export default Calls;
