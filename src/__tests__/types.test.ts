import { SdkResult, SdkError, ClientMessageEvent } from '@sdk/types';
import { SdkResultValues, SdkErrorReasons, PossibleEventTypes, EventSource } from '@sdk/values';

describe('SDK Types', () => {
  describe('SdkResult', () => {
    it('should allow creating a valid USER_SHARED_CREDENTIALS result', () => {
      // Arrange & Act
      const result: SdkResult = {
        type: SdkResultValues.USER_SHARED_CREDENTIALS,
        identityUuid: '123',
        redirectUrl: 'https://example.com',
        birthDate: '1990-01-01',
        birthDateMismatched: null,
        phone: '1234567890',
        ssn4: '1234',
        ssn4Mismatched: null,
        fullName: null,
        fullNameMismatched: null,
        step: 'info',
      };

      // Assert
      expect(result.type).toBe(SdkResultValues.USER_SHARED_CREDENTIALS);
      expect(result.identityUuid).toBe('123');
    });

    it('should allow creating a valid USER_OPTED_OUT result', () => {
      // Arrange & Act
      const result: SdkResult = {
        type: SdkResultValues.USER_OPTED_OUT,
        identityUuid: null,
        redirectUrl: 'https://example.com',
        birthDate: null,
        birthDateMismatched: null,
        phone: null,
        ssn4: null,
        ssn4Mismatched: null,
        fullName: null,
        fullNameMismatched: null,
        step: 'phone',
      };

      // Assert
      expect(result.type).toBe(SdkResultValues.USER_OPTED_OUT);
      expect(result.redirectUrl).toBe('https://example.com');
    });
  });

  describe('SdkError', () => {
    it('should allow creating a valid error with SESSION_TIMEOUT reason', () => {
      // Arrange & Act
      const error: SdkError = {
        reason: SdkErrorReasons.SESSION_TIMEOUT,
      };

      // Assert
      expect(error.reason).toBe(SdkErrorReasons.SESSION_TIMEOUT);
    });

    it('should allow creating a valid error with INVALID_SESSION_KEY reason', () => {
      // Arrange & Act
      const error: SdkError = {
        reason: SdkErrorReasons.INVALID_SESSION_KEY,
      };

      // Assert
      expect(error.reason).toBe(SdkErrorReasons.INVALID_SESSION_KEY);
    });

    it('should allow creating a valid error with SHARE_CREDENTIALS_ERROR reason', () => {
      // Arrange & Act
      const error: SdkError = {
        reason: SdkErrorReasons.SHARE_CREDENTIALS_ERROR,
      };

      // Assert
      expect(error.reason).toBe(SdkErrorReasons.SHARE_CREDENTIALS_ERROR);
    });
  });

  describe('ClientMessageEvent', () => {
    it('should allow creating a valid message event with object data', () => {
      // Arrange & Act
      const event: ClientMessageEvent = {
        type: PossibleEventTypes.VERIFIED_CLIENT_SDK_FORM_SUBMISSION,
        data: {
          redirectUrl: 'https://example.com',
          identityUuid: '123',
        },
        source: EventSource,
        timestamp: 1623456789,
      };

      // Assert
      expect(event.type).toBe(PossibleEventTypes.VERIFIED_CLIENT_SDK_FORM_SUBMISSION);
      expect(event.source).toBe(EventSource);
      expect(event.timestamp).toBe(1623456789);
      expect(event.data).toEqual({
        redirectUrl: 'https://example.com',
        identityUuid: '123',
      });
    });

    it('should allow creating a valid message event with null data', () => {
      // Arrange & Act
      const event: ClientMessageEvent = {
        type: PossibleEventTypes.VERIFIED_CLIENT_SDK_SESSION_TIMEOUT,
        data: null,
        source: EventSource,
        timestamp: 1623456789,
      };

      // Assert
      expect(event.type).toBe(PossibleEventTypes.VERIFIED_CLIENT_SDK_SESSION_TIMEOUT);
      expect(event.data).toBeNull();
    });
  });
});
