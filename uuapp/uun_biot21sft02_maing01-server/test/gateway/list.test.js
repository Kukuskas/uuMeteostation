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
  gateway = removeProps(await calls.create(), ["uuAppErrorMap"]);
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Testing gateway/list HDS", () => {
  test("HDS", async () => {
    expect.hasAssertions();

    const dtoIn = {
    };

    const result = await calls.list(dtoIn)

    expect(result.status).toBe(200);
    expect(result.uuAppErrorMap).toEqual({});
    expect(result.itemList).toEqual(expect.arrayContaining([expect.objectContaining(gateway)]))
    expect(result.pageInfo).toHaveProperty("pageIndex", "pageSize", "total")

  });
});

