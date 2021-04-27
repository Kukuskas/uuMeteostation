const defaultsDeep = require("lodash.defaultsdeep");
const { TestHelper } = require("uu_appg01_server-test");

function addDefaults(dtoIn, defaults) {
  const dtoInWithDefaults = defaultsDeep({}, dtoIn, defaults);
  return JSON.parse(JSON.stringify(dtoInWithDefaults));
}

async function _login(profile) {
  if (!profile) {
    return null;
  }
  const profilesWithoutPermissions = ["AsidLicenseOwner", "AsidAuthorities", "AwidLicenseOwner"];
  const createPermissions = !profilesWithoutPermissions.includes(profile);
  return await TestHelper.login(profile, createPermissions);
}

function generateCall(method, useCase, defaults = {}, defaultProfile = null) {
  let executeCommand = null;
  switch (method) {
    case "GET":
      executeCommand = TestHelper.executeGetCommand.bind(TestHelper);
      break;
    case "POST":
      executeCommand = TestHelper.executePostCommand.bind(TestHelper);
      break;
    default:
      executeCommand = () => { throw new Error(`Unable to generate call for method ${method}!`) };
  }

  return async (dtoIn = {}, profile = defaultProfile, awid = null) => {
    const dtoInWithDefaults = addDefaults(dtoIn, defaults);
    const session = await _login(profile);
    return await executeCommand(useCase, dtoInWithDefaults, session, awid);
  }

}

function removeProps(o, keysToBeRemoved) {
  const newObj = {...o};
  keysToBeRemoved.forEach(key => delete newObj[o]);
  return newObj;
}

function keepProps(o, keysToBeKept) {
  return keysToBeKept.reduce((newObj, key) => {
    if (o.hasOwnProperty(key)) {
      newObj[key] = o[key];
    }
  }, {});
}

module.exports = {
  addDefaults,
  generateCall,
  removeProps,
  keepProps
}