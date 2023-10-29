declare module "rtm-js" {
  interface GetOptions {}
  const RememberTheMilk: new (
    apiKey: string,
    apiSecret: string,
    permissions: string,
  ) => RememberTheMilkApi;
  export = RememberTheMilk;
  interface RememberTheMilkApi {
    get: (
      method: string,
      options: GetOptions,
      response: (response: unknown, error: Error) => void,
    ) => void;
  }
}
