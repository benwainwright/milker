import {
  DefaultArgs,
  RememberTheMilkApi,
  RtmApiMapping,
  RtmSuccess,
} from "rtm-js";

export const rtmGetPromisified = <M extends keyof RtmApiMapping>(
  client: RememberTheMilkApi,
  method: M,
  params: RtmApiMapping[M]["requestArgs"] & DefaultArgs,
) => {
  return new Promise<RtmSuccess<M>>((accept, reject) => {
    client.get(method, params, (response, error) => {
      if (error) {
        reject(error);
      } else {
        accept(response);
      }
    });
  });
};
