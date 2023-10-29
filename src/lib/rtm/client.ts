import RememberTheMilk, { RememberTheMilkApi, RtmSuccess } from "rtm-js";
import { AppStorage, TokenRequester } from "../../types/storage";
import { rtmGetPromisified } from "./rtm-get-promisified";
import { TaskSeries } from "./task-series";

export const STORAGE_KEY = "milk-manager-token-storage";

export class RtmClient {
  private client: RememberTheMilkApi;
  constructor(
    private storage: AppStorage,
    private tokenRequester: TokenRequester,
    private apiKey: string,
    private apiSecret: string,
    private perms: string,
  ) {
    this.client = new RememberTheMilk(apiKey, apiSecret, perms);
  }

  private async getToken(): Promise<string> {
    return await this.tokenRequester.requestToken(
      this.apiKey,
      this.apiSecret,
      this.perms,
    );
  }

  public async getAllTasks() {
    const token = await this.getToken();

    const {
      rsp: {
        tasks: { list },
      },
    } = await rtmGetPromisified(this.client, "rtm.tasks.getList", {
      api_key: this.apiKey,
      auth_token: token,
    });

    return list
      .flatMap((theList) => theList.taskseries)
      .map((rawTaskSeries) => new TaskSeries(rawTaskSeries));
  }
}
