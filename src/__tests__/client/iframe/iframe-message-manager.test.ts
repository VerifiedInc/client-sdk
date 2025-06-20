import { IframeMessageManager } from '@sdk/client/iframe/iframe-message-manager';
import { Iframe } from '@sdk/client/iframe/iframe';
import { IframeConfig } from '@sdk/client/iframe/iframe-config';
import { ErrorLogger } from '@sdk/client/logger/error-logger';
import { parseMessageEvent } from '@sdk/client/utils/parse-message-event';
import { EventSource } from '@sdk/values';

// Mock dependencies
jest.mock('@sdk/client/logger/error-logger');
jest.mock('@sdk/client/utils/parse-message-event');

describe('IframeMessageManager', () => {
  let mockIframe: jest.Mocked<Iframe>;
  let mockIframeConfig: jest.Mocked<IframeConfig>;
  let mockOnMessage: jest.Mock;
  let messageManager: IframeMessageManager;
  let mockErrorLogger: jest.Mocked<ErrorLogger>;

  beforeEach(() => {
    // Setup mocks
    mockIframe = {
      element: {
        contentWindow: {} as Window,
      } as HTMLIFrameElement,
    } as jest.Mocked<Iframe>;

    mockIframeConfig = {
      origin: 'https://example.com',
      eventSource: EventSource,
    } as jest.Mocked<IframeConfig>;

    mockOnMessage = jest.fn();

    mockErrorLogger = {
      log: jest.fn(),
    } as unknown as jest.Mocked<ErrorLogger>;

    (ErrorLogger as jest.Mock).mockImplementation(() => mockErrorLogger);

    // Mock window event listeners
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();

    messageManager = new IframeMessageManager({
      iframe: mockIframe,
      iframeConfig: mockIframeConfig,
      onMessage: mockOnMessage,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize correctly', () => {
    // Assert
    expect(ErrorLogger).toHaveBeenCalled();
  });

  it('should add message event listener', () => {
    // Act
    messageManager.addListener();

    // Assert
    expect(window.addEventListener).toHaveBeenCalledWith('message', expect.any(Function));
  });

  it('should remove message event listener', () => {
    // Act
    messageManager.removeListener();

    // Assert
    expect(window.removeEventListener).toHaveBeenCalledWith('message', expect.any(Function));
  });

  it('should handle valid message event', () => {
    // Arrange
    const mockData = { type: 'test-event' };
    const mockEvent = {
      origin: 'https://example.com',
      source: mockIframe.element?.contentWindow,
      data: {
        source: EventSource,
        timestamp: new Date().toISOString(),
      },
    } as MessageEvent;

    (parseMessageEvent as jest.Mock).mockReturnValue(mockData);

    // Get the handleMessage function
    jest.spyOn(messageManager, 'addListener');
    messageManager.addListener();
    const handleMessage = (window.addEventListener as jest.Mock).mock.calls[0][1];

    // Act
    handleMessage(mockEvent);

    // Assert
    expect(parseMessageEvent).toHaveBeenCalledWith(mockEvent);
    expect(mockOnMessage).toHaveBeenCalledWith(mockData, mockEvent);
  });

  it('should not handle message with invalid data', () => {
    // Arrange
    (parseMessageEvent as jest.Mock).mockReturnValue(null);

    // Get the handleMessage function
    messageManager.addListener();
    const handleMessage = (window.addEventListener as jest.Mock).mock.calls[0][1];

    const mockEvent = {} as MessageEvent;

    // Act
    handleMessage(mockEvent);

    // Assert
    expect(parseMessageEvent).toHaveBeenCalledWith(mockEvent);
    expect(mockOnMessage).not.toHaveBeenCalled();
  });

  it('should not handle message from invalid origin', () => {
    // Arrange
    const mockData = { type: 'test-event' };
    const mockEvent = {
      origin: 'https://invalid-origin.com',
      source: mockIframe.element?.contentWindow,
      data: {
        source: EventSource,
        timestamp: new Date().toISOString(),
      },
    } as MessageEvent;

    (parseMessageEvent as jest.Mock).mockReturnValue(mockData);

    // Get the handleMessage function
    messageManager.addListener();
    const handleMessage = (window.addEventListener as jest.Mock).mock.calls[0][1];

    // Act
    handleMessage(mockEvent);

    // Assert
    expect(parseMessageEvent).toHaveBeenCalledWith(mockEvent);
    expect(mockErrorLogger.log).toHaveBeenCalledWith('Event sent from an invalid origin');
    expect(mockOnMessage).not.toHaveBeenCalled();
  });

  it('should not handle message from invalid source', () => {
    // Arrange
    const mockData = { type: 'test-event' };
    const mockEvent = {
      origin: 'https://example.com',
      source: {},
      data: {
        source: EventSource,
        timestamp: new Date().toISOString(),
      },
    } as MessageEvent;

    (parseMessageEvent as jest.Mock).mockReturnValue(mockData);

    // Get the handleMessage function
    messageManager.addListener();
    const handleMessage = (window.addEventListener as jest.Mock).mock.calls[0][1];

    // Act
    handleMessage(mockEvent);

    // Assert
    expect(parseMessageEvent).toHaveBeenCalledWith(mockEvent);
    expect(mockErrorLogger.log).toHaveBeenCalledWith('Event sent from an invalid origin');
    expect(mockOnMessage).not.toHaveBeenCalled();
  });

  it('should not handle message with invalid event source', () => {
    // Arrange
    const mockData = { type: 'test-event' };
    const mockEvent = {
      origin: 'https://example.com',
      source: mockIframe.element?.contentWindow,
      data: {
        source: 'invalid-source',
        timestamp: new Date().toISOString(),
      },
    } as MessageEvent;

    (parseMessageEvent as jest.Mock).mockReturnValue(mockData);

    // Get the handleMessage function
    messageManager.addListener();
    const handleMessage = (window.addEventListener as jest.Mock).mock.calls[0][1];

    // Act
    handleMessage(mockEvent);

    // Assert
    expect(parseMessageEvent).toHaveBeenCalledWith(mockEvent);
    expect(mockOnMessage).not.toHaveBeenCalled();
  });

  it('should not handle message with old timestamp', () => {
    // Arrange
    const mockData = { type: 'test-event' };
    const oldTimestamp = new Date(Date.now() - 2000).toISOString(); // 2 seconds ago
    const mockEvent = {
      origin: 'https://example.com',
      source: mockIframe.element?.contentWindow,
      data: {
        source: EventSource,
        timestamp: oldTimestamp,
      },
    } as MessageEvent;

    (parseMessageEvent as jest.Mock).mockReturnValue(mockData);

    // Get the handleMessage function
    messageManager.addListener();
    const handleMessage = (window.addEventListener as jest.Mock).mock.calls[0][1];

    // Act
    handleMessage(mockEvent);

    // Assert
    expect(parseMessageEvent).toHaveBeenCalledWith(mockEvent);
    expect(mockOnMessage).not.toHaveBeenCalled();
  });
});
