export interface AppStorage {
  get: (key: string) => string | undefined;
  set: (key: string) => void;
}

export interface TokenRequester {
  requestToken: (apiKey: string, apiSecret: string) => Promise<string>;
}
