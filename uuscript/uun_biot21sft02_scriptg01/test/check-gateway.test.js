const { TestHelper } = require("uu_script_devkitg01");

describe("CheckGateway", () => {
  test("HDS", async () => {
    const session = await TestHelper.login();

    const dtoIn = {};

    const result = await TestHelper.runScript("check-gateway.js", dtoIn, session);
    expect(result.isError).toEqual(false);
  });
});
