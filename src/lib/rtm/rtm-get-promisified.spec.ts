import { when } from "jest-when";
import { RememberTheMilkApi, RtmFail } from "rtm-js";
import { vi } from "vitest";
import { mock } from "vitest-mock-extended";
import { rtmGetPromisified } from "./rtm-get-promisified";
import { RtmApiFailure } from "./rtm-api-failure";

vi.mock("./rtm-api-failure");

beforeEach(() => {
  vi.resetAllMocks();
});

test("rtm get promisified resolves with a promise if there is a response", async () => {
  const apiKey = "key";
  const client = mock<RememberTheMilkApi>();

  const response = {
    rsp: {
      stat: "ok",
      frob: "foo",
      callback: "bar",
    },
  } satisfies { rsp: { stat: "ok"; frob: string; callback: string } };

  when(vi.mocked(client).get)
    .calledWith("rtm.auth.getFrob", { api_key: apiKey }, expect.anything())
    .mockImplementation((_method, _options, callback) => {
      callback(response, undefined);
    });

  const finalResponse = await rtmGetPromisified(client, "rtm.auth.getFrob", {
    api_key: apiKey,
  });

  expect(finalResponse).toEqual(response["rsp"]);
});

it("throws an error if the error handler is called", async () => {
  const apiKey = "key";
  const client = mock<RememberTheMilkApi>();

  const theError = new Error();

  when(vi.mocked(client).get)
    .calledWith("rtm.auth.getFrob", { api_key: apiKey }, expect.anything())
    .mockImplementation((_method, _options, callback) => {
      callback(undefined, theError);
    });

  await expect(
    rtmGetPromisified(client, "rtm.auth.getFrob", {
      api_key: apiKey,
    }),
  ).rejects.toThrow(theError);
});

it("throws an error if the request returns an error", async () => {
  const apiKey = "key";
  const client = mock<RememberTheMilkApi>();

  const response: RtmFail = {
    rsp: {
      stat: "fail",
      err: {
        code: 2,
        msg: "message",
      },
    },
  };

  const mockError = new Error("Foo!");

  when(vi.mocked(RtmApiFailure))
    .calledWith(response["rsp"])
    .mockReturnValue(mockError);

  when(vi.mocked(client).get)
    .calledWith("rtm.auth.getFrob", { api_key: apiKey }, expect.anything())
    .mockImplementation((_method, _options, callback) => {
      callback(response, undefined);
    });

  await expect(
    rtmGetPromisified(client, "rtm.auth.getFrob", {
      api_key: apiKey,
    }),
  ).rejects.toThrow(mockError);
});
