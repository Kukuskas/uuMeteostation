const { TestHelper } = require("uu_script_devkitg01");

describe("Aggregate", () => {
  test("HDS", async () => {
    const session = await TestHelper.login();

    const dtoIn = {};

    const result = await TestHelper.runScript("aggregate.js", dtoIn, session);
    expect(result.isError).toEqual(false);
  });
});
