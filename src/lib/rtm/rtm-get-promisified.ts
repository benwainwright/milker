import {
  DefaultArgs,
  RememberTheMilkApi,
  RtmApiMapping,
  RtmSuccess,
} from "rtm-js";
import { RtmApiFailure } from "./rtm-api-failure";

export const rtmGetPromisified = <M extends keyof RtmApiMapping>(
  client: RememberTheMilkApi,
  method: M,
  params: RtmApiMapping[M]["requestArgs"] & DefaultArgs,
) => {
  return new Promise<RtmSuccess<M>["rsp"]>((accept, reject) => {
    client.get(method, params, (response, error) => {
      if (error) {
        reject(error);
      } else if (response) {
        const { rsp: responseObject } = response;

        if (responseObject.stat === "fail") {
          reject(new RtmApiFailure(responseObject));
        } else {
          accept(responseObject);
        }
      }
      reject(
        new Error(
          "rtm.js callback returned an invalid response! (both arguments were undefined)",
        ),
      );
    });
  });
};
