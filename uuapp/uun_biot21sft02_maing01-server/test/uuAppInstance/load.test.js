const { TestHelper } = require("uu_appg01_server-test");
const calls = require("./calls.js");
const { uuAppInstance } = require("../calls.js");

beforeAll(async () => {
  await TestHelper.setup();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.prepareApp(uuAppInstance.defaults.init);
});

afterAll(async () => {
  await TestHelper.teardown();
});
