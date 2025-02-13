import { OneClickError, OneClickResponseData } from "@sdk/types";
import { ErrorReasons } from "@sdk/values";

import { ClientOptions, ClientInterface } from "@sdk/client/types";
import { ErrorLogger } from "@sdk/client/logger/error-logger";

import { Iframe } from "@sdk/client/iframe/iframe";
import { IframeConfig } from "@sdk/client/iframe/iframe-config";
import { IframeMessageManager } from "@sdk/client/iframe/iframe-message-manager";

export class Client implements ClientInterface {
  private readonly errorLogger = new ErrorLogger();
  private readonly iframe: Iframe;
  private readonly iframeConfig: IframeConfig;
  private readonly iframeMessageManager: IframeMessageManager;

  public ready: boolean = false;
  private readonly onReady: () => void;
  private readonly onSuccess: (data: OneClickResponseData) => void;
  private readonly onError: (error: OneClickError) => void;

  constructor(private options: ClientOptions) {
    this.onReady = options.onReady || (() => {});
    this.onSuccess = options.onSuccess || (() => {});
    this.onError = options.onError || (() => {});

    this.iframeConfig = new IframeConfig(options.publicKey);
    this.iframe = new Iframe(this.iframeConfig);
    this.iframeMessageManager = new IframeMessageManager({
      onMessage: this.messageHandler.bind(this),
      iframe: this.iframe,
      iframeConfig: this.iframeConfig,
    });

    // Return if the public key is not provided, another instance will have to be created
    if (
      !this.options.publicKey ||
      !this.options.publicKey.trim().startsWith("pub_")
    ) {
      this.onError({
        reason: ErrorReasons.INVALID_API_KEY,
        additionalData: {
          name: "InvalidApiKey",
          message: "Public key is required",
          code: 400,
          className: "InvalidApiKey",
          data: {
            errorCode: "INVALID_API_KEY",
          },
        },
      });
      return;
    }

    // Mock async initialization
    setTimeout(() => {
      this.ready = true;
      // Optionally notify success
      this.onReady();
    }, 1000);
  }

  public show(element: HTMLElement): void {
    if (this.iframe.element) {
      const error: OneClickError = {
        reason: ErrorReasons.DUPLICATE_IFRAME_ATTEMPT,
        additionalData: {
          name: "DuplicateIframe",
          message: "SDK iframe already exists",
          code: 400,
          className: "DuplicateIframe",
          data: {
            errorCode: "DUPLICATE_IFRAME_ATTEMPT",
          },
        },
      };
      this.errorLogger.log(error);
      this.onError(error);
      return;
    }

    element.appendChild(this.iframe.make());

    this.iframeMessageManager.addListener();
  }

  public destroy(): void {
    this.iframeMessageManager.removeListener();
    this.iframe.dispose();
  }

  private messageHandler = (event: MessageEvent) => {
    const data = event.data;
    console.log("message event from iframe arrived", data);
    if (data.type === "success") {
      this.onSuccess(data.payload);
    } else if (data.type === "error") {
      this.onError(data.payload);
    }
  };
}

// Create the VerifiedInc namespace and attach to window
const VerifiedInc = {
  Client: Client,
};

// If running in the browser, attach to window
if (typeof window !== "undefined") {
  if (!window.VerifiedInc) {
    window.VerifiedInc = VerifiedInc;
  } else {
    window.VerifiedInc.Client = VerifiedInc.Client;
  }
}

export default VerifiedInc;
