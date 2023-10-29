import { vi } from "vitest";
import { AppStorage, TokenRequester } from "../../types/storage";
import { RtmClient, STORAGE_KEY } from "./client";
import { mock } from "vitest-mock-extended";
import { when } from "jest-when";
import RememberTheMilk, { RememberTheMilkApi, RtmTaskSeries } from "rtm-js";
import { TaskSeries } from "./task-series";

vi.mock("./task-series");
vi.mock("rtm-js");

beforeEach(() => {
  vi.resetAllMocks();
});

const setupMockResponse = () => {
  const rawSeriesOne = mock<RtmTaskSeries>();
  const seriesOne = mock<TaskSeries>();
  when(vi.mocked(TaskSeries))
    .calledWith(rawSeriesOne)
    .mockReturnValue(seriesOne);

  const rawSeriesTwo = mock<RtmTaskSeries>();
  const seriesTwo = mock<TaskSeries>();
  when(vi.mocked(TaskSeries))
    .calledWith(rawSeriesTwo)
    .mockReturnValue(seriesTwo);

  const rawSeriesThree = mock<RtmTaskSeries>();
  const seriesThree = mock<TaskSeries>();
  when(vi.mocked(TaskSeries))
    .calledWith(rawSeriesThree)
    .mockReturnValue(seriesThree);

  const rawSeriesFour = mock<RtmTaskSeries>();
  const seriesFour = mock<TaskSeries>();
  when(vi.mocked(TaskSeries))
    .calledWith(rawSeriesFour)
    .mockReturnValue(seriesFour);

  const rawSeriesFive = mock<RtmTaskSeries>();
  const seriesFive = mock<TaskSeries>();
  when(vi.mocked(TaskSeries))
    .calledWith(rawSeriesFive)
    .mockReturnValue(seriesFive);

  const rawSeriesSix = mock<RtmTaskSeries>();
  const seriesSix = mock<TaskSeries>();
  when(vi.mocked(TaskSeries))
    .calledWith(rawSeriesSix)
    .mockReturnValue(seriesSix);

  const response = {
    tasks: {
      list: [
        {
          id: "foo",
          taskseries: [rawSeriesOne, rawSeriesTwo, rawSeriesThree],
        },
        {
          id: "bar",
          taskseries: [rawSeriesFour],
        },
        {
          id: "baz",
          taskseries: [rawSeriesFive, rawSeriesSix],
        },
      ],
    },
  };

  const processedResponse = [
    seriesOne,
    seriesTwo,
    seriesThree,
    seriesFour,
    seriesFive,
    seriesSix,
  ];

  return { response, processedResponse };
};

test("stores token in storage if it doesn't already exist", async () => {
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

  when(tokenRequester.requestToken)
    .calledWith(apiKey, apiSecret, perms)
    .mockResolvedValue(token);

  when(storage.get).calledWith(STORAGE_KEY).mockResolvedValue(undefined);
  when(storage.set).calledWith(STORAGE_KEY, token).mockResolvedValue(undefined);

  const { response } = setupMockResponse();

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

  await client.getAllTasks();
});

test("If there is no token in storage, get it from the requester and send a request with the token attached, then return aggregated taskseries", async () => {
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

  when(storage.get).calledWith(STORAGE_KEY).mockResolvedValue(undefined);

  when(tokenRequester.requestToken)
    .calledWith(apiKey, apiSecret, perms)
    .mockResolvedValue(token);

  const { response, processedResponse } = setupMockResponse();

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

  expect(actualResponse).toEqual(processedResponse);
});

test("Does not call the token requester a second time", async () => {
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

  when(storage.get).calledWith(STORAGE_KEY).mockResolvedValue(undefined);
  when(storage.set).calledWith(STORAGE_KEY, token).mockResolvedValue(undefined);

  when(tokenRequester.requestToken)
    .calledWith(apiKey, apiSecret, perms)
    .mockResolvedValue(token);

  const { response } = setupMockResponse();

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

  await client.getAllTasks();
  await client.getAllTasks();
  expect(tokenRequester.requestToken).toHaveBeenCalledTimes(1);
});

test("retrieves token from storage if it exists in storage", async () => {
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

  when(storage.get).calledWith(STORAGE_KEY).mockResolvedValue(token);
  when(storage.set).calledWith(STORAGE_KEY, token).mockResolvedValue(undefined);

  const { response } = setupMockResponse();

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

  await client.getAllTasks();
  expect(tokenRequester.requestToken).not.toHaveBeenCalled();
});
