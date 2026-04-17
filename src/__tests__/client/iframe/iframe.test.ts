import { Iframe } from '@sdk/client/iframe/iframe';
import { IframeConfig } from '@sdk/client/iframe/iframe-config';
import { Loader } from '@sdk/client/loader/loader';

// Mock dependencies
jest.mock('@sdk/client/iframe/iframe-config');
jest.mock('@sdk/client/loader/loader');

describe('Iframe', () => {
  let mockIframeConfig: jest.Mocked<IframeConfig>;
  let mockLoader: jest.Mocked<Loader>;
  let headAppendChildSpy: jest.SpyInstance;
  let querySelectorSpy: jest.SpyInstance;

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
          appendChild: jest.fn(),
        } as unknown as HTMLDivElement;
      } else if (tagName === 'iframe') {
        return {
          src: '',
          classList: { add: jest.fn() },
          setAttribute: jest.fn(),
          addEventListener: jest.fn(),
        } as unknown as HTMLIFrameElement;
      } else if (tagName === 'style') {
        return {
          setAttribute: jest.fn(),
          textContent: '',
          remove: jest.fn(),
        } as unknown as HTMLStyleElement;
      }
    });

    headAppendChildSpy = jest
      .spyOn(document.head, 'appendChild')
      .mockImplementation((node) => node);
    querySelectorSpy = jest.spyOn(document, 'querySelector').mockReturnValue(null);
  });

  afterEach(() => {
    jest.resetAllMocks();
    headAppendChildSpy.mockRestore();
    querySelectorSpy.mockRestore();
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
    expect(document.createElement).toHaveBeenCalledWith('style');
    expect(mockLoader.make).toHaveBeenCalled();
    expect(mockParent.appendChild).toHaveBeenCalled();
    expect(iframe.element).not.toBeNull();
    expect(result).toBe(iframe.element);
  });

  it('should inject style element into document head with CSP styles', () => {
    // Arrange
    const iframe = new Iframe(mockIframeConfig);
    const mockParent = { appendChild: jest.fn() } as unknown as HTMLElement;

    const mockStyleElement = {
      setAttribute: jest.fn(),
      textContent: '',
      remove: jest.fn(),
    } as unknown as HTMLStyleElement;

    (document.createElement as jest.Mock).mockImplementation((tagName) => {
      if (tagName === 'style') return mockStyleElement;
      if (tagName === 'div') return { classList: { add: jest.fn() }, appendChild: jest.fn() };
      if (tagName === 'iframe') {
        return {
          src: '',
          classList: { add: jest.fn() },
          setAttribute: jest.fn(),
          addEventListener: jest.fn(),
        };
      }
    });

    // Act
    iframe.make(mockParent);

    // Assert
    expect(mockStyleElement.textContent).toContain('.sdk-iframe-container');
    expect(mockStyleElement.textContent).toContain('.sdk-iframe');
    expect(headAppendChildSpy).toHaveBeenCalledWith(mockStyleElement);
  });

  it('should set CSP nonce on style element when meta tag is present', () => {
    // Arrange
    const iframe = new Iframe(mockIframeConfig);
    const mockParent = { appendChild: jest.fn() } as unknown as HTMLElement;

    const mockStyleElement = {
      setAttribute: jest.fn(),
      textContent: '',
      remove: jest.fn(),
    } as unknown as HTMLStyleElement;

    (document.createElement as jest.Mock).mockImplementation((tagName) => {
      if (tagName === 'style') return mockStyleElement;
      if (tagName === 'div') return { classList: { add: jest.fn() }, appendChild: jest.fn() };
      if (tagName === 'iframe') {
        return {
          src: '',
          classList: { add: jest.fn() },
          setAttribute: jest.fn(),
          addEventListener: jest.fn(),
        };
      }
    });

    querySelectorSpy.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue('test-nonce-123'),
    } as unknown as Element);

    // Act
    iframe.make(mockParent);

    // Assert
    expect(querySelectorSpy).toHaveBeenCalledWith('meta[property="csp-nonce"]');
    expect(mockStyleElement.setAttribute).toHaveBeenCalledWith('nonce', 'test-nonce-123');
  });

  it('should not set nonce when CSP meta tag is absent', () => {
    // Arrange
    const iframe = new Iframe(mockIframeConfig);
    const mockParent = { appendChild: jest.fn() } as unknown as HTMLElement;

    const mockStyleElement = {
      setAttribute: jest.fn(),
      textContent: '',
      remove: jest.fn(),
    } as unknown as HTMLStyleElement;

    (document.createElement as jest.Mock).mockImplementation((tagName) => {
      if (tagName === 'style') return mockStyleElement;
      if (tagName === 'div') return { classList: { add: jest.fn() }, appendChild: jest.fn() };
      if (tagName === 'iframe') {
        return {
          src: '',
          classList: { add: jest.fn() },
          setAttribute: jest.fn(),
          addEventListener: jest.fn(),
        };
      }
    });

    querySelectorSpy.mockReturnValue(null);

    // Act
    iframe.make(mockParent);

    // Assert
    expect(mockStyleElement.setAttribute).not.toHaveBeenCalledWith('nonce', expect.anything());
  });

  it('should set iframe attributes correctly', () => {
    // Arrange
    const iframe = new Iframe(mockIframeConfig);
    const mockParent = {
      appendChild: jest.fn(),
    } as unknown as HTMLElement;

    const mockIframeElement = {
      src: '',
      classList: { add: jest.fn() },
      setAttribute: jest.fn(),
      addEventListener: jest.fn(),
    } as unknown as HTMLIFrameElement;

    (document.createElement as jest.Mock).mockImplementation((tagName) => {
      if (tagName === 'div') {
        return {
          classList: { add: jest.fn() },
          appendChild: jest.fn(),
        } as unknown as HTMLDivElement;
      } else if (tagName === 'iframe') {
        return mockIframeElement;
      } else if (tagName === 'style') {
        return {
          setAttribute: jest.fn(),
          textContent: '',
          remove: jest.fn(),
        } as unknown as HTMLStyleElement;
      }
    });

    // Act
    iframe.make(mockParent);

    // Assert
    expect(mockIframeElement.src).toBe(mockIframeConfig.url.toString());
    expect(mockIframeElement.classList.add).toHaveBeenCalledWith('sdk-iframe');
    expect(mockIframeElement.setAttribute).toHaveBeenCalledWith('title', 'Client SDK Iframe');
    expect(mockIframeElement.setAttribute).toHaveBeenCalledWith('security', 'restricted');
    expect(mockIframeElement.setAttribute).toHaveBeenCalledWith('loading', 'eager');
    expect(mockIframeElement.setAttribute).toHaveBeenCalledWith('referrerpolicy', 'no-referrer');
    expect(mockIframeElement.setAttribute).toHaveBeenCalledWith('sandbox', expect.any(String));
    expect(mockIframeElement.setAttribute).not.toHaveBeenCalledWith('style', expect.any(String));
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

  it('should dispose iframe correctly when loader is null', () => {
    // Arrange
    const iframe = new Iframe(mockIframeConfig);

    // Create a mock for parentElement with a remove method
    const mockRemove = jest.fn();
    const mockParentElement = {
      remove: mockRemove,
    };

    // Set element with parentElement to test that branch
    iframe.element = {
      parentElement: mockParentElement,
    } as unknown as HTMLIFrameElement;

    // Explicitly set loader to null to test that branch
    iframe.loader = null;

    // Act
    iframe.dispose();

    // Assert
    expect(mockRemove).toHaveBeenCalled();
    expect(iframe.element).toBeNull();
    expect(iframe.loader).toBeNull();
  });

  it('should remove injected style element on dispose', () => {
    // Arrange
    const iframe = new Iframe(mockIframeConfig);
    const mockParent = { appendChild: jest.fn() } as unknown as HTMLElement;

    const mockStyleElement = {
      setAttribute: jest.fn(),
      textContent: '',
      remove: jest.fn(),
    } as unknown as HTMLStyleElement;

    (document.createElement as jest.Mock).mockImplementation((tagName) => {
      if (tagName === 'style') return mockStyleElement;
      if (tagName === 'div') return { classList: { add: jest.fn() }, appendChild: jest.fn() };
      if (tagName === 'iframe') {
        return {
          src: '',
          classList: { add: jest.fn() },
          setAttribute: jest.fn(),
          addEventListener: jest.fn(),
        };
      }
    });

    // Act
    iframe.make(mockParent);
    iframe.dispose();

    // Assert
    expect(mockStyleElement.remove).toHaveBeenCalled();
  });

  it('should handle iframe load event', () => {
    // Arrange
    const iframe = new Iframe(mockIframeConfig);
    const mockParent = {
      appendChild: jest.fn(),
    } as unknown as HTMLElement;

    let loadCallback: any = () => {};

    const mockIframeElement = {
      src: '',
      classList: { add: jest.fn() },
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
          appendChild: jest.fn(),
        } as unknown as HTMLDivElement;
      } else if (tagName === 'iframe') {
        return mockIframeElement;
      } else if (tagName === 'style') {
        return {
          setAttribute: jest.fn(),
          textContent: '',
          remove: jest.fn(),
        } as unknown as HTMLStyleElement;
      }
    });

    // Act
    iframe.make(mockParent);
    loadCallback();

    // Assert
    expect(mockLoader.dispose).toHaveBeenCalled();
  });
});
