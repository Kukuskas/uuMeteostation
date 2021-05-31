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
  gateway = removeProps(await calls.create(),["uuAppErrorMap"]);

});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Testing gateway/get HDS", () => {
test("HDS by id", async () => {
  expect.hasAssertions();

  const dtoIn = {
    id: gateway.id
  };

  const result = await calls.get(dtoIn)

  expect(result.status).toBe(200);
  expect(result.uuAppErrorMap).toEqual({});
  expect(result.awid).toBe(TestHelper.getAwid());
  expect(result).toEqual(expect.objectContaining(gateway));
});

test("HDS by code", async () => {
  expect.hasAssertions();

  const dtoIn = {
    code: gateway.code
  };

  const result = await calls.get(dtoIn)

  expect(result.status).toBe(200);
  expect(result.uuAppErrorMap).toEqual({});
  expect(result.awid).toBe(TestHelper.getAwid());
  expect(result).toEqual(expect.objectContaining(gateway));
});


test("HDS by uuEe", async () => {
  expect.hasAssertions();

  const dtoIn = {
    uuEe: gateway.uuEe
  };

  const result = await calls.get(dtoIn)

  expect(result.status).toBe(200);
  expect(result.uuAppErrorMap).toEqual({});
  expect(result.awid).toBe(TestHelper.getAwid());
  expect(result).toEqual(expect.objectContaining(gateway));
 });
});

