export class Requester {
  constructor(
    private key: string,
    private secret: string,
    private permissions: string,
  ) {}

  private request(
    verb: string,
    method: string,
    params: Record<string, string>,
  ) {}

  public get(method: string, params: Record<string, string>) {}
}
