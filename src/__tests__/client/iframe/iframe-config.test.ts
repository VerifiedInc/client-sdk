import { IframeConfig } from '@sdk/client/iframe/iframe-config';
import { EventSource } from '@sdk/values';

describe('IframeConfig', () => {
  it('should initialize with production environment by default', () => {
    // Arrange
    const sessionKey = 'test-session-key';

    // Act
    const config = new IframeConfig(sessionKey);

    // Assert
    expect(config.origin).toBe('https://1-click.verified.inc');
    expect(config.eventSource).toBe(EventSource);
    expect(config.url.toString()).toBe(
      'https://1-click.verified.inc/sdk/client?sessionKey=test-session-key'
    );
  });

  it('should initialize with development environment', () => {
    // Arrange
    const sessionKey = 'test-session-key';
    const environment = 'development';

    // Act
    const config = new IframeConfig(sessionKey, environment);

    // Assert
    expect(config.origin).toBe('https://1-click.dev-verifiedinc.com');
    expect(config.url.toString()).toBe(
      'https://1-click.dev-verifiedinc.com/sdk/client?sessionKey=test-session-key'
    );
  });

  it('should initialize with staging environment', () => {
    // Arrange
    const sessionKey = 'test-session-key';
    const environment = 'staging';

    // Act
    const config = new IframeConfig(sessionKey, environment);

    // Assert
    expect(config.origin).toBe('https://1-click.staging-verifiedinc.com');
    expect(config.url.toString()).toBe(
      'https://1-click.staging-verifiedinc.com/sdk/client?sessionKey=test-session-key'
    );
  });

  it('should initialize with sandbox environment', () => {
    // Arrange
    const sessionKey = 'test-session-key';
    const environment = 'sandbox';

    // Act
    const config = new IframeConfig(sessionKey, environment);

    // Assert
    expect(config.origin).toBe('https://1-click.sandbox-verifiedinc.com');
    expect(config.url.toString()).toBe(
      'https://1-click.sandbox-verifiedinc.com/sdk/client?sessionKey=test-session-key'
    );
  });

  it('should initialize with local environment', () => {
    // Arrange
    const sessionKey = 'test-session-key';
    const environment = 'local';

    // Act
    const config = new IframeConfig(sessionKey, environment);

    // Assert
    expect(config.origin).toBe('http://localhost:3070');
    expect(config.url.toString()).toBe(
      'http://localhost:3070/sdk/client?sessionKey=test-session-key'
    );
  });

  it('should default to production for unknown environment', () => {
    // Arrange
    const sessionKey = 'test-session-key';
    const environment = 'unknown';

    // Act
    const config = new IframeConfig(sessionKey, environment as any);

    // Assert
    expect(config.origin).toBe('https://1-click.verified.inc');
    expect(config.url.toString()).toBe(
      'https://1-click.verified.inc/sdk/client?sessionKey=test-session-key'
    );
  });
});
