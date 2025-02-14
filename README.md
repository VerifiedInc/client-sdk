# @verifiedinc/client-sdk

A TypeScript-based SDK for serving Verified's 1-click service into web applications.

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

- `npm run dev` - Start development mode with Vite
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
