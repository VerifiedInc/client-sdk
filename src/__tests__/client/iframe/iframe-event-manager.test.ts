import {
  IframeEventManager,
  IframeEventManagerOptions,
} from '@sdk/client/iframe/iframe-event-manager';

// We'll test validation through the public interface
import { Iframe } from '@sdk/client/iframe/iframe';
import { IframeConfig } from '@sdk/client/iframe/iframe-config';
import { IframeMessageManager } from '@sdk/client/iframe/iframe-message-manager';
import { PossibleEventTypes, SdkErrorReasons, SdkResultValues, EventSource } from '@sdk/values';
import { ClientMessageEvent } from '@sdk/types';
import { ViewportReadyEvent } from '@sdk/client/iframe/events/viewport-ready.event';
import { ViewportResizeEvent } from '@sdk/client/iframe/events/viewport-resize.event';

// Mock dependencies
jest.mock('@sdk/client/iframe/iframe');
jest.mock('@sdk/client/iframe/iframe-config');
jest.mock('@sdk/client/iframe/iframe-message-manager');
jest.mock('@sdk/client/iframe/events/viewport-ready.event');
jest.mock('@sdk/client/iframe/events/viewport-resize.event');

describe('IframeEventManager', () => {
  let mockIframe: jest.Mocked<Iframe>;
  let mockIframeConfig: jest.Mocked<IframeConfig>;
  let mockIframeMessageManager: jest.Mocked<IframeMessageManager>;
  let mockOnResult: jest.Mock;
  let mockOnError: jest.Mock;
  let options: IframeEventManagerOptions;
  let eventManager: IframeEventManager;

  beforeEach(() => {
    // Setup mocks
    mockIframe = {} as jest.Mocked<Iframe>;
    mockIframeConfig = {
      getOrigin: jest.fn().mockReturnValue('https://example.com'),
    } as unknown as jest.Mocked<IframeConfig>;
    mockIframeMessageManager = {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    } as unknown as jest.Mocked<IframeMessageManager>;

    (IframeMessageManager as jest.Mock).mockImplementation(() => mockIframeMessageManager);

    mockOnResult = jest.fn();
    mockOnError = jest.fn();

    options = {
      iframe: mockIframe,
      iframeConfig: mockIframeConfig,
      onResult: mockOnResult,
      onError: mockOnError,
    };

    eventManager = new IframeEventManager(options);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize correctly', () => {
    // Assert
    expect(IframeMessageManager).toHaveBeenCalledWith({
      iframe: mockIframe,
      iframeConfig: mockIframeConfig,
      onMessage: expect.any(Function),
    });
  });

  it('should add listener', () => {
    // Act
    eventManager.addListener();

    // Assert
    expect(mockIframeMessageManager.addListener).toHaveBeenCalled();
  });

  it('should remove listener', () => {
    // Act
    eventManager.removeListener();

    // Assert
    expect(mockIframeMessageManager.removeListener).toHaveBeenCalled();
  });

  it('should handle viewport ready event', () => {
    // Arrange
    const mockHandleMessage = (IframeMessageManager as jest.Mock).mock.calls[0][0].onMessage;
    const mockEvent = {
      type: PossibleEventTypes.VERIFIED_CLIENT_SDK_VIEWPORT_READY,
      data: { width: 100, height: 200 },
    } as unknown as ClientMessageEvent;

    const mockViewportReadyInstance = { handle: jest.fn() };
    (ViewportReadyEvent as jest.Mock).mockImplementation(() => mockViewportReadyInstance);

    // Act
    mockHandleMessage(mockEvent);

    // Assert
    expect(ViewportReadyEvent).toHaveBeenCalledWith(mockIframe);
    expect(mockViewportReadyInstance.handle).toHaveBeenCalledWith(mockEvent.data);
  });

  it('should handle viewport resize event', () => {
    // Arrange
    const mockHandleMessage = (IframeMessageManager as jest.Mock).mock.calls[0][0].onMessage;
    const mockEvent = {
      type: PossibleEventTypes.VERIFIED_CLIENT_SDK_VIEWPORT_RESIZE,
      data: { width: 100, height: 200 },
    } as unknown as ClientMessageEvent;

    const mockViewportResizeInstance = { handle: jest.fn() };
    (ViewportResizeEvent as jest.Mock).mockImplementation(() => mockViewportResizeInstance);

    // Act
    mockHandleMessage(mockEvent);

    // Assert
    expect(ViewportResizeEvent).toHaveBeenCalledWith(mockIframe);
    expect(mockViewportResizeInstance.handle).toHaveBeenCalledWith(mockEvent.data);
  });

  it('should handle user opted out event', () => {
    // Arrange
    const mockHandleMessage = (IframeMessageManager as jest.Mock).mock.calls[0][0].onMessage;
    const mockEvent = {
      type: PossibleEventTypes.VERIFIED_CLIENT_SDK_USER_OPTED_OUT,
      data: {
        redirectUrl: 'https://example.com',
        identityUuid: '123',
        birthDate: '1990-01-01',
        phone: '1234567890',
        ssn4: '1234',
      },
    } as unknown as ClientMessageEvent;

    // Act
    mockHandleMessage(mockEvent);

    // Assert
    expect(mockOnResult).toHaveBeenCalledWith({
      type: SdkResultValues.USER_OPTED_OUT,
      redirectUrl: 'https://example.com',
      identityUuid: '123',
      birthDate: '1990-01-01',
      phone: '1234567890',
      ssn4: '1234',
    });
  });

  it('should handle form submission event', () => {
    // Arrange
    const mockHandleMessage = (IframeMessageManager as jest.Mock).mock.calls[0][0].onMessage;
    const mockEvent = {
      type: PossibleEventTypes.VERIFIED_CLIENT_SDK_FORM_SUBMISSION,
      data: {
        redirectUrl: 'https://example.com',
        identityUuid: '123',
        birthDate: '1990-01-01',
        phone: '1234567890',
        ssn4: '1234',
      },
    } as unknown as ClientMessageEvent;

    // Act
    mockHandleMessage(mockEvent);

    // Assert
    expect(mockOnResult).toHaveBeenCalledWith({
      type: SdkResultValues.USER_SHARED_CREDENTIALS,
      redirectUrl: 'https://example.com',
      identityUuid: '123',
      birthDate: '1990-01-01',
      phone: '1234567890',
      ssn4: '1234',
    });
  });

  it('should handle form submission error event', () => {
    // Arrange
    const mockHandleMessage = (IframeMessageManager as jest.Mock).mock.calls[0][0].onMessage;
    const mockEvent = {
      type: PossibleEventTypes.VERIFIED_CLIENT_SDK_FORM_SUBMISSION_ERROR,
    } as ClientMessageEvent;

    // Act
    mockHandleMessage(mockEvent);

    // Assert
    expect(mockOnError).toHaveBeenCalledWith({ reason: SdkErrorReasons.SHARE_CREDENTIALS_ERROR });
  });

  it('should handle invalid session key event', () => {
    // Arrange
    const mockHandleMessage = (IframeMessageManager as jest.Mock).mock.calls[0][0].onMessage;
    const mockEvent = {
      type: PossibleEventTypes.VERIFIED_CLIENT_SDK_INVALID_SESSION_KEY,
    } as ClientMessageEvent;

    // Act
    mockHandleMessage(mockEvent);

    // Assert
    expect(mockOnError).toHaveBeenCalledWith({ reason: SdkErrorReasons.INVALID_SESSION_KEY });
  });

  it('should handle session timeout event', () => {
    // Arrange
    const mockHandleMessage = (IframeMessageManager as jest.Mock).mock.calls[0][0].onMessage;
    const mockEvent = {
      type: PossibleEventTypes.VERIFIED_CLIENT_SDK_SESSION_TIMEOUT,
    } as ClientMessageEvent;

    // Act
    mockHandleMessage(mockEvent);

    // Assert
    expect(mockOnError).toHaveBeenCalledWith({ reason: SdkErrorReasons.SESSION_TIMEOUT });
  });

  // Tests for validation logic through the public interface
  describe('Message validation', () => {
    let onMessageHandler: (event: ClientMessageEvent) => void;

    beforeEach(() => {
      // Reset mocks
      jest.clearAllMocks();

      // Create a new instance with fresh mocks
      mockOnResult = jest.fn();
      mockOnError = jest.fn();

      options = {
        iframe: mockIframe,
        iframeConfig: mockIframeConfig,
        onResult: mockOnResult,
        onError: mockOnError,
      };

      // Capture the onMessage handler that will be passed to IframeMessageManager
      (IframeMessageManager as jest.Mock).mockImplementation(({ onMessage }) => {
        onMessageHandler = onMessage;
        return mockIframeMessageManager;
      });

      // Initialize with our mocks
      eventManager = new IframeEventManager(options);
    });

    it('should throw error for invalid message type', () => {
      // Arrange
      // Create a message with an invalid type to trigger the specific error
      const mockData: ClientMessageEvent = {
        // Use an invalid type that will trigger the 'Invalid message type' error
        type: 'INVALID_TYPE' as unknown as (typeof PossibleEventTypes)[keyof typeof PossibleEventTypes],
        data: {
          redirectUrl: 'https://example.com',
          identityUuid: 'test-uuid',
          birthDate: null,
          phone: null,
          ssn4: null,
        },
        source: EventSource,
        timestamp: Date.now(),
      };

      // Act & Assert
      expect(() => {
        // We need to directly call invariantMessageData to test this specific error
        // @ts-ignore - Accessing private method for testing
        eventManager.invariantMessageData(mockData);
      }).toThrow('Invalid message type');
    });

    it('should throw error for invalid message data (not an object)', () => {
      // Arrange
      const mockData: ClientMessageEvent = {
        type: PossibleEventTypes.VERIFIED_CLIENT_SDK_USER_OPTED_OUT,
        data: 'not an object' as unknown as Record<string, unknown>,
        source: EventSource,
        timestamp: Date.now(),
      };

      // Act & Assert
      expect(() => {
        // Call the handler that was captured during initialization
        onMessageHandler(mockData);
      }).toThrow('Invalid message data');
    });

    it('should throw error for invalid redirectUrl data', () => {
      // Arrange
      const mockData: ClientMessageEvent = {
        type: PossibleEventTypes.VERIFIED_CLIENT_SDK_USER_OPTED_OUT,
        data: {
          redirectUrl: 123, // Invalid type
          identityUuid: 'valid-uuid',
          birthDate: 'valid-date',
          phone: 'valid-phone',
          ssn4: 'valid-ssn',
        },
        source: EventSource,
        timestamp: Date.now(),
      };

      // Act & Assert
      expect(() => {
        // Call the handler that was captured during initialization
        onMessageHandler(mockData);
      }).toThrow('Invalid redirectUrl data');
    });

    it('should throw error for invalid identityUuid data', () => {
      // Arrange
      const mockData: ClientMessageEvent = {
        type: PossibleEventTypes.VERIFIED_CLIENT_SDK_USER_OPTED_OUT,
        data: {
          redirectUrl: 'https://example.com',
          identityUuid: 123, // Invalid type
          birthDate: 'valid-date',
          phone: 'valid-phone',
          ssn4: 'valid-ssn',
        },
        source: EventSource,
        timestamp: Date.now(),
      };

      // Act & Assert
      expect(() => {
        // Call the handler that was captured during initialization
        onMessageHandler(mockData);
      }).toThrow('Invalid identityUuid data');
    });

    it('should throw error for invalid birthDate data', () => {
      // Arrange
      const mockData: ClientMessageEvent = {
        type: PossibleEventTypes.VERIFIED_CLIENT_SDK_USER_OPTED_OUT,
        data: {
          redirectUrl: 'https://example.com',
          identityUuid: 'valid-uuid',
          birthDate: 123, // Invalid type
          phone: 'valid-phone',
          ssn4: 'valid-ssn',
        },
        source: EventSource,
        timestamp: Date.now(),
      };

      // Act & Assert
      expect(() => {
        // Call the handler that was captured during initialization
        onMessageHandler(mockData);
      }).toThrow('Invalid birthDate data');
    });

    it('should throw error for invalid phone data', () => {
      // Arrange
      const mockData: ClientMessageEvent = {
        type: PossibleEventTypes.VERIFIED_CLIENT_SDK_USER_OPTED_OUT,
        data: {
          redirectUrl: 'https://example.com',
          identityUuid: 'valid-uuid',
          birthDate: 'valid-date',
          phone: 123, // Invalid type
          ssn4: 'valid-ssn',
        },
        source: EventSource,
        timestamp: Date.now(),
      };

      // Act & Assert
      expect(() => {
        // Call the handler that was captured during initialization
        onMessageHandler(mockData);
      }).toThrow('Invalid phone data');
    });

    it('should throw error for invalid ssn4 data', () => {
      // Arrange
      const mockData: ClientMessageEvent = {
        type: PossibleEventTypes.VERIFIED_CLIENT_SDK_USER_OPTED_OUT,
        data: {
          redirectUrl: 'https://example.com',
          identityUuid: 'valid-uuid',
          birthDate: 'valid-date',
          phone: 'valid-phone',
          ssn4: 123, // Invalid type
        },
        source: EventSource,
        timestamp: Date.now(),
      };

      // Act & Assert
      expect(() => {
        // Call the handler that was captured during initialization
        onMessageHandler(mockData);
      }).toThrow('Invalid ssn4 data');
    });
  });
});
