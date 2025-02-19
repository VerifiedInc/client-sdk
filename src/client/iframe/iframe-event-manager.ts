import { ClientMessageEvent, OneClickError, OneClickResponseData } from '@sdk/types';

import { ErrorAdditionalData } from '@sdk/errors/one-click-error';

import { Iframe } from '@sdk/client/iframe/iframe';
import { IframeConfig } from '@sdk/client/iframe/iframe-config';
import { IframeMessageManager } from '@sdk/client/iframe/iframe-message-manager';

import { ViewportResizeEvent } from '@sdk/client/iframe/events/viewport-resize.event';
import { ViewportReadyEvent } from '@sdk/client/iframe/events/viewport-ready.event';

export interface IframeEventManagerOptions {
  iframe: Iframe;
  iframeConfig: IframeConfig;
  onSuccess: (data: OneClickResponseData) => void;
  onError: (error: OneClickError) => void;
}
export class IframeEventManager {
  private readonly iframe: Iframe;
  private readonly iframeMessageManager: IframeMessageManager;
  private readonly onSuccess: (data: OneClickResponseData) => void;
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
      case 'VERIFIED_INC_CLIENT_SDK_VIEWPORT_READY':
        new ViewportReadyEvent(this.iframe).handle(data.data as unknown as DOMRect);
        break;
      case 'VERIFIED_INC_CLIENT_SDK_VIEWPORT_RESIZE':
        new ViewportResizeEvent(this.iframe).handle(data.data as unknown as DOMRect);
        break;
      case 'VERIFIED_INC_CLIENT_SDK_FORM_SUBMISSION':
        this.onSuccess(data.data as OneClickResponseData);
        break;
      case 'VERIFIED_INC_CLIENT_SDK_FORM_SUBMISSION_ERROR':
        this.onError(
          new OneClickError('UNKNOWN_ERROR', data.data as unknown as ErrorAdditionalData)
        );
        break;
    }
  }
}
