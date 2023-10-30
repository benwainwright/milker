import RememberTheMilk, { RememberTheMilkApi } from "rtm-js";
import { AppStorage, TokenRequester } from "../../types/storage";
import { rtmGetPromisified } from "./rtm-get-promisified";
import { TaskSeries } from "./task-series";
import { Task } from "./task";

export const STORAGE_KEY = "milk-manager-token-storage";

export class RtmClient {
  private client: RememberTheMilkApi;
  private token: string | undefined;
  constructor(
    private storage: AppStorage,
    private tokenRequester: TokenRequester,
    private apiKey: string,
    private apiSecret: string,
    private perms: string,
  ) {
    this.client = new RememberTheMilk(apiKey, apiSecret, perms);
  }

  private async getAndStoreToken(): Promise<string> {
    if (!this.token) {
      const storedToken = await this.storage.get(STORAGE_KEY);

      this.token =
        storedToken ??
        (await this.tokenRequester.requestToken(
          this.apiKey,
          this.apiSecret,
          this.perms,
        ));

      if (!storedToken) {
        await this.storage.set(STORAGE_KEY, this.token);
      }
    }
    return this.token;
  }

  public async getAllTasks() {
    const token = await this.getAndStoreToken();

    const {
      tasks: { list },
    } = await rtmGetPromisified(this.client, "rtm.tasks.getList", {
      api_key: this.apiKey,
      auth_token: token,
    });

    const allTasks = new Map<string, TaskSeries>();

    list
      .filter((theList) => Boolean(theList.taskseries))
      .flatMap((theList) => theList.taskseries)
      .map((rawTaskSeries) => new TaskSeries(rawTaskSeries))
      .forEach((task) => allTasks.set(task.id, task));

    return Array.from(allTasks.values());
  }
}
