export class IframeConfig {
  public readonly origin = "http://localhost:3070";
  public readonly eventSource = "Verified.Client";
  public readonly url: URL;

  constructor(publicKey: string) {
    this.url = new URL(this.origin);
    this.url.pathname = `/sdk/client`;
    this.url.searchParams.append("publicKey", publicKey);
  }
}
