import { OneClickError, OneClickResponseData } from "@sdk/types";

export interface ClientOptions {
  environment?: string;
  publicKey: string;
  onReady?: () => void;
  onSuccess?: (data: OneClickResponseData) => void;
  onError?: (error: OneClickError) => void;
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
