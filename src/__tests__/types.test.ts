import { SdkResult, SdkError, SdkEvent, ClientMessageEvent } from '@sdk/types';
import {
  SdkResultValues,
  SdkErrorReasons,
  SdkEventValues,
  PossibleEventTypes,
  EventSource,
} from '@sdk/values';

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

  describe('SdkEvent', () => {
    const metadata = {
      identityUuid: '123',
      redirectUrl: 'https://example.com',
      birthDate: '1990-01-01',
      birthDateMismatched: null,
      phone: '1234567890',
      ssn4: '1234',
      ssn4Mismatched: null,
      fullName: null,
      fullNameMismatched: null,
      step: 'info' as const,
    };

    it('should allow creating a valid SDK_READY event', () => {
      const event: SdkEvent = {
        type: SdkEventValues.SDK_READY,
        metadata,
      };

      expect(event.type).toBe(SdkEventValues.SDK_READY);
      expect(event.metadata).toEqual(metadata);
    });

    it('should allow creating a valid USER_STEP_CHANGE event', () => {
      const event: SdkEvent = {
        type: SdkEventValues.USER_STEP_CHANGE,
        metadata,
        step: 'birthday',
        previousStep: 'phone',
      };

      expect(event.type).toBe(SdkEventValues.USER_STEP_CHANGE);
      expect(event.step).toBe('birthday');
      expect(event.previousStep).toBe('phone');
    });

    it('should allow creating a valid USER_STEP_CHANGE event without previousStep', () => {
      const event: SdkEvent = {
        type: SdkEventValues.USER_STEP_CHANGE,
        metadata,
        step: 'phone',
      };

      expect(event.type).toBe(SdkEventValues.USER_STEP_CHANGE);
      expect(event.step).toBe('phone');
      expect(event).not.toHaveProperty('previousStep');
    });

    it('should allow creating a valid STEP_TIME_SPENT event', () => {
      const event: SdkEvent = {
        type: SdkEventValues.STEP_TIME_SPENT,
        metadata,
        step: 'consent',
        durationMs: 5000,
      };

      expect(event.type).toBe(SdkEventValues.STEP_TIME_SPENT);
      expect(event.step).toBe('consent');
      expect(event.durationMs).toBe(5000);
    });

    it('should allow creating a valid USER_COMPLETED_PRODUCT event', () => {
      const event: SdkEvent = {
        type: SdkEventValues.USER_COMPLETED_PRODUCT,
        metadata,
        product: '1-click-signup',
      };

      expect(event.type).toBe(SdkEventValues.USER_COMPLETED_PRODUCT);
      expect(event.product).toBe('1-click-signup');
    });

    it('should allow creating a valid ONE_CLICK_SIGNUP_FORM_SUBMITTED event', () => {
      const event: SdkEvent = {
        type: SdkEventValues.ONE_CLICK_SIGNUP_FORM_SUBMITTED,
        metadata,
        form: { email: 'test@example.com', firstName: 'John' },
      };

      expect(event.type).toBe(SdkEventValues.ONE_CLICK_SIGNUP_FORM_SUBMITTED);
      expect(event.form).toEqual({ email: 'test@example.com', firstName: 'John' });
    });

    it('should allow creating a valid ONE_CLICK_HEALTH_FORM_SUBMITTED event', () => {
      const event: SdkEvent = {
        type: SdkEventValues.ONE_CLICK_HEALTH_FORM_SUBMITTED,
        metadata,
        form: {
          healthInsurance: [
            {
              memberId: 'M123',
              payer: {
                name: 'Aetna',
                verifiedId: 'P789',
                logoUrl: 'https://example.com/logo.png',
              },
            },
          ],
        },
      };

      expect(event.type).toBe(SdkEventValues.ONE_CLICK_HEALTH_FORM_SUBMITTED);
      expect(event.form.healthInsurance).toHaveLength(1);
      expect(event.form.healthInsurance[0].memberId).toBe('M123');
      expect(event.form.healthInsurance[0].payer?.name).toBe('Aetna');
    });

    it('should allow creating a ONE_CLICK_HEALTH_FORM_SUBMITTED event without payer', () => {
      const event: SdkEvent = {
        type: SdkEventValues.ONE_CLICK_HEALTH_FORM_SUBMITTED,
        metadata,
        form: {
          healthInsurance: [
            {
              memberId: 'M456',
            },
          ],
        },
      };

      expect(event.form.healthInsurance[0].memberId).toBe('M456');
      expect(event.form.healthInsurance[0].payer).toBeUndefined();
    });
  });
});
