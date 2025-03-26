import { ClientMessageEvent, OneClickError, SuccessEventResponseData } from '@sdk/types';
import { ErrorReasons, PossibleEventTypes } from '@sdk/values';

import { ErrorAdditionalData } from '@sdk/errors/one-click-error';

import { Iframe } from '@sdk/client/iframe/iframe';
import { IframeConfig } from '@sdk/client/iframe/iframe-config';
import { IframeMessageManager } from '@sdk/client/iframe/iframe-message-manager';

import { ViewportResizeEvent } from '@sdk/client/iframe/events/viewport-resize.event';
import { ViewportReadyEvent } from '@sdk/client/iframe/events/viewport-ready.event';
import {
  OptedOutEvent,
  type OptedOutEventHandleData,
} from '@sdk/client/iframe/events/opted-out.event';

export interface IframeEventManagerOptions {
  iframe: Iframe;
  iframeConfig: IframeConfig;
  onSuccess: (data: SuccessEventResponseData) => void;
  onError: (error: OneClickError) => void;
}
export class IframeEventManager {
  private readonly iframe: Iframe;
  private readonly iframeMessageManager: IframeMessageManager;
  private readonly onSuccess: (data: SuccessEventResponseData) => void;
  private readonly onError: (error: OneClickError) => void;

  constructor(options: IframeEventManagerOptions) {
    this.iframe = options.iframe;
    this.iframeMessageManager = new IframeMessageManager({
      iframe: options.iframe,
      iframeConfig: options.iframeConfig,
      onMessage: this.handleMessage.bind(this),
    });
    this.onSuccess = options.onSuccess;
    this.onError = options.onError;
  }

  addListener() {
    this.iframeMessageManager.addListener();
  }

  removeListener() {
    this.iframeMessageManager.removeListener();
  }

  private handleMessage(data: ClientMessageEvent): void {
    switch (data.type) {
      case PossibleEventTypes.VERIFIED_CLIENT_SDK_VIEWPORT_READY:
        new ViewportReadyEvent(this.iframe).handle(data.data as unknown as DOMRect);
        break;
      case PossibleEventTypes.VERIFIED_CLIENT_SDK_VIEWPORT_RESIZE:
        new ViewportResizeEvent(this.iframe).handle(data.data as unknown as DOMRect);
        break;
      case PossibleEventTypes.VERIFIED_CLIENT_SDK_USER_OPTED_OUT:
        new OptedOutEvent().handle(data.data as OptedOutEventHandleData);
        break;
      case PossibleEventTypes.VERIFIED_CLIENT_SDK_FORM_SUBMISSION:
        this.onSuccess(data.data as SuccessEventResponseData);
        break;
      case PossibleEventTypes.VERIFIED_CLIENT_SDK_FORM_SUBMISSION_ERROR:
        this.onError(
          new OneClickError(
            ErrorReasons.SHARE_CREDENTIALS_ERROR,
            data.data as unknown as ErrorAdditionalData
          )
        );
        break;
      case PossibleEventTypes.VERIFIED_CLIENT_SDK_INVALID_SESSION_KEY:
        this.onError(
          new OneClickError(
            ErrorReasons.INVALID_SESSION_KEY,
            data.data as unknown as ErrorAdditionalData
          )
        );
        break;
      case PossibleEventTypes.VERIFIED_CLIENT_SDK_SESSION_TIMEOUT:
        this.onError(
          new OneClickError(
            ErrorReasons.SESSION_TIMEOUT,
            data.data as unknown as ErrorAdditionalData
          )
        );
        break;
    }
  }
}
