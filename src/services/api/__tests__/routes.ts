import jest from "jest";
import Routes from "../routes";

describe("Routes", () => {
  test("Route array should have one route", async () => {
    expect(Routes.length).toEqual(1);
  });
});
