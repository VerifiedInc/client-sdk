import { ClientError } from '@sdk/errors';

describe('ClientError', () => {
  it('should initialize with correct message', () => {
    // Arrange
    const errorMessage = 'Test error message';

    // Act
    const error = new ClientError(errorMessage);

    // Assert
    expect(error.message).toBe(errorMessage);
  });

  it('should have correct name', () => {
    // Arrange
    const errorMessage = 'Test error message';

    // Act
    const error = new ClientError(errorMessage);

    // Assert
    expect(error.name).toBe('ClientError');
  });

  it('should be instance of Error', () => {
    // Arrange
    const errorMessage = 'Test error message';

    // Act
    const error = new ClientError(errorMessage);

    // Assert
    expect(error).toBeInstanceOf(Error);
  });
});
