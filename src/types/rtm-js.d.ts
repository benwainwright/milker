declare module "rtm-js" {
  const RememberTheMilk: new (apiKey: string, apiSecret: string, permissions: string) => RememberTheMilkApi
  export = RememberTheMilk
  interface RememberTheMilkApi {}
}
