import { Requester } from "./Requester";

describe("The Requester", () => {
  it("makes a properly authed request to the RTM endpoint", async () => {
    const key = "abc123";
    const secret = "BANANAS";
    const requester = new Requester(key, secret, "delete");

    const response = await requester.get("foo", {
      yxz: "foo",
      feg: "bar",
      abc: "baz",
    });
  });
});
