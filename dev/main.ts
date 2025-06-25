import {
  VerifiedClientSdk,
  SdkResult,
  SdkError,
  SdkResultValues,
  SdkErrorReasons,
} from '@sdk/index';

function main() {
  const sdk = new VerifiedClientSdk({
    environment: 'local',
    sessionKey: '17b3fa73-6b88-45e4-835d-2113280e1005',
    onResult: handleResult,
    onError: handleError,
  });

  function handleResult(data: SdkResult) {
    switch (data.type) {
      case SdkResultValues.USER_SHARED_CREDENTIALS:
        console.log('Verified Client SDK result: User shared credentials', data);
        break;
      case SdkResultValues.USER_OPTED_OUT:
        console.log('Verified Client SDK result: User opted out', data);
        break;
      case SdkResultValues.NO_CREDENTIALS_FOUND:
        console.log('Verified Client SDK result: No credentials found', data);
        break;
      case SdkResultValues.RISK_SCORE_TOO_HIGH:
        console.log('Verified Client SDK result: Risk score too high', data);
        break;
      case SdkResultValues.MAX_INPUT_ATTEMPTS_EXCEEDED:
        console.log('Verified Client SDK result: Max input attempts exceeded', data);
        break;
      case SdkResultValues.MAX_VERIFICATION_CODE_ATTEMPTS_EXCEEDED:
        console.log('Verified Client SDK result: Max OTP attempts exceeded', data);
        break;
    }
  }

  function handleError(error: SdkError) {
    console.error('Verified Client SDK error:', error.reason);

    switch (error.reason) {
      case SdkErrorReasons.INVALID_SESSION_KEY:
      // Call POST /sessionKey on server
      case SdkErrorReasons.SESSION_TIMEOUT:
      // Call POST /sessionKey on server
      // Create new VerifiedClientSdk instance
      case SdkErrorReasons.SHARE_CREDENTIALS_ERROR:
      // Do something reasonable
    }
  }

  // Show the SDK
  sdk.show(document.getElementById('sdk-container') as HTMLElement);
}

main();
