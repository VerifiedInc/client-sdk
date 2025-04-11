import { SdkError, SdkResult } from '@sdk/types';
import { SdkErrorReasons } from '@sdk/values';

import { ClientOptions, ClientInterface } from '@sdk/client/types';

import { Iframe } from '@sdk/client/iframe/iframe';
import { IframeConfig } from '@sdk/client/iframe/iframe-config';
import { IframeEventManager } from '@sdk/client/iframe/iframe-event-manager';

export class VerifiedClientSdk implements ClientInterface {
  private readonly iframe: Iframe;
  private readonly iframeConfig: IframeConfig;
  private readonly iframeEventManager: IframeEventManager;

  public ready: boolean = false;
  private resulted: boolean = false;
  private destroyed: boolean = false;
  private readonly onResult: (data: SdkResult) => void;
  private readonly onError: (error: SdkError) => void;

  constructor(private options: ClientOptions) {
    this.onResult = options.onResult || (() => {});
    this.onError = options.onError || (() => {});

    this.iframeConfig = new IframeConfig(options.sessionKey, options.environment);
    this.iframe = new Iframe(this.iframeConfig);
    this.iframeEventManager = new IframeEventManager({
      iframe: this.iframe,
      iframeConfig: this.iframeConfig,
      onResult: (...args) => {
        if (this.resulted) return;
        this.resulted = true;
        this.onResult(...args);
      },
      onError: this.onError,
    });

    // Return if the session key is not provided, another instance will have to be created.
    if (!this.options.sessionKey || typeof this.options.sessionKey !== 'string') {
      this.onError({ reason: SdkErrorReasons.INVALID_SESSION_KEY });
      return;
    }

    this.ready = true;
  }

  public show(element?: HTMLElement): void {
    if (!this.ready || this.destroyed || this.iframe.element) return;
    this.iframe.make(element || document.body);
    this.iframeEventManager.addListener();
  }

  public destroy(): void {
    if (!this.ready || this.destroyed) return;
    this.destroyed = true;
    this.iframeEventManager.removeListener();
    this.iframe.dispose();
  }
}

// Create the Verified namespace and attach to window
const Verified = {
  Client: VerifiedClientSdk,
};

// If running in the browser, attach to window
if (typeof window !== 'undefined') {
  if (!window.Verified) {
    window.Verified = Verified;
  } else {
    window.Verified.Client = Verified.Client;
  }
}

export default Verified;
