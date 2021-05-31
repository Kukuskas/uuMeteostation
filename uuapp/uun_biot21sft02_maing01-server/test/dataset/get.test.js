const { TestHelper } = require("uu_appg01_server-test");
const calls = require("./calls.js");
const { uuAppInstance, gateway:gatewayCalls } = require("../calls.js");
const { removeProps } = require("../call-helper"); //props

beforeAll(async () => {
  await TestHelper.setup();
});

let gateway;
let dataset;
beforeEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.prepareApp(uuAppInstance.defaults.init);
  const gatewayCreateDtoIn = {uuEe:"25-8074-1"}
  gateway = removeProps(await gatewayCalls.create(gatewayCreateDtoIn),["uuAppErrorMap"]);
  const dtoIn = {
    data: [{
      timestamp: "2020-01-01T00:01:23.080Z",
      temperature: 23.25,
      humidity: 45.22,
    }]
  };

  dataset = removeProps((await gatewayCalls.postData(dtoIn)).data ,["uuAppErrorMap", "gateway"])
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Testing dataSet/get HDS", () => {
  test("HDS", async () => {
    expect.hasAssertions();

    const dtoIn = { gatewayId: gateway.id, // gateway object id
    type: "detailed", // dataset type
    date: "2020-01-01"
    };

    const result = await calls.get(dtoIn)

    

    expect(result.status).toBe(200);
    expect(result.uuAppErrorMap).toEqual({});
    expect(result.awid).toBe(TestHelper.getAwid());
    expect(result.data).toEqual(expect.objectContaining(dataset));
  });
});