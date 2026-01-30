import { ClientMessageEvent, SdkResult, SdkResultData, SdkError, SdkStep } from '@sdk/types';
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
        this.invariantMessageData(data);
        this.onResult({
          ...this.buildMessageData(data),
          type: SdkResultValues.USER_OPTED_OUT,
        });
        break;
      case PossibleEventTypes.VERIFIED_CLIENT_SDK_FORM_SUBMISSION:
        this.invariantMessageData(data);
        this.onResult({
          ...this.buildMessageData(data),
          type: SdkResultValues.USER_SHARED_CREDENTIALS,
        });
        break;
      case PossibleEventTypes.VERIFIED_CLIENT_SDK_NO_CREDENTIALS_FOUND:
        this.invariantMessageData(data);
        this.onResult({
          ...this.buildMessageData(data),
          type: SdkResultValues.NO_CREDENTIALS_FOUND,
        });
        break;
      case PossibleEventTypes.VERIFIED_CLIENT_SDK_RISK_SCORE_TOO_HIGH:
        this.invariantMessageData(data);
        this.onResult({
          ...this.buildMessageData(data),
          type: SdkResultValues.RISK_SCORE_TOO_HIGH,
        });
        break;
      case PossibleEventTypes.VERIFIED_CLIENT_SDK_MAX_INPUT_ATTEMPTS_EXCEEDED:
        this.invariantMessageData(data);
        this.onResult({
          ...this.buildMessageData(data),
          type: SdkResultValues.MAX_INPUT_ATTEMPTS_EXCEEDED,
        });
        break;
      case PossibleEventTypes.VERIFIED_CLIENT_SDK_MAX_VERIFICATION_CODE_ATTEMPTS_EXCEEDED:
        this.invariantMessageData(data);
        this.onResult({
          ...this.buildMessageData(data),
          type: SdkResultValues.MAX_VERIFICATION_CODE_ATTEMPTS_EXCEEDED,
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

  /**
   * Validates the message data.
   *
   * @param data - The message data to validate
   */
  private invariantMessageData(data: ClientMessageEvent) {
    if (
      data.type !== PossibleEventTypes.VERIFIED_CLIENT_SDK_USER_OPTED_OUT &&
      data.type !== PossibleEventTypes.VERIFIED_CLIENT_SDK_FORM_SUBMISSION &&
      data.type !== PossibleEventTypes.VERIFIED_CLIENT_SDK_NO_CREDENTIALS_FOUND &&
      data.type !== PossibleEventTypes.VERIFIED_CLIENT_SDK_RISK_SCORE_TOO_HIGH &&
      data.type !== PossibleEventTypes.VERIFIED_CLIENT_SDK_MAX_INPUT_ATTEMPTS_EXCEEDED &&
      data.type !== PossibleEventTypes.VERIFIED_CLIENT_SDK_MAX_VERIFICATION_CODE_ATTEMPTS_EXCEEDED
    ) {
      throw new Error('Invalid message type');
    }

    // Ensures data is an object
    if (
      !(
        typeof data.data === 'object' &&
        data.data !== null &&
        Object.prototype.toString.call(data.data) === '[object Object]'
      )
    ) {
      throw new Error('Invalid message data');
    }

    if (typeof data.data.redirectUrl !== 'string' && data.data.redirectUrl !== null) {
      throw new Error('Invalid redirectUrl data');
    }

    if (typeof data.data.identityUuid !== 'string' && data.data.identityUuid !== null) {
      throw new Error('Invalid identityUuid data');
    }

    if (typeof data.data.birthDate !== 'string' && data.data.birthDate !== null) {
      throw new Error('Invalid birthDate data');
    }

    if (typeof data.data.phone !== 'string' && data.data.phone !== null) {
      throw new Error('Invalid phone data');
    }

    if (typeof data.data.ssn4 !== 'string' && data.data.ssn4 !== null) {
      throw new Error('Invalid ssn4 data');
    }

    if (data.data.fullName !== null) {
      if (typeof data.data.fullName !== 'object') {
        throw new Error('Invalid fullName data');
      }

      for (const [key, value] of Object.entries(data.data.fullName)) {
        if (typeof value !== 'string' && value !== null) {
          throw new Error(`Invalid ${key} data`);
        }
      }
    }
  }

  /**
   * Builds the message data from the event.
   *
   * @param data - The ClientMessageEvent received from the iframe
   * @returns The message data
   */
  private buildMessageData(data: ClientMessageEvent) {
    return {
      redirectUrl: data.data?.redirectUrl as string | null,
      identityUuid: data.data?.identityUuid as string,
      birthDate: data.data?.birthDate as string | null,
      birthDateMismatched: data.data?.birthDateMismatched as boolean | null,
      phone: data.data?.phone as string | null,
      ssn4: data.data?.ssn4 as string | null,
      ssn4Mismatched: data.data?.ssn4Mismatched as boolean | null,
      fullName: (data.data?.fullName
        ? { firstName: (data.data.fullName as SdkResultData['fullName'])?.firstName }
        : null) as SdkResultData['fullName'],
      fullNameMismatched: data.data?.fullNameMismatched as SdkResultData['fullNameMismatched'],
      step: data.data?.step as SdkStep,
    };
  }
}
