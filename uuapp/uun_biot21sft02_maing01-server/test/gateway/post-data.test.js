const { TestHelper } = require("uu_appg01_server-test");
const calls = require("./calls.js");
const { uuAppInstance } = require("../calls.js");
const { removeProps } = require("../call-helper");

beforeAll(async () => {
  await TestHelper.setup();
});

let gateway;

beforeEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.prepareApp(uuAppInstance.defaults.init);
  const gatewayCreateDtoIn = {uuEe: "25-8074-1"}
  gateway = removeProps(await calls.create(gatewayCreateDtoIn), ["uuAppErrorMap"]);
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Testing gateway/post-data HDS", () => {
  test("HDS", async () => {
    expect.hasAssertions();

    const dtoIn = {
      data: [{
        timestamp: "2020-01-01T00:01:23.080Z",
        temperature: 23.25,
        humidity: 45.22,
      }]
    };

    const result = await calls.postData(dtoIn)

    expect(result.status).toBe(200);
    expect(result.uuAppErrorMap).toEqual({});
    expect(result.awid).toBe(TestHelper.getAwid());
  });
});