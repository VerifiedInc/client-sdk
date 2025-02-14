# @verifiedinc/client-sdk

An SDK for serving Verified's 1-click service into web applications.

## Features

- 🔒 Secure iframe-based integration
- 📝 Type-safe implementation with TypeScript
- 📊 Built-in logging system for debugging
- 🌐 Multiple module format support (ESM, UMD)
- 🛠️ Modern build tooling with Vite

## Installation

```bash
npm install @verifiedinc/client-sdk
```

## Usage

```typescript
import * as VerifiedClient from "@verifiedinc/client-sdk";

// Initialize the client
const client = new VerifiedClient.Client({
  // Configuration options
  publicKey: "pub_test-key",
  onReady: handleReadySDK,
  onSuccess: handleSuccess,
  onError: handleError,
});
```

## Module Formats

The SDK is available in multiple formats:

- ESM (default): `dist/index.esm.js`
- UMD (browser): `dist/index.umd.js`
- TypeScript declarations: `dist/index.d.ts`
