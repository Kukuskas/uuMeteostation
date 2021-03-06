import Calls from "../src/calls.js";
import HttpClient from "./http-client.js";

const appAssetsBaseUri = (
  document.baseURI ||
  (document.querySelector("base") || {}).href ||
  location.protocol + "//" + location.host + location.pathname
).replace(/^(.*)\/.*$/, "$1/"); // strip what's after last slash

/**
 * Mocks
 */
 Calls.call = (method, url, dtoIn) => {
  // This is workaround, because when the library is used in a project and we want to develop with library in with mocks
  // it generates the wrong URI, (e.g. localhost:1234 where the app is running, not the library)
  // Also we can't read development.json so we can not read port, thus it's hardcoded.
  let mockUrl = "http://localhost:4321/mock/data/" + url + ".json";
  let responsePromise = HttpClient.get(mockUrl);
  return dtoIn != null ? responsePromise.then(dtoIn.done, dtoIn.fail) : responsePromise;
};

Calls.getCommandUri = (aUseCase) => {
  return aUseCase;
};

export default Calls;
