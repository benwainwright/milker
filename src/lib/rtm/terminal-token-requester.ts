import RememberTheMilk from "rtm-js";
import { TokenRequester } from "../../types/storage";
import open from "open";
import prompts from "prompts";
import { rtmGetPromisified } from "./rtm-get-promisified";

export class TerminalTokenRequester implements TokenRequester {
  public async requestToken(apiKey: string, apiSecret: string, perms: string) {
    const client = new RememberTheMilk(apiKey, apiSecret, perms);

    const { frob } = await rtmGetPromisified(client, "rtm.auth.getFrob", {
      api_key: apiKey,
    });

    const url = client.getAuthUrl(frob);

    await open(url);

    await prompts({
      type: "text",
      name: "Frob",
      message: "Press enter to continue...",
    });

    const {
      auth: { token },
    } = await rtmGetPromisified(client, "rtm.auth.getToken", {
      frob,
      api_key: apiKey,
    });

    return token;
  }
}
