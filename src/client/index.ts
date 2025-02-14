import { OneClickError, OneClickResponseData } from "@sdk/types";
import { ErrorReasons } from "@sdk/values";

import { ClientOptions, ClientInterface } from "@sdk/client/types";
import { ErrorLogger } from "@sdk/client/logger/error-logger";

import { Iframe } from "@sdk/client/iframe/iframe";
import { IframeConfig } from "@sdk/client/iframe/iframe-config";
import { IframeEventManager } from "@sdk/client/iframe/iframe-event-manager";

export class Client implements ClientInterface {
  private readonly errorLogger = new ErrorLogger();
  private readonly iframe: Iframe;
  private readonly iframeConfig: IframeConfig;
  private readonly iframeEventManager: IframeEventManager;

  public ready: boolean = false;
  private readonly onReady: () => void;
  private readonly onSuccess: (data: OneClickResponseData) => void;
  private readonly onError: (error: OneClickError) => void;

  constructor(private options: ClientOptions) {
    this.onReady = options.onReady || (() => {});
    this.onSuccess = options.onSuccess || (() => {});
    this.onError = options.onError || (() => {});

    this.iframeConfig = new IframeConfig(
      options.publicKey,
      options.environment
    );
    this.iframe = new Iframe(this.iframeConfig);
    this.iframeEventManager = new IframeEventManager({
      iframe: this.iframe,
      iframeConfig: this.iframeConfig,
      onSuccess: this.onSuccess,
      onError: this.onError,
    });

    // Return if the public key is not provided, another instance will have to be created
    if (
      !this.options.publicKey ||
      typeof this.options.publicKey !== "string" ||
      !this.options.publicKey.trim().startsWith("pub_")
    ) {
      this.onError(
        new OneClickError(ErrorReasons.INVALID_API_KEY, {
          name: "InvalidApiKey",
          message: "Invalid API key",
          code: 400,
          className: "InvalidApiKey",
          data: {
            errorCode: "INVALID_API_KEY",
          },
        })
      );
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
    // Return if the iframe is already created, callback with error
    if (this.iframe.element) {
      const error = new OneClickError(ErrorReasons.DUPLICATE_IFRAME_ATTEMPT);
      this.errorLogger.log(error);
      this.onError(error);
      return;
    }
    this.iframe.make(element);
    this.iframeEventManager.addListener();
  }

  public destroy(): void {
    this.iframeEventManager.removeListener();
    this.iframe.dispose();
  }
}

// Create the Verified namespace and attach to window
const Verified = {
  Client: Client,
};

// If running in the browser, attach to window
if (typeof window !== "undefined") {
  if (!window.Verified) {
    window.Verified = Verified;
  } else {
    window.Verified.Client = Verified.Client;
  }
}

export default Verified;
