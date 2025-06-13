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
    sessionKey: '23f50376-7b5b-4daa-87c3-bd252f40ea0d',
    onResult: handleResult,
    onError: handleError,
  });

  function handleResult(data: SdkResult) {
    if (data.type === SdkResultValues.USER_SHARED_CREDENTIALS) {
      console.log('Verified Client SDK result: User shared credentials', data);
    }
    if (data.type === SdkResultValues.USER_OPTED_OUT) {
      console.log('Verified Client SDK result: User opted out', data);
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
