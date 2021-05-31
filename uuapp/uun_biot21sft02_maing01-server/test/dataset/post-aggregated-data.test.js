const { TestHelper } = require("uu_appg01_server-test");
const calls = require("./calls.js");
const { uuAppInstance, gateway: gatewayCalls } = require("../calls.js");
const { removeProps } = require("../call-helper"); //props

beforeAll(async () => {
  await TestHelper.setup();
});

let gateway

beforeEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.prepareApp(uuAppInstance.defaults.init);
  const gatewayCreateDtoIn = { uuEe: "25-8074-1", timezone: "UTC" };
  gateway = removeProps(await gatewayCalls.create(gatewayCreateDtoIn), ["uuAppErrorMap"]);
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Testing gateway/postAggregatedData HDS", () => {
  test("HDS", async () => {
    expect.hasAssertions();



    const dtoIn = {
      gatewayId: gateway.id, // gateway to which it corresponds to
      type: "hourly", // dataset type
      startDate: "2021-01-01", // start of contained data
      endDate: "2021-01-01", // end of contained data
      data: [
        {
          label: "2021-01-01T00", // label generated according to aggregation concept
          timestamp: "2021-01-01T00:00:00.000Z", // start of the measured period
          min: {
            temperature: 22,
            humidity: 55
          },
          avg: {
            temperature: 22.568,
            humidity: 58.256
          },
          max: {
            temperature: 23,
            humidity: 64.52
          }
        },
      ]
    };

    const result = await calls.postAggregatedData(dtoIn)

    expect(result.status).toBe(200);
    expect(result.uuAppErrorMap).toEqual({});
    expect(result.awid).toBe(TestHelper.getAwid());
    expect(result.data).toEqual(expect.objectContaining(dtoIn));
  })
})