import {
  VerifiedClientSDK,
  SdkResult,
  SdkError,
  SdkResultValues,
  SdkErrorReasons,
} from '@sdk/index';

function main() {
  const sdk = new VerifiedClientSDK({
    environment: 'local',
    sessionKey: '5a15930f-0a7e-49c2-8747-14c45b615944',
    onResult: handleResult,
    onError: handleError,
  });

  function handleResult(data: SdkResult) {
    if (data.type === SdkResultValues.USER_SHARED_CREDENTIALS) {
      console.log('Verified Client SDK result: User shared credentials', data);
    }
    if (data.type === SdkResultValues.USER_OPTED_OUT) {
      console.log('Verified Client SDK result: User opted out');
    }
  }

  function handleError(error: SdkError) {
    console.error('Verified Client SDK error:', error.reason);

    switch (error.reason) {
      case SdkErrorReasons.INVALID_SESSION_KEY:
      // Call POST /sessionKey on server
      case SdkErrorReasons.SESSION_TIMEOUT:
      // Call POST /sessionKey on server
      // Create new VerifiedClientSDK instance
      case SdkErrorReasons.SHARE_CREDENTIALS_ERROR:
      // Do something reasonable
    }
  }

  // Show the SDK
  sdk.show(document.getElementById('sdk-container') as HTMLElement);
}

main();
