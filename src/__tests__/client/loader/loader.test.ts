import { Loader } from '@sdk/client/loader/loader';

describe('Loader', () => {
  beforeEach(() => {
    // Reset mocks
    jest.resetAllMocks();

    // Mock DOM methods with proper implementation
    document.createElement = jest.fn().mockImplementation(() => {
      return {
        classList: {
          add: jest.fn(),
        },
        style: {},
        setAttribute: jest.fn(),
        appendChild: jest.fn(),
        remove: jest.fn(),
      } as unknown as HTMLElement;
    });

    document.createElementNS = jest.fn().mockImplementation(() => {
      return {
        classList: {
          add: jest.fn(),
        },
        setAttribute: jest.fn(),
        appendChild: jest.fn(),
      } as unknown as SVGElement;
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize correctly', () => {
    // Act
    const loader = new Loader();

    // Assert
    expect(loader).toBeDefined();
  });

  it('should create loader elements when make is called', () => {
    // Arrange
    const loader = new Loader();
    const mockParent = {
      appendChild: jest.fn(),
    } as unknown as HTMLElement;

    // Mock specific elements to avoid JSDOM not implemented errors
    const mockLoaderContainer = {
      classList: { add: jest.fn() },
      appendChild: jest.fn(),
    };

    (document.createElement as jest.Mock).mockImplementation((tagName) => {
      if (tagName === 'div') {
        return mockLoaderContainer;
      }
      return {
        classList: { add: jest.fn() },
        setAttribute: jest.fn(),
        style: {},
        appendChild: jest.fn(),
      };
    });

    // Act
    loader.make(mockParent);

    // Assert
    expect(document.createElement).toHaveBeenCalledWith('span');
    expect(document.createElement).toHaveBeenCalledWith('div');
    expect(document.createElement).toHaveBeenCalledWith('style');
    expect(document.createElementNS).toHaveBeenCalledWith('http://www.w3.org/2000/svg', 'svg');
    expect(document.createElementNS).toHaveBeenCalledWith('http://www.w3.org/2000/svg', 'circle');
    expect(mockParent.appendChild).toHaveBeenCalled();
    expect(mockLoaderContainer.classList.add).toHaveBeenCalledWith('sdk-loader-container');
  });

  it('should set correct attributes on loader elements', () => {
    // Arrange
    const loader = new Loader();

    const mockSpan = {
      classList: { add: jest.fn() },
      setAttribute: jest.fn(),
      style: {},
      appendChild: jest.fn(),
    };

    const mockSvg = {
      classList: { add: jest.fn() },
      setAttribute: jest.fn(),
      appendChild: jest.fn(),
    };

    const mockCircle = {
      classList: { add: jest.fn() },
      setAttribute: jest.fn(),
    };

    const mockDiv = {
      classList: { add: jest.fn() },
      appendChild: jest.fn(),
    };

    const mockStyle = {
      textContent: '',
    };

    const mockParent = {
      appendChild: jest.fn(),
    };

    (document.createElement as jest.Mock).mockImplementation((tagName) => {
      if (tagName === 'span') return mockSpan;
      if (tagName === 'div') return mockDiv;
      if (tagName === 'style') return mockStyle;
      return {};
    });

    (document.createElementNS as jest.Mock).mockImplementation((namespace, tagName) => {
      if (tagName === 'svg') return mockSvg;
      if (tagName === 'circle') return mockCircle;
      return {};
    });

    // Act
    loader.make(mockParent as unknown as HTMLElement);

    // Assert
    expect(mockSpan.classList.add).toHaveBeenCalledWith(
      'sdk-circular-progress',
      'sdk-circular-progress-indeterminate'
    );
    expect(mockSpan.setAttribute).toHaveBeenCalledWith('role', 'progressbar');
    expect(mockSvg.classList.add).toHaveBeenCalledWith('sdk-circular-progress-svg');
    expect(mockSvg.setAttribute).toHaveBeenCalledWith('viewBox', '22 22 44 44');
    expect(mockCircle.classList.add).toHaveBeenCalledWith(
      'sdk-circular-progress-circle',
      'sdk-circular-progress-circle-indeterminate'
    );
    expect(mockCircle.setAttribute).toHaveBeenCalledWith('cx', '44');
    expect(mockCircle.setAttribute).toHaveBeenCalledWith('cy', '44');
    expect(mockCircle.setAttribute).toHaveBeenCalledWith('r', '20.2');
    expect(mockCircle.setAttribute).toHaveBeenCalledWith('fill', 'none');
    expect(mockCircle.setAttribute).toHaveBeenCalledWith('stroke-width', '3.6');
    expect(mockDiv.classList.add).toHaveBeenCalledWith('sdk-loader-container');
    expect(mockStyle.textContent).toContain('.sdk-loader-container');
  });

  it('should dispose loader elements correctly when loaderContainer exists', () => {
    // Arrange
    const loader = new Loader();

    const mockLoaderContainer = {
      classList: { add: jest.fn() },
      appendChild: jest.fn(),
      remove: jest.fn(),
    };

    const mockParent = {
      appendChild: jest.fn(),
    };

    (document.createElement as jest.Mock).mockImplementation((tagName) => {
      if (tagName === 'div') {
        return mockLoaderContainer;
      }
      return {
        classList: { add: jest.fn() },
        setAttribute: jest.fn(),
        style: {},
        appendChild: jest.fn(),
      };
    });

    // Act
    loader.make(mockParent as unknown as HTMLElement);
    loader.dispose();

    // Assert
    expect(mockLoaderContainer.remove).toHaveBeenCalled();
  });

  it('should handle dispose gracefully when loaderContainer is null', () => {
    // Arrange
    const loader = new Loader();

    // Act & Assert - should not throw an error
    expect(() => {
      loader.dispose();
    }).not.toThrow();
  });
});
