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

describe("Testing gateway/create uuCmd HDS", () => {
  test("HDS full", async () => {
    expect.hasAssertions();

    const dtoIn = {
      name: "test gateway name",
      code: "testgwcode",
      uuEe: "14-2710-5",
      location: "37.434793618737,-140.466346175446"
    };

    let result = await calls.create(dtoIn);

    expect(result.status).toBe(200);
    expect(result.uuAppErrorMap).toEqual({});
    expect(result.awid).toBe(TestHelper.getAwid());
    expect(result.state).toBe("created");
    expect(result).toEqual(expect.objectContaining(dtoIn));
  });

  test("HDS - added defaults", async () => {
    expect.hasAssertions();

    const defaults = {
      state: "created",
      log: [],
      current: {
        temperature: null,
        humidity: null,
        timestamp: null
      },
      min: {
        temperature: null,
        humidity: null
      },
      max: {
        temperature: null,
        humidity: null
      }
    };

    let result = await calls.create();

    expect(result.status).toBe(200);
    expect(result.uuAppErrorMap).toEqual({});
    expect(result).toMatchObject(defaults);
  });

  test("HDS - code creation", async () => {
    expect.hasAssertions();

    const dtoIn = {
      name: "test gateway name",
      code: undefined,
      uuEe: "14-2710-5",
      location: "37.434793618737,-140.466346175446"
    };

    let result = await calls.create(dtoIn);

    expect(result.status).toBe(200);
    expect(result.uuAppErrorMap).toEqual({});
    expect(result.code).toEqual(expect.any(String));
  });
});

describe("Testing gateway/create AS CodeIsNotUnique", () => {
  test("AS - CodeIsNotUnique", async () => {
    expect.hasAssertions();

    const dtoIn1 = {
      uuEe: "9-1",
      code: "gw1"
    };

    const dtoIn2 = {
      uuEe: "9-2",
      code: "gw1"
    };

    const errorParams = {
      awid: TestHelper.getAwid(),
      code: dtoIn2.code
    };

    await calls.create(dtoIn1);

    try {
      await calls.create(dtoIn2);
    } catch (e) {
      expect(e.status).toBe(400);
      expect(e.dtoOut).toHaveProperty(["uuAppErrorMap", "uun-biot21sft02-main/gateway/create/codeIsNotUnique"]);
      expect(e.code).toBe("uun-biot21sft02-main/gateway/create/codeIsNotUnique");
      expect(e.message).toBe("Gateway with this code already exists.");
      expect(e.paramMap).toEqual(errorParams);
    }
  });
});

describe("Testing gateway/create AS UuEeIsNotUnique", () => { })
