import RememberTheMilk, { RememberTheMilkApi, RtmSuccess } from "rtm-js";
import { AppStorage, TokenRequester } from "../../types/storage";

export const STORAGE_KEY = "milk-manager-token-storage";

export class RtmClient {
  private client: RememberTheMilkApi;
  constructor(
    private storage: AppStorage,
    private tokenRequester: TokenRequester,
    private apiKey: string,
    private apiSecret: string,
    perms: string,
  ) {
    this.client = new RememberTheMilk(apiKey, apiSecret, perms);
  }

  private async getToken(): Promise<string> {
    return await this.tokenRequester.requestToken(this.apiKey, this.apiSecret);
  }

  public async getAllTasks() {
    const token = await this.getToken();

    console.log(token, this.apiKey);

    return new Promise<RtmSuccess<"rtm.tasks.getList">>((accept, reject) => {
      this.client.get(
        "rtm.tasks.getList",
        { api_key: this.apiKey, auth_token: token },
        (response, error) => {
          console.log("CALLED");
          if (error) {
            reject(error);
          } else {
            accept(response);
          }
        },
      );
    });
  }
}

// If no token -
// - call tokenRequester
// - then store token
//
// If token in storage
// - use it
