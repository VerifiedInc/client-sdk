# @verifiedinc-public/client-sdk

![npm version](https://img.shields.io/npm/v/%40verifiedinc-public%2Fclient-sdk?label=npm%20package&labelColor=%233c434b&color=%2332c553&cacheSeconds=60)

An SDK for serving Verified's 1-click service into web applications.

## Features

- 🔒 Secure iframe-based integration
- 📝 Type-safe implementation with TypeScript
- 📊 Built-in logging system for debugging
- 🌐 Multiple module format support (ESM, UMD)
- 🛠️ Modern build tooling with Vite

## Installation

```bash
npm install @verifiedinc-public/client-sdk
```

## Usage

```typescript
import {
  VerifiedClientSdk,
  SdkResult,
  SdkError,
  SdkResultValues,
  SdkErrorReasons,
} from '@verifiedinc-public/client-sdk';

// Initialize the SDK
const sdk = new VerifiedClientSdk({
  sessionKey: 'YOUR_SESSION_KEY',
  onResult: handleResult,
  onError: handleError,
});

// Handle successful results
function handleResult(data: SdkResult) {
  switch (data.type) {
    case SdkResultValues.USER_SHARED_CREDENTIALS:
      console.log('User shared credentials', data);
      break;
    case SdkResultValues.USER_OPTED_OUT:
      console.log('User opted out', data);
      break;
    case SdkResultValues.NO_CREDENTIALS_FOUND:
      console.log('No credentials found', data);
      break;
    case SdkResultValues.RISK_SCORE_TOO_HIGH:
      console.log('Risk score too high', data);
      break;
    case SdkResultValues.MAX_INPUT_ATTEMPTS_EXCEEDED:
      console.log('Max input attempts exceeded', data);
      break;
    case SdkResultValues.MAX_VERIFICATION_CODE_ATTEMPTS_EXCEEDED:
      console.log('Max OTP attempts exceeded', data);
      break;
  }
}

// Handle errors
function handleError(error: SdkError) {
  console.error('SDK error:', error.reason);

  switch (error.reason) {
    case SdkErrorReasons.INVALID_SESSION_KEY:
      // Call POST /sessionKey on server to get a new session key
      break;
    case SdkErrorReasons.SESSION_TIMEOUT:
      // Call POST /sessionKey on server and create new VerifiedClientSdk instance
      break;
    case SdkErrorReasons.SHARE_CREDENTIALS_ERROR:
      // Handle credential sharing error
      break;
  }
}

// Display the SDK in your application
sdk.show(document.getElementById('sdk-container') as HTMLElement);
```

## Module Formats

The SDK is available in multiple formats:

- ESM (default): `dist/index.esm.js`
- UMD (browser): `dist/index.umd.js`
- TypeScript declarations: `dist/index.d.ts`
