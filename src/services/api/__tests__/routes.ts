import jest from "jest";
import Routes from "../routes";

describe("Routes", () => {
  test("Route array should have the right length", async () => {
    expect(Routes.length).toEqual(3);
  });
});
