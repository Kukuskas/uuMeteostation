const { TestHelper } = require("uu_appg01_server-test");
const calls = require("./calls.js");
const { uuAppInstance, gateway:gatewayCalls } = require("../calls.js");
const { removeProps } = require("../call-helper");

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

  dataset = removeProps((await gatewayCalls.postData(dtoIn)).data,["uuAppErrorMap", "gateway"])
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Testing dataSet/list-by-dates HDS", () => {
  test("HDS", async () => {
    expect.hasAssertions();

    const dtoIn = {
      gatewayId: gateway.id,
      type: "detailed", // dataset type
      startDate: "2020-01-01", // start of the data contained in the dataset
      endDate: "2020-02-03"

    };

    const result = await calls.listByDates(dtoIn)
    

    expect(result.status).toBe(200);
    expect(result.uuAppErrorMap).toEqual({});
    expect(result.data.itemList).toContainEqual(expect.objectContaining(dataset));
  });
});
