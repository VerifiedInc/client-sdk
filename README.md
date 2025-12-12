# @verifiedinc-public/client-sdk

![npm version](https://img.shields.io/npm/v/%40verifiedinc-public%2Fclient-sdk?label=npm%20package&labelColor=%233c434b&color=%2332c553&cacheSeconds=60)
![Github Actions publish](https://github.com/VerifiedInc/client-sdk/actions/workflows/publish.yml/badge.svg)

A TypeScript-based SDK for serving Verified's 1-click service into web applications.

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

## Development

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Available Scripts

- `npm run dev` - Start development mode with Vite (runs the example in dev/main.ts)
- `npm run test` - Test the project
- `npm run build` - Build for production
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
src/
├── client/        # Core client implementation
│   ├── iframe/    # Iframe-based functionality
│   ├── logger/    # Logging system
│   ├── utils/     # Utility functions
│   ├── types.ts   # Type definitions
│   └── index.ts   # Main client implementation
├── errors/        # Error handling
├── types.ts       # Global type definitions
└── values.ts      # Constants and values
dev/
└── main.ts        # Example implementation for development and testing
```

You can run this example by executing:

```bash
npm run dev
```

## Building

To build the SDK:

```bash
npm run build
```

This will generate the following outputs:

- ESM bundle
- UMD bundle
- TypeScript declaration files

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
