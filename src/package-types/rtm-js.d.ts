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

  interface RtmUser {
    id: string;
    username: string;
    fullname: string;
  }

  interface RtmTask {
    id: string;
    due: string;
    has_due_time: string;
    added: string;
    completed: string;
    deleted: string;
    priority: string;
    postponed: string;
    estimate: string;
  }

  export interface RtmTaskSeries {
    id: string;
    created: string;
    modified: string;
    name: string;
    source: string;
    url: string;
    location_id: string;
    tags: never[];
    participants: never[];
    notes: never[];
    task: RtmTask[];
  }

  interface RtmList {
    id: string;
    taskseries: RtmTaskSeries[];
  }

  export interface RtmApiMapping {
    "rtm.auth.getToken": {
      requestArgs: {
        frob: string;
      };
      responseArgs: {
        auth: {
          token: string;
          perms: string;
          user: RtmUser;
        };
      };
    };
    "rtm.auth.getFrob": {
      requestArgs: Record<string, string>;
      responseArgs: {
        frob: string;
      };
    };
    "rtm.tasks.getList": {
      requestArgs: {
        list_id?: string;
        filter?: string;
        last_sync?: string;
      };

      responseArgs: {
        tasks: {
          list: RtmList[];
        };
      };
    };
  }

  export interface RtmSuccess<M extends keyof RtmApiMapping> {
    rsp: {
      stat: "ok";
      api_key?: string;
      callback: string;
    } & RtmApiMapping[M]["responseArgs"];
  }

  export interface DefaultArgs {
    api_key: string;
    auth_token?: string;
  }

  type RtmCallback<M extends keyof RtmApiMapping> = (
    response: RtmSuccess<M>,
    error: RtmFail | undefined,
  ) => void;

  type ApiOptions = <M extends keyof RtmApiMapping>(
    method: M,
    options: RtmApiMapping[M]["requestArgs"] & DefaultArgs,
    callback: RtmCallback<M>,
  ) => void;

  const RememberTheMilk: new (
    apiKey: string,
    apiSecret: string,
    permissions: string,
  ) => RememberTheMilkApi;
  export interface RememberTheMilkApi {
    get: ApiOptions;
    getAuthUrl: (frob?: string) => string;
  }
  export = RememberTheMilk;
}
