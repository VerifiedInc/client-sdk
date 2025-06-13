import { ClientMessageEvent, SdkResult, SdkError } from '@sdk/types';
import { SdkErrorReasons, PossibleEventTypes, SdkResultValues } from '@sdk/values';

import { Iframe } from '@sdk/client/iframe/iframe';
import { IframeConfig } from '@sdk/client/iframe/iframe-config';
import { IframeMessageManager } from '@sdk/client/iframe/iframe-message-manager';

import { ViewportResizeEvent } from '@sdk/client/iframe/events/viewport-resize.event';
import { ViewportReadyEvent } from '@sdk/client/iframe/events/viewport-ready.event';

export interface IframeEventManagerOptions {
  iframe: Iframe;
  iframeConfig: IframeConfig;
  onResult: (data: SdkResult) => void;
  onError: (error: SdkError) => void;
}
export class IframeEventManager {
  private readonly iframe: Iframe;
  private readonly iframeMessageManager: IframeMessageManager;
  private readonly onResult: (data: SdkResult) => void;
  private readonly onError: (error: SdkError) => void;

  constructor(options: IframeEventManagerOptions) {
    this.iframe = options.iframe;
    this.iframeMessageManager = new IframeMessageManager({
      iframe: options.iframe,
      iframeConfig: options.iframeConfig,
      onMessage: this.handleMessage.bind(this),
    });
    this.onResult = options.onResult;
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
        this.onResult({
          type: SdkResultValues.USER_OPTED_OUT,
          redirectUrl: data?.data?.redirectUrl as string | null,
          identityUuid: data?.data?.identityUuid as string | null,
          birthDate: data?.data?.birthDate as string | null,
          phone: data?.data?.phone as string | null,
          ssn4: data?.data?.ssn4 as string | null,
        });
        break;
      case PossibleEventTypes.VERIFIED_CLIENT_SDK_FORM_SUBMISSION:
        this.onResult({
          type: SdkResultValues.USER_SHARED_CREDENTIALS,
          redirectUrl: data?.data?.redirectUrl as string | null,
          identityUuid: data?.data?.identityUuid as string,
          birthDate: data?.data?.birthDate as string | null,
          phone: data?.data?.phone as string | null,
          ssn4: data?.data?.ssn4 as string | null,
        });
        break;
      case PossibleEventTypes.VERIFIED_CLIENT_SDK_FORM_SUBMISSION_ERROR:
        this.onError({ reason: SdkErrorReasons.SHARE_CREDENTIALS_ERROR });
        break;
      case PossibleEventTypes.VERIFIED_CLIENT_SDK_INVALID_SESSION_KEY:
        this.onError({ reason: SdkErrorReasons.INVALID_SESSION_KEY });
        break;
      case PossibleEventTypes.VERIFIED_CLIENT_SDK_SESSION_TIMEOUT:
        this.onError({ reason: SdkErrorReasons.SESSION_TIMEOUT });
        break;
    }
  }
}
