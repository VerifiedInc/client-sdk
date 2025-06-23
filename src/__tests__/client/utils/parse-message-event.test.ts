import { parseMessageEvent } from '@sdk/client/utils/parse-message-event';
import { EventSource, PossibleEventTypes } from '@sdk/values';

describe('parseMessageEvent', () => {
  it('should return false if event has no data', () => {
    // Arrange
    const event = {} as MessageEvent;

    // Act
    const result = parseMessageEvent(event);

    // Assert
    expect(result).toBe(false);
  });

  it('should return false if event data is not an object', () => {
    // Arrange
    const event = {
      data: 'not an object',
    } as MessageEvent;

    // Act
    const result = parseMessageEvent(event);

    // Assert
    expect(result).toBe(false);
  });

  it('should return false if event data is null', () => {
    // Arrange
    const event = {
      data: null,
    } as MessageEvent;

    // Act
    const result = parseMessageEvent(event);

    // Assert
    expect(result).toBe(false);
  });

  it('should return false if event data source is not EventSource', () => {
    // Arrange
    const event = {
      data: {
        source: 'invalid-source',
        timestamp: Date.now(),
        type: PossibleEventTypes.VERIFIED_CLIENT_SDK_FORM_SUBMISSION,
        data: {},
      },
    } as MessageEvent;

    // Act
    const result = parseMessageEvent(event);

    // Assert
    expect(result).toBe(false);
  });

  it('should return false if event data timestamp is not a number', () => {
    // Arrange
    const event = {
      data: {
        source: EventSource,
        timestamp: 'not-a-number',
        type: PossibleEventTypes.VERIFIED_CLIENT_SDK_FORM_SUBMISSION,
        data: {},
      },
    } as MessageEvent;

    // Act
    const result = parseMessageEvent(event);

    // Assert
    expect(result).toBe(false);
  });

  it('should return false if event data type is not a string', () => {
    // Arrange
    const event = {
      data: {
        source: EventSource,
        timestamp: Date.now(),
        type: 123,
        data: {},
      },
    } as MessageEvent;

    // Act
    const result = parseMessageEvent(event);

    // Assert
    expect(result).toBe(false);
  });

  it('should return false if event data type is not in PossibleEventTypes', () => {
    // Arrange
    const event = {
      data: {
        source: EventSource,
        timestamp: Date.now(),
        type: 'invalid-type',
        data: {},
      },
    } as MessageEvent;

    // Act
    const result = parseMessageEvent(event);

    // Assert
    expect(result).toBe(false);
  });

  it('should return false if event data.data is not an object or null', () => {
    // Arrange
    const event = {
      data: {
        source: EventSource,
        timestamp: Date.now(),
        type: PossibleEventTypes.VERIFIED_CLIENT_SDK_FORM_SUBMISSION,
        data: 'not-an-object-or-null',
      },
    } as MessageEvent;

    // Act
    const result = parseMessageEvent(event);

    // Assert
    expect(result).toBe(false);
  });

  it('should return parsed message event if all validations pass with object data', () => {
    // Arrange
    const timestamp = Date.now();
    const eventData = {
      redirectUrl: 'https://example.com',
      identityUuid: '123',
    };

    const event = {
      data: {
        source: EventSource,
        timestamp,
        type: PossibleEventTypes.VERIFIED_CLIENT_SDK_FORM_SUBMISSION,
        data: eventData,
      },
    } as MessageEvent;

    // Act
    const result = parseMessageEvent(event);

    // Assert
    expect(result).toEqual({
      source: EventSource,
      timestamp,
      type: PossibleEventTypes.VERIFIED_CLIENT_SDK_FORM_SUBMISSION,
      data: eventData,
    });
  });

  it('should return parsed message event if all validations pass with null data', () => {
    // Arrange
    const timestamp = Date.now();

    const event = {
      data: {
        source: EventSource,
        timestamp,
        type: PossibleEventTypes.VERIFIED_CLIENT_SDK_FORM_SUBMISSION,
        data: null,
      },
    } as MessageEvent;

    // Act
    const result = parseMessageEvent(event);

    // Assert
    expect(result).toEqual({
      source: EventSource,
      timestamp,
      type: PossibleEventTypes.VERIFIED_CLIENT_SDK_FORM_SUBMISSION,
      data: null,
    });
  });
});
