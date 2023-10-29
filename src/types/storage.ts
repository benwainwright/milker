export interface AppStorage {
  get: (key: string) => Promise<string | undefined>;
  set: (key: string, value: string) => Promise<void>;
}

export interface TokenRequester {
  requestToken: (
    apiKey: string,
    apiSecret: string,
    perms: string,
  ) => Promise<string>;
}
