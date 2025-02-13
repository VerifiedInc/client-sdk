import { OneClickError, OneClickResponseData } from "@sdk/types";

import { Iframe } from "@sdk/client/iframe/iframe";
import { IframeConfig } from "@sdk/client/iframe/iframe-config";
import { IframeMessageManager } from "@sdk/client/iframe/iframe-message-manager";

export interface IframeEventManagerOptions {
  iframe: Iframe;
  iframeConfig: IframeConfig;
  onSuccess: (data: OneClickResponseData) => void;
  onError: (error: OneClickError) => void;
}
export class IframeEventManager {
  private readonly iframeMessageManager: IframeMessageManager;
  private readonly onSuccess: (data: OneClickResponseData) => void;
  private readonly onError: (error: OneClickError) => void;

  constructor(options: IframeEventManagerOptions) {
    this.iframeMessageManager = new IframeMessageManager({
      iframe: options.iframe,
      iframeConfig: options.iframeConfig,
      onMessage: this.onMessage.bind(this),
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

  private readonly onMessage = (event: MessageEvent) => {
    const data = event.data;
    console.log("message event from iframe arrived", data);
    if (data.type === "success") {
      this.onSuccess(data.payload);
    } else if (data.type === "error") {
      this.onError(data.payload);
    }
  };
}
