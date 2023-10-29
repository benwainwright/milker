import { RtmFail } from "rtm-js";

export class RtmApiFailure extends Error {
  constructor(failureResponse: RtmFail["rsp"]) {
    super(
      `Failed with code ${failureResponse.err.code}: ${failureResponse.err.msg}`,
    );
  }
}
