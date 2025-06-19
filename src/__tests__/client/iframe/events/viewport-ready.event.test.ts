import { ViewportReadyEvent } from '@sdk/client/iframe/events/viewport-ready.event';
import { Iframe } from '@sdk/client/iframe/iframe';

describe('ViewportReadyEvent', () => {
  let mockIframe: jest.Mocked<Iframe>;
  let viewportReadyEvent: ViewportReadyEvent;

  beforeEach(() => {
    // Setup mocks
    mockIframe = {
      element: {
        style: {
          display: '',
          height: '',
        },
      } as unknown as HTMLIFrameElement,
    } as jest.Mocked<Iframe>;

    viewportReadyEvent = new ViewportReadyEvent(mockIframe);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize correctly', () => {
    // Assert
    expect(viewportReadyEvent).toBeDefined();
  });

  it('should update iframe display and height when handle is called', () => {
    // Arrange
    const mockBoundingRect = {
      height: 500,
    } as DOMRect;

    // Act
    viewportReadyEvent.handle(mockBoundingRect);

    // Assert
    expect(mockIframe.element!.style.display).toBe('block');
    expect(mockIframe.element!.style.height).toBe('500px');
  });

  it('should not update iframe when iframe element is null', () => {
    // Arrange
    mockIframe.element = null;
    const mockBoundingRect = {
      height: 500,
    } as DOMRect;

    // Act
    viewportReadyEvent.handle(mockBoundingRect);

    // Assert - No error should be thrown
    expect(true).toBe(true);
  });
});
