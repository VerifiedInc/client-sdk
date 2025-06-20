import { VerifiedClientSdk } from '@sdk/client';
import { SdkErrorReasons } from '@sdk/values';
import { Iframe } from '@sdk/client/iframe/iframe';
import { IframeConfig } from '@sdk/client/iframe/iframe-config';
import { IframeEventManager } from '@sdk/client/iframe/iframe-event-manager';
import { SdkResultValues } from '@sdk/values';
import { simulateWindowCheck } from './window-test-helper';

// Mock dependencies
jest.mock('@sdk/client/iframe/iframe');
jest.mock('@sdk/client/iframe/iframe-config');
jest.mock('@sdk/client/iframe/iframe-event-manager');

describe('VerifiedClientSdk', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with valid session key', () => {
    // Arrange
    const options = {
      sessionKey: 'valid-session-key',
      environment: 'local',
      onResult: jest.fn(),
      onError: jest.fn(),
    };

    // Act
    const client = new VerifiedClientSdk(options);

    // Assert
    expect(client.ready).toBe(true);
    expect(IframeConfig).toHaveBeenCalledWith(options.sessionKey, options.environment);
    expect(Iframe).toHaveBeenCalled();
    expect(IframeEventManager).toHaveBeenCalled();
    expect(options.onError).not.toHaveBeenCalled();
  });

  it('should handle invalid session key', () => {
    // Arrange
    const options = {
      sessionKey: '',
      environment: 'local',
      onResult: jest.fn(),
      onError: jest.fn(),
    };

    // Act
    const client = new VerifiedClientSdk(options);

    // Assert
    expect(client.ready).toBe(false);
    expect(options.onError).toHaveBeenCalledWith({ reason: SdkErrorReasons.INVALID_SESSION_KEY });
  });

  it('should show iframe when ready with provided element', () => {
    // Arrange
    const options = {
      sessionKey: 'valid-session-key',
      environment: 'local',
    };
    const client = new VerifiedClientSdk(options);
    const mockIframe = (Iframe as jest.Mock).mock.instances[0];
    mockIframe.element = null;

    // Mock document.body
    const mockElement = document.createElement('div');

    // Act
    client.show(mockElement);

    // Assert
    expect(mockIframe.make).toHaveBeenCalledWith(mockElement);
    expect((IframeEventManager as jest.Mock).mock.instances[0].addListener).toHaveBeenCalled();
  });

  it('should show iframe when ready with document.body when no element is provided', () => {
    // Arrange
    const options = {
      sessionKey: 'valid-session-key',
      environment: 'local',
    };
    const client = new VerifiedClientSdk(options);
    const mockIframe = (Iframe as jest.Mock).mock.instances[0];
    mockIframe.element = null;

    // Act
    client.show();

    // Assert
    expect(mockIframe.make).toHaveBeenCalledWith(document.body);
    expect((IframeEventManager as jest.Mock).mock.instances[0].addListener).toHaveBeenCalled();
  });

  it('should not show iframe when not ready', () => {
    // Arrange
    const options = {
      sessionKey: '',
      environment: 'local',
      onError: jest.fn(),
    };
    const client = new VerifiedClientSdk(options);
    const mockIframe = (Iframe as jest.Mock).mock.instances[0];

    // Act
    client.show();

    // Assert
    expect(mockIframe.make).not.toHaveBeenCalled();
    expect((IframeEventManager as jest.Mock).mock.instances[0].addListener).not.toHaveBeenCalled();
  });

  it('should destroy iframe when ready', () => {
    // Arrange
    const options = {
      sessionKey: 'valid-session-key',
      environment: 'local',
    };
    const client = new VerifiedClientSdk(options);
    const mockIframe = (Iframe as jest.Mock).mock.instances[0];
    const mockEventManager = (IframeEventManager as jest.Mock).mock.instances[0];

    // Act
    client.destroy();

    // Assert
    expect(mockEventManager.removeListener).toHaveBeenCalled();
    expect(mockIframe.dispose).toHaveBeenCalled();
  });

  it('should not destroy iframe when not ready', () => {
    // Arrange
    const options = {
      sessionKey: '',
      environment: 'local',
      onError: jest.fn(),
    };
    const client = new VerifiedClientSdk(options);
    const mockIframe = (Iframe as jest.Mock).mock.instances[0];
    const mockEventManager = (IframeEventManager as jest.Mock).mock.instances[0];

    // Act
    client.destroy();

    // Assert
    expect(mockEventManager.removeListener).not.toHaveBeenCalled();
    expect(mockIframe.dispose).not.toHaveBeenCalled();
  });

  it('should call default onResult if not provided and not resulted', () => {
    // Arrange
    // Create options without onResult
    const options = {
      sessionKey: 'valid-session-key',
      environment: 'local',
      // No onResult provided, so default will be used
    };

    // Act
    // Create client that will initialize IframeEventManager
    new VerifiedClientSdk(options);

    // Create a mock result
    const mockResult = { type: SdkResultValues.USER_OPTED_OUT };

    // Get the onResult handler that was passed to IframeEventManager
    const iframeEventManagerOptions = (IframeEventManager as jest.Mock).mock.calls[0][0];
    const onResultHandler = iframeEventManagerOptions.onResult;

    // Call the handler directly
    onResultHandler(mockResult);

    // Assert
    // Since we're testing the default handler (which is an empty function),
    // we just verify it doesn't throw an error when called
    expect(() => onResultHandler(mockResult)).not.toThrow();
  });

  it('should call default onError if not provided and not resulted', () => {
    // Arrange
    // Create options without onError
    const options = {
      sessionKey: 'valid-session-key',
      environment: 'local',
      // No onError provided, so default will be used
    };

    // Act
    // Create client that will initialize IframeEventManager
    new VerifiedClientSdk(options);

    // Create a mock error
    const mockError = { reason: SdkErrorReasons.INVALID_SESSION_KEY };

    // Get the onError handler that was passed to IframeEventManager
    const iframeEventManagerOptions = (IframeEventManager as jest.Mock).mock.calls[0][0];
    const onErrorHandler = iframeEventManagerOptions.onError;

    // Call the handler directly
    onErrorHandler(mockError);

    // Assert
    // Since we're testing the default handler (which is an empty function),
    // we just verify it doesn't throw an error when called
    expect(() => onErrorHandler(mockError)).not.toThrow();
  });

  it('should not call onResult if already resulted', () => {
    // Arrange
    const mockOnResult = jest.fn();

    // Create a client with a custom onResult handler
    new VerifiedClientSdk({
      sessionKey: 'test-key',
      onResult: mockOnResult,
    });

    // Create a mock result
    const mockResult = { type: SdkResultValues.USER_OPTED_OUT };

    // Act - Mock the behavior by directly calling the handler that would be called by iframeEventManager
    // We need to get the handler function that was passed to IframeEventManager
    const iframeEventManagerOptions = (IframeEventManager as jest.Mock).mock.calls[0][0];
    const onResultHandler = iframeEventManagerOptions.onResult;

    // Call the handler directly
    onResultHandler(mockResult);
    onResultHandler(mockResult);

    // Assert
    expect(mockOnResult).toHaveBeenCalledTimes(1);
  });
});

describe('VerifiedClientSdk Global Namespace', () => {
  beforeEach(() => {
    // Clear the module cache to ensure fresh imports
    jest.resetModules();

    // Restore window if it was deleted
    if (!global.window) {
      global.window = {} as Window & typeof globalThis;
    }
  });

  it('should attach Client to existing Verified namespace on window', () => {
    // Arrange
    // Set up a mock Verified namespace on window with a test property
    global.window.Verified = { Client: VerifiedClientSdk };

    // Act
    // Import the module to trigger the code that attaches to window
    const VerifiedModule = require('@sdk/client');

    // Assert
    expect(global.window.Verified.Client).toBe(VerifiedModule.VerifiedClientSdk);
  });
});
