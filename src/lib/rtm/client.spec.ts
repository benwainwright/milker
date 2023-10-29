import { vi } from "vitest";
import { AppStorage, TokenRequester } from "../../types/storage";
import { RtmClient, STORAGE_KEY } from "./client";
import { mock } from "vitest-mock-extended";
import { when } from "jest-when";
import RememberTheMilk, { RememberTheMilkApi } from "rtm-js";

vi.mock("rtm-js");

beforeEach(() => {
  vi.resetAllMocks();
});

test("If there is no token in storage, get it from the requester and send a request with the token attached", async () => {
  const storage = mock<AppStorage>();
  const tokenRequester = mock<TokenRequester>();
  const mockRtmJs = mock<RememberTheMilkApi>();

  const apiKey = "key";
  const apiSecret = "secret";
  const perms = "delete";

  const token = "my-token";

  when(vi.mocked(RememberTheMilk))
    .calledWith(apiKey, apiSecret, perms)
    .mockReturnValue(mockRtmJs);

  when(storage.get).calledWith(STORAGE_KEY).mockReturnValue(undefined);

  when(tokenRequester.requestToken)
    .calledWith(apiKey, apiSecret)
    .mockResolvedValue(token);

  const response = { foo: "bar" };

  const callback = vi.fn();

  when(vi.mocked(mockRtmJs).get)
    .calledWith(
      "rtm.tasks.getList",
      { api_key: apiKey, auth_token: token },
      expect.anything(),
    )
    .mockImplementation((_method, _options, callback) => {
      callback(
        {
          rsp: {
            stat: "ok",
            api_key: apiKey,
            callback: "foo",
            ...response,
          },
        },
        undefined,
      );
    });

  const client = new RtmClient(
    storage,
    tokenRequester,
    apiKey,
    apiSecret,
    perms,
  );

  const actualResponse = await client.getAllTasks();

  expect(actualResponse).toEqual(response);
});
