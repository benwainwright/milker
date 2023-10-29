declare module "rtm-js" {
  export interface GetList {
    requestArgs: {
      list_id: string;
      filter: string;
      last_sync: string;
    };

    responseArgs: Record<string, never>;
  }

  export interface RtmFail {
    rsp: {
      stat: "fail";
      err: {
        code: number;
        msg: string;
      };
    };
  }

  interface ApiMapping {
    "rtm.tasks.getList": {
      requestArgs: {
        list_id?: string;
        filter?: string;
        last_sync?: string;
      };

      responseArgs: Record<string, string>;
    };
  }

  export interface RtmSuccess<M extends keyof ApiMapping> {
    rsp: {
      stat: "ok";
      api_key: string;
      callback: string;
    } & ApiMapping[M]["responseArgs"];
  }

  interface DefaultArgs {
    api_key: string;
    auth_token: string;
  }

  type RtmCallback<M extends keyof ApiMapping> = (
    response: RtmSuccess<M>,
    error: RtmFail | undefined,
  ) => void;

  type ApiOptions = <M extends keyof ApiMapping>(
    method: M,
    options: ApiMapping[M]["requestArgs"] & DefaultArgs,
    callback: RtmCallback<M>,
  ) => void;

  const RememberTheMilk: new (
    apiKey: string,
    apiSecret: string,
    permissions: string,
  ) => RememberTheMilkApi;
  export interface RememberTheMilkApi {
    get: ApiOptions;
  }
  export = RememberTheMilk;
}
