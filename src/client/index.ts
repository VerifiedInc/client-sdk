import { OneClickError, SuccessEventResponseData } from '@sdk/types';
import { ErrorReasons } from '@sdk/values';
import { ClientError } from '@sdk/errors';

import { ClientOptions, ClientInterface } from '@sdk/client/types';
import { ErrorLogger } from '@sdk/client/logger/error-logger';

import { Iframe } from '@sdk/client/iframe/iframe';
import { IframeConfig } from '@sdk/client/iframe/iframe-config';
import { IframeEventManager } from '@sdk/client/iframe/iframe-event-manager';

export class Client implements ClientInterface {
  private readonly errorLogger = new ErrorLogger();
  private readonly iframe: Iframe;
  private readonly iframeConfig: IframeConfig;
  private readonly iframeEventManager: IframeEventManager;

  public ready: boolean = false;
  private destroyed: boolean = false;
  private readonly onSuccess: (data: SuccessEventResponseData) => void;
  private readonly onError: (error: OneClickError) => void;

  constructor(private options: ClientOptions) {
    this.onSuccess = options.onSuccess || (() => {});
    this.onError = options.onError || (() => {});

    this.iframeConfig = new IframeConfig(options.sessionKey, options.environment);
    this.iframe = new Iframe(this.iframeConfig);
    this.iframeEventManager = new IframeEventManager({
      iframe: this.iframe,
      iframeConfig: this.iframeConfig,
      onSuccess: this.onSuccess,
      onError: this.onError,
    });

    // Return if the session key is not provided, another instance will have to be created.
    if (!this.options.sessionKey || typeof this.options.sessionKey !== 'string') {
      this.onError(
        new OneClickError(ErrorReasons.INVALID_SESSION_KEY, {
          name: 'InvalidSessionKey',
          message: 'Invalid session key',
          code: 400,
          className: 'InvalidSessionKey',
          data: {
            errorCode: 'INVALID_SESSION_KEY',
          },
        })
      );
      return;
    }

    this.ready = true;
  }

  public show(element: HTMLElement): void {
    if (this.destroyed) throw new ClientError(ErrorReasons.CLIENT_INSTANCE_ALREADY_DESTROYED);
    if (!this.ready) return;
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
    if (this.destroyed) throw new ClientError(ErrorReasons.CLIENT_INSTANCE_ALREADY_DESTROYED);
    if (!this.ready) return;

    this.destroyed = true;

    this.iframeEventManager.removeListener();
    this.iframe.dispose();
  }
}

// Create the Verified namespace and attach to window
const Verified = {
  Client: Client,
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
