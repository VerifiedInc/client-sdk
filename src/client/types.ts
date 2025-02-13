import { OneClickError, OneClickResponseData } from "@sdk/types";

export interface ClientOptions {
  publicKey: string;
  onReady?: () => void;
  onSuccess?: (data: OneClickResponseData) => void;
  onError?: (error: OneClickError) => void;
}

export interface ShowOptions {
  iframeAttributes?: Partial<HTMLIFrameElement>;
}

export interface ClientInterface {
  readonly ready: boolean;
  show(element: HTMLElement, options?: ShowOptions): void;
  destroy(): void;
}

declare global {
  interface Window {
    VerifiedInc: {
      Client: new (options: ClientOptions) => ClientInterface;
    };
  }
}
