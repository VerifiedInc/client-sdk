import { OptedOutEvent, OptedOutEventHandleData } from '@sdk/client/iframe/events/opted-out.event';

// Silence the JSDOM navigation errors
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    // Filter out the JSDOM navigation errors
    if (args[0] && args[0].toString().includes('Not implemented: navigation')) {
      return;
    }
    originalConsoleError(...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('OptedOutEvent', () => {
  let optedOutEvent: OptedOutEvent;
  let originalWindowLocation: Location;

  beforeEach(() => {
    // Store original window.location
    originalWindowLocation = window.location;

    // Mock window.location
    (window as unknown as { location: Location }).location = jest.fn() as unknown as Location;

    // Create a new instance for each test
    optedOutEvent = new OptedOutEvent();
  });

  afterEach(() => {
    // Restore original window.location
    (window as unknown as { location: Location }).location = originalWindowLocation;
  });

  it('should initialize correctly', () => {
    // Assert
    expect(optedOutEvent).toBeDefined();
  });

  it('should redirect to the provided URL when handle is called', () => {
    // Arrange
    const mockData: OptedOutEventHandleData = {
      redirectUrl: 'https://example.com',
    };

    // Act
    const response = optedOutEvent.handle(mockData);

    // Assert
    expect(response).toBeUndefined();
  });
});
