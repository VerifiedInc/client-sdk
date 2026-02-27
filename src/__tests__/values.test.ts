import {
  SdkResultValues,
  SdkErrorReasons,
  SdkEventValues,
  PossibleEventTypes,
  EventSource,
} from '@sdk/values';

describe('SDK Values', () => {
  describe('SdkResultValues', () => {
    it('should have the correct values', () => {
      expect(SdkResultValues).toEqual({
        USER_SHARED_CREDENTIALS: 'USER_SHARED_CREDENTIALS',
        USER_SHARED_HEALTH_DATA: 'USER_SHARED_HEALTH_DATA',
        USER_OPTED_OUT: 'USER_OPTED_OUT',
        NO_CREDENTIALS_FOUND: 'NO_CREDENTIALS_FOUND',
        NO_INSURANCE_FOUND: 'NO_INSURANCE_FOUND',
        RISK_SCORE_TOO_HIGH: 'RISK_SCORE_TOO_HIGH',
        MAX_INPUT_ATTEMPTS_EXCEEDED: 'MAX_INPUT_ATTEMPTS_EXCEEDED',
        MAX_VERIFICATION_CODE_ATTEMPTS_EXCEEDED: 'MAX_VERIFICATION_CODE_ATTEMPTS_EXCEEDED',
      });
    });

    it('should have readonly properties', () => {
      // TypeScript's 'as const' makes the properties readonly at compile time
      // but doesn't prevent modification at runtime
      const originalValue = SdkResultValues.USER_SHARED_CREDENTIALS;
      expect(originalValue).toBe('USER_SHARED_CREDENTIALS');
    });
  });

  describe('SdkErrorReasons', () => {
    it('should have the correct values', () => {
      expect(SdkErrorReasons).toEqual({
        SESSION_TIMEOUT: 'SESSION_TIMEOUT',
        INVALID_SESSION_KEY: 'INVALID_SESSION_KEY',
        SHARE_CREDENTIALS_ERROR: 'SHARE_CREDENTIALS_ERROR',
      });
    });

    it('should have readonly properties', () => {
      // TypeScript's 'as const' makes the properties readonly at compile time
      // but doesn't prevent modification at runtime
      const originalValue = SdkErrorReasons.SESSION_TIMEOUT;
      expect(originalValue).toBe('SESSION_TIMEOUT');
    });
  });

  describe('SdkEventValues', () => {
    it('should have the correct values', () => {
      expect(SdkEventValues).toEqual({
        SDK_READY: 'SDK_READY',
        USER_STEP_CHANGE: 'USER_STEP_CHANGE',
        STEP_TIME_SPENT: 'STEP_TIME_SPENT',
        USER_COMPLETED_PRODUCT: 'USER_COMPLETED_PRODUCT',
        ONE_CLICK_SIGNUP_FORM_SUBMITTED: 'ONE_CLICK_SIGNUP_FORM_SUBMITTED',
        ONE_CLICK_HEALTH_FORM_SUBMITTED: 'ONE_CLICK_HEALTH_FORM_SUBMITTED',
      });
    });

    it('should have readonly properties', () => {
      const originalValue = SdkEventValues.SDK_READY;
      expect(originalValue).toBe('SDK_READY');
    });
  });

  describe('PossibleEventTypes', () => {
    it('should have the correct values', () => {
      expect(PossibleEventTypes).toEqual({
        VERIFIED_CLIENT_SDK_VIEWPORT_READY: 'VERIFIED_CLIENT_SDK_VIEWPORT_READY',
        VERIFIED_CLIENT_SDK_VIEWPORT_RESIZE: 'VERIFIED_CLIENT_SDK_VIEWPORT_RESIZE',
        VERIFIED_CLIENT_SDK_USER_OPTED_OUT: 'VERIFIED_CLIENT_SDK_USER_OPTED_OUT',
        VERIFIED_CLIENT_SDK_MAX_INPUT_ATTEMPTS_EXCEEDED:
          'VERIFIED_CLIENT_SDK_MAX_INPUT_ATTEMPTS_EXCEEDED',
        VERIFIED_CLIENT_SDK_MAX_VERIFICATION_CODE_ATTEMPTS_EXCEEDED:
          'VERIFIED_CLIENT_SDK_MAX_VERIFICATION_CODE_ATTEMPTS_EXCEEDED',
        VERIFIED_CLIENT_SDK_NO_CREDENTIALS_FOUND: 'VERIFIED_CLIENT_SDK_NO_CREDENTIALS_FOUND',
        VERIFIED_CLIENT_SDK_RISK_SCORE_TOO_HIGH: 'VERIFIED_CLIENT_SDK_RISK_SCORE_TOO_HIGH',
        VERIFIED_CLIENT_SDK_FORM_SUBMISSION: 'VERIFIED_CLIENT_SDK_FORM_SUBMISSION',
        VERIFIED_CLIENT_SDK_FORM_SUBMISSION_ERROR: 'VERIFIED_CLIENT_SDK_FORM_SUBMISSION_ERROR',
        VERIFIED_CLIENT_SDK_USER_SHARED_HEALTH_DATA: 'VERIFIED_CLIENT_SDK_USER_SHARED_HEALTH_DATA',
        VERIFIED_CLIENT_SDK_NO_INSURANCE_FOUND: 'VERIFIED_CLIENT_SDK_NO_INSURANCE_FOUND',
        VERIFIED_CLIENT_SDK_INVALID_SESSION_KEY: 'VERIFIED_CLIENT_SDK_INVALID_SESSION_KEY',
        VERIFIED_CLIENT_SDK_SESSION_TIMEOUT: 'VERIFIED_CLIENT_SDK_SESSION_TIMEOUT',
        VERIFIED_CLIENT_SDK_EVENT: 'VERIFIED_CLIENT_SDK_EVENT',
      });
    });

    it('should have readonly properties', () => {
      // TypeScript's 'as const' makes the properties readonly at compile time
      // but doesn't prevent modification at runtime
      const originalValue = PossibleEventTypes.VERIFIED_CLIENT_SDK_VIEWPORT_READY;
      expect(originalValue).toBe('VERIFIED_CLIENT_SDK_VIEWPORT_READY');
    });
  });

  describe('EventSource', () => {
    it('should have the correct value', () => {
      expect(EventSource).toBe('Verified.Client@1.3.0');
    });
  });
});
