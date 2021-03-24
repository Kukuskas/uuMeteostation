const { TestHelper, AppClient } = require("uu_script_devkitg01");

describe("rate-jokes", () => {
  test("HDS", async () => {
    const session = await TestHelper.login("Reader");

    const dtoIn = {
      baseUri: "https://uuos9.plus4u.net/uu-jokes-maing01/84723967990075193-268b3a2cdbe546dc92119dd8da18624b/",
      rating: 5
    };

    const result = await TestHelper.runScript("rate-jokes.js", dtoIn, session);
    expect(result.isError).toEqual(false); // no error was logged
    expect(result.scriptResult.dtoIn).toBeDefined();
    expect(result.scriptResult.dtoIn.rating).toEqual(5);
    expect(result.scriptResult.ratingStatsBefore).toBeDefined();
    expect(result.scriptResult.ratingStatsAfter).toBeDefined();
    expect(result.scriptResult.uuAppErrorMap).toEqual({});

    // check that new rating is higher or the same as before (must be, as the script should rate all jokes with 5 stars.)
    const countRating = r =>
      r.reduce((total, rating) => {
        return total + rating.rating * rating.count;
      }, 0);

    const before = countRating(result.scriptResult.ratingStatsBefore);
    const after = countRating(result.scriptResult.ratingStatsAfter);
    expect(before).toBeLessThanOrEqual(after);

    // check that two UU5.SimpleChart.BarChart components were logged on INFO level
    const chartMessages = result.messageList.filter(m => m.messageType === "INFO" && m.message.includes("UU5.SimpleChart.BarChart"));
    expect(chartMessages.length).toBe(2);
  });

  test("A1 - dtoIn contains unsupported keys", async () => {
    const session = await TestHelper.login("Reader");

    const dtoIn = {
      baseUri: "https://uuos9.plus4u.net/uu-jokes-maing01/84723967990075193-268b3a2cdbe546dc92119dd8da18624b/",
      rating: 5,
      foo: "bar"
    };

    const result = await TestHelper.runScript("rate-jokes.js", dtoIn, session);
    expect(result.scriptResult.uuAppErrorMap).toBeDefined();
    expect(result.scriptResult.uuAppErrorMap.hasOwnProperty("uu-jokes-maing01/script/rate-jokes/unsupportedKeys")).toEqual(true);
  });

  test("A2 - invalid dtoIn", async () => {
    const dtoIn = {
      rating: 5
    };

    try {
      await TestHelper.runScript("rate-jokes.js", dtoIn);
      fail();
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual("uu-jokes-maing01/script/rate-jokes/invalidDtoIn");
      expect(e.message).toEqual("DtoIn is not valid.");
      expect(e.paramMap.invalidValueKeyMap).toBeDefined();
      expect(e.paramMap.missingKeyMap).toBeDefined();
      expect(e.paramMap.missingKeyMap["$.baseUri"]).toBeDefined();
    }
  });

  test("A3 - failed to list jokes", async () => {
    const dtoIn = {
      baseUri: "https://uuos9.plus4u.net/uu-jokes-maing01/84723967990075193-268b3a2cdbe546dc92119dd8da18624b/",
      rating: 5
    };

    try {
      await TestHelper.runScript("rate-jokes.js", dtoIn);
      fail();
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual("uu-jokes-maing01/script/rate-jokes/jokeListFailed");
      expect(e.message).toEqual("Jokes loading failed.");
      expect(e.cause.code).toEqual("uu-appg01/authorization/accessDenied");
      expect(e.cause.dtoOut.uuIdentity).toEqual("0-0"); // no session -> started under anonymous user.
    }
  });

  test("A5 - failed to rate a joke", async () => {
    AppClient.mock(useCase => {
      if (useCase === "joke/addRating") {
        const e = new Error("Update jokeRating by jokeRating DAO update failed.");
        e.code = "uu-jokes-main/joke/addRating/jokeRatingDaoUpdateFailed";
        throw e;
      }
      return null; // other requests wont be mocked
    });

    const session = await TestHelper.login("Reader");

    const dtoIn = {
      baseUri: "https://uuos9.plus4u.net/uu-jokes-maing01/84723967990075193-268b3a2cdbe546dc92119dd8da18624b/",
      rating: 5
    };

    try {
      await TestHelper.runScript("rate-jokes.js", dtoIn, session);
      fail();
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual("uu-jokes-maing01/script/rate-jokes/jokeAddRatingFailed");
      expect(e.message).toMatch(/^Rating of joke with id .+ failed\.$/);
      expect(e.cause.code).toEqual("uu-jokes-main/joke/addRating/jokeRatingDaoUpdateFailed");
      expect(e.dtoOut.ratingStatsBefore).toBeDefined();
    }
  });
});
