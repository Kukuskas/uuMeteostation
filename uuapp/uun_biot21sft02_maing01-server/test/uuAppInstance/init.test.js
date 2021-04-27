const { TestHelper } = require("uu_appg01_server-test");
const calls = require("./calls.js");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Testing the init uuCmd...", () => {
  test("HDS", async () => {
    let dtoIn = {
      uuAppProfileAuthorities: "urn:uu:GGALL",
    };
    let result = await calls.init(dtoIn);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });
});