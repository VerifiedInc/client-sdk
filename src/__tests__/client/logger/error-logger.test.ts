import { ErrorLogger } from '@sdk/client/logger/error-logger';

describe('ErrorLogger', () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    // Store original console.error
    originalConsoleError = console.error;
    // Mock console.error
    console.error = jest.fn();
  });

  afterEach(() => {
    // Restore original console.error
    console.error = originalConsoleError;
  });

  it('should initialize correctly', () => {
    // Act
    const logger = new ErrorLogger();

    // Assert
    expect(logger).toBeDefined();
  });

  it('should log error message with correct prefix', () => {
    // Arrange
    const logger = new ErrorLogger();
    const message = 'Test error message';

    // Act
    logger.log(message);

    // Assert
    expect(console.error).toHaveBeenCalledWith('Verified Client SDK: ', message);
  });

  it('should log error message with additional parameters', () => {
    // Arrange
    const logger = new ErrorLogger();
    const message = 'Test error message';
    const param1 = { key: 'value' };
    const param2 = [1, 2, 3];

    // Act
    logger.log(message, param1, param2);

    // Assert
    expect(console.error).toHaveBeenCalledWith('Verified Client SDK: ', message, param1, param2);
  });
});
