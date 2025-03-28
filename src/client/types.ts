import { SdkError, SdkResult } from '@sdk/types';

export interface ClientOptions {
  environment?: string;
  sessionKey: string;
  onResult?: (data: SdkResult) => void;
  onError?: (error: SdkError) => void;
}

export interface ClientInterface {
  readonly ready: boolean;
  show(element: HTMLElement): void;
  destroy(): void;
}

declare global {
  interface Window {
    Verified: {
      Client: new (options: ClientOptions) => ClientInterface;
    };
  }
}
