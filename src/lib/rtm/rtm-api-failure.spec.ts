import { RtmApiFailure } from "./rtm-api-failure";

test("rtm api failure constructs without errorss given a valid error response", () => {
  new RtmApiFailure({ stat: "fail", err: { code: 2, msg: "foo" } });
});
