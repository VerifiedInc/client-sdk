import { EventSource } from '@sdk/values';

export class IframeConfig {
  private readonly origins = {
    local: 'http://localhost:3070',
    development: 'https://1-click.dev-verifiedinc.com',
    staging: 'https://1-click.staging-verifiedinc.com',
    sandbox: 'https://1-click.sandbox-verifiedinc.com',
    production: 'https://1-click.verified.inc',
  };
  public readonly origin: string;
  public readonly eventSource = EventSource;
  public readonly url: URL;

  // Default environment to production for convention
  constructor(sessionKey: string, environment = 'production') {
    this.origin = this.origins[environment as keyof typeof this.origins] ?? this.origins.production;
    this.url = new URL(this.origin);
    this.url.pathname = `/sdk/client`;
    this.url.searchParams.append('sessionKey', sessionKey);
  }
}
