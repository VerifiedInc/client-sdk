import { ViewportResizeEvent } from '@sdk/client/iframe/events/viewport-resize.event';
import { Iframe } from '@sdk/client/iframe/iframe';

describe('ViewportResizeEvent', () => {
  let mockIframe: jest.Mocked<Iframe>;
  let viewportResizeEvent: ViewportResizeEvent;

  beforeEach(() => {
    // Setup mocks
    mockIframe = {
      element: {
        style: {
          height: '',
        },
      } as unknown as HTMLIFrameElement,
    } as jest.Mocked<Iframe>;

    viewportResizeEvent = new ViewportResizeEvent(mockIframe);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize correctly', () => {
    // Assert
    expect(viewportResizeEvent).toBeDefined();
  });

  it('should update iframe height when handle is called', () => {
    // Arrange
    const mockBoundingRect = {
      height: 500,
    } as DOMRect;

    // Act
    viewportResizeEvent.handle(mockBoundingRect);

    // Assert
    expect(mockIframe.element!.style.height).toBe('500px');
  });

  it('should not update iframe height when iframe element is null', () => {
    // Arrange
    mockIframe.element = null;
    const mockBoundingRect = {
      height: 500,
    } as DOMRect;

    // Act
    viewportResizeEvent.handle(mockBoundingRect);

    // Assert - No error should be thrown
    expect(true).toBe(true);
  });
});
