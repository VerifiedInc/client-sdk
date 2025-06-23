import { SdkErrorClass } from '@sdk/errors';
import { SdkErrorReasons } from '@sdk/values';

describe('SdkErrorClass', () => {
  it('should initialize with correct reason', () => {
    // Arrange
    const reason = 'INVALID_SESSION_KEY' as keyof typeof SdkErrorReasons;

    // Act
    const error = new SdkErrorClass(reason);

    // Assert
    expect(error.reason).toBe(reason);
  });

  it('should set message to reason value', () => {
    // Arrange
    const reason = 'INVALID_SESSION_KEY' as keyof typeof SdkErrorReasons;

    // Act
    const error = new SdkErrorClass(reason);

    // Assert
    expect(error.message).toBe(reason);
  });

  it('should be instance of Error', () => {
    // Arrange
    const reason = 'INVALID_SESSION_KEY' as keyof typeof SdkErrorReasons;

    // Act
    const error = new SdkErrorClass(reason);

    // Assert
    expect(error).toBeInstanceOf(Error);
  });

  it('should work with different error reasons', () => {
    // Test with different error reasons
    const reasons: (keyof typeof SdkErrorReasons)[] = [
      'INVALID_SESSION_KEY',
      'SESSION_TIMEOUT',
      'SHARE_CREDENTIALS_ERROR',
    ];

    reasons.forEach((reason) => {
      const error = new SdkErrorClass(reason);
      expect(error.reason).toBe(reason);
    });
  });
});
