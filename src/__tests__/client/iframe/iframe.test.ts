import { Iframe } from '@sdk/client/iframe/iframe';
import { IframeConfig } from '@sdk/client/iframe/iframe-config';
import { Loader } from '@sdk/client/loader/loader';

// Mock dependencies
jest.mock('@sdk/client/iframe/iframe-config');
jest.mock('@sdk/client/loader/loader');

describe('Iframe', () => {
  let mockIframeConfig: jest.Mocked<IframeConfig>;
  let mockLoader: jest.Mocked<Loader>;

  beforeEach(() => {
    // Setup mocks
    mockIframeConfig = {
      url: new URL('https://example.com'),
    } as unknown as jest.Mocked<IframeConfig>;

    mockLoader = {
      make: jest.fn(),
      dispose: jest.fn(),
    } as unknown as jest.Mocked<Loader>;

    (Loader as jest.Mock).mockImplementation(() => mockLoader);

    // Mock document methods
    document.createElement = jest.fn().mockImplementation((tagName) => {
      if (tagName === 'div') {
        return {
          classList: {
            add: jest.fn(),
          },
          style: {
            cssText: '',
          },
          appendChild: jest.fn(),
        } as unknown as HTMLDivElement;
      } else if (tagName === 'iframe') {
        return {
          src: '',
          setAttribute: jest.fn(),
          addEventListener: jest.fn(),
        } as unknown as HTMLIFrameElement;
      }
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize correctly', () => {
    // Act
    const iframe = new Iframe(mockIframeConfig);

    // Assert
    expect(iframe.element).toBeNull();
    expect(iframe.loader).toBeNull();
  });

  it('should create iframe element when make is called', () => {
    // Arrange
    const iframe = new Iframe(mockIframeConfig);
    const mockParent = {
      appendChild: jest.fn(),
    } as unknown as HTMLElement;

    // Act
    const result = iframe.make(mockParent);

    // Assert
    expect(document.createElement).toHaveBeenCalledWith('div');
    expect(document.createElement).toHaveBeenCalledWith('iframe');
    expect(mockLoader.make).toHaveBeenCalled();
    expect(mockParent.appendChild).toHaveBeenCalled();
    expect(iframe.element).not.toBeNull();
    expect(result).toBe(iframe.element);
  });

  it('should set iframe attributes correctly', () => {
    // Arrange
    const iframe = new Iframe(mockIframeConfig);
    const mockParent = {
      appendChild: jest.fn(),
    } as unknown as HTMLElement;

    const mockIframeElement = {
      src: '',
      setAttribute: jest.fn(),
      addEventListener: jest.fn(),
    } as unknown as HTMLIFrameElement;

    (document.createElement as jest.Mock).mockImplementation((tagName) => {
      if (tagName === 'div') {
        return {
          classList: { add: jest.fn() },
          style: { cssText: '' },
          appendChild: jest.fn(),
        } as unknown as HTMLDivElement;
      } else if (tagName === 'iframe') {
        return mockIframeElement;
      }
    });

    // Act
    iframe.make(mockParent);

    // Assert
    expect(mockIframeElement.src).toBe(mockIframeConfig.url.toString());
    expect(mockIframeElement.setAttribute).toHaveBeenCalledWith('title', 'Client SDK Iframe');
    expect(mockIframeElement.setAttribute).toHaveBeenCalledWith('security', 'restricted');
    expect(mockIframeElement.setAttribute).toHaveBeenCalledWith('loading', 'eager');
    expect(mockIframeElement.setAttribute).toHaveBeenCalledWith('referrerpolicy', 'no-referrer');
    expect(mockIframeElement.addEventListener).toHaveBeenCalledWith('load', expect.any(Function));
  });

  it('should dispose iframe correctly when parentElement exists', () => {
    // Arrange
    const iframe = new Iframe(mockIframeConfig);
    const mockParentElement = {
      remove: jest.fn(),
    };

    iframe.element = {
      parentElement: mockParentElement,
    } as unknown as HTMLIFrameElement;

    iframe.loader = mockLoader;

    // Act
    iframe.dispose();

    // Assert
    expect(mockParentElement.remove).toHaveBeenCalled();
    expect(mockLoader.dispose).toHaveBeenCalled();
    expect(iframe.element).toBeNull();
    expect(iframe.loader).toBeNull();
  });

  it('should dispose iframe correctly when parentElement is null', () => {
    // Arrange
    const iframe = new Iframe(mockIframeConfig);

    // Set element with null parentElement to test the condition
    iframe.element = {
      parentElement: null,
    } as unknown as HTMLIFrameElement;

    iframe.loader = mockLoader;

    // Act
    iframe.dispose();

    // Assert
    expect(mockLoader.dispose).toHaveBeenCalled();
    expect(iframe.element).toBeNull();
    expect(iframe.loader).toBeNull();
  });

  it('should handle iframe load event', () => {
    // Arrange
    const iframe = new Iframe(mockIframeConfig);
    const mockParent = {
      appendChild: jest.fn(),
    } as unknown as HTMLElement;

    let loadCallback: Function = () => {};

    const mockIframeElement = {
      src: '',
      setAttribute: jest.fn(),
      addEventListener: jest.fn().mockImplementation((event, callback) => {
        if (event === 'load') {
          loadCallback = callback;
        }
      }),
    } as unknown as HTMLIFrameElement;

    (document.createElement as jest.Mock).mockImplementation((tagName) => {
      if (tagName === 'div') {
        return {
          classList: { add: jest.fn() },
          style: { cssText: '' },
          appendChild: jest.fn(),
        } as unknown as HTMLDivElement;
      } else if (tagName === 'iframe') {
        return mockIframeElement;
      }
    });

    // Act
    iframe.make(mockParent);
    loadCallback();

    // Assert
    expect(mockLoader.dispose).toHaveBeenCalled();
  });
});
