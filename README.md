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
import { VerifiedClientSdk } from '@verifiedinc-public/client-sdk';

// Initialize the client
const client = new VerifiedClientSdk({
  // Configuration options
  sessionKey: 'SESSION_KEY',
  onResult: handleResult,
  onError: handleError,
});
```

For a complete implementation example, see the [Example Implementation](#example-implementation) section below.

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
