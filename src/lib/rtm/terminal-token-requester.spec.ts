import { mock } from "vitest-mock-extended";
import { TerminalTokenRequester } from "./terminal-token-requester";
import RememberTheMilk, { RememberTheMilkApi } from "rtm-js";
import { when } from "jest-when";
import { vi } from "vitest";
import open from "open";
import prompts from "prompts";

vi.mock("rtm-js");
vi.mock("open");
vi.mock("prompts");

beforeEach(() => {
  vi.resetAllMocks();
});

test("terminal token requester calls open, waits for user input, and then returns the token provided by user input", async () => {
  const requester = new TerminalTokenRequester();

  const mockRtmJs = mock<RememberTheMilkApi>();

  const apiKey = "key";
  const apiSecret = "secret";
  const perms = "delete";

  const token = "my-token";
  const myFrob = "my-frob";

  when(vi.mocked(RememberTheMilk))
    .calledWith(apiKey, apiSecret, perms)
    .mockReturnValue(mockRtmJs);

  const authUrl = "https://www.google.com";

  vi.mocked(mockRtmJs.getAuthUrl).calledWith(myFrob).mockReturnValue(authUrl);
  vi.mocked(open).mockResolvedValue(mock());

  vi.mocked(mockRtmJs.getAuthUrl).mockReturnValue(authUrl);
  when(vi.mocked(mockRtmJs).get)
    .calledWith("rtm.auth.getFrob", { api_key: apiKey }, expect.anything())
    .mockImplementation((_method, _options, callback) => {
      callback(
        {
          rsp: {
            stat: "ok",
            frob: myFrob,
            callback: "foo",
          },
        },
        undefined,
      );
    });

  when(vi.mocked(mockRtmJs).get)
    .calledWith(
      "rtm.auth.getToken",
      { api_key: apiKey, frob: myFrob },
      expect.anything(),
    )
    .mockImplementation((_method, _options, callback) => {
      callback(
        {
          rsp: {
            stat: "ok",
            auth: {
              token,
              perms: "delete",
              user: {
                id: "1",
                fullname: "Ben",
                username: "ben.wainwright",
              },
            },
            callback: "foo",
          },
        },
        undefined,
      );
    });

  when(vi.mocked(prompts))
    .calledWith({
      type: "text",
      name: "continue",
      message:
        "Press enter when you've authenticated via the RTM web interface",
    })
    .mockResolvedValue({ value: "whatever" });

  const actualToken = await requester.requestToken(apiKey, apiSecret, perms);

  expect(vi.mocked(open)).toHaveBeenCalledWith(authUrl);
  expect(actualToken).toEqual(token);
});
