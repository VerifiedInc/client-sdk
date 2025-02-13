export class IframeConfig {
  public readonly origin = "http://localhost:5174";
  public readonly eventSource = "VerifiedInc.Client";
  public readonly url: URL;

  constructor(publicKey: string) {
    this.url = new URL(this.origin);
    this.url.searchParams.append("publicKey", publicKey);
  }
}
