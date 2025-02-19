import { ClientMessageEvent } from '@sdk/types';

import { parseMessageEvent } from '@sdk/client/utils/parse-message-event';
import { ErrorLogger } from '@sdk/client/logger/error-logger';
import { Iframe } from '@sdk/client/iframe/iframe';
import { IframeConfig } from '@sdk/client/iframe/iframe-config';

interface IframeMessageManagerOptions {
  onMessage: (data: ClientMessageEvent, event: MessageEvent) => void;
  iframe: Iframe;
  iframeConfig: IframeConfig;
}

export class IframeMessageManager {
  private readonly logger = new ErrorLogger();
  private readonly iframe: Iframe;
  private readonly iframeConfig: IframeConfig;
  private readonly onMessage: (data: ClientMessageEvent, event: MessageEvent) => void;

  constructor({ onMessage, iframe, iframeConfig }: IframeMessageManagerOptions) {
    this.onMessage = onMessage;
    this.iframeConfig = iframeConfig;
    this.iframe = iframe;
  }

  addListener() {
    window.addEventListener('message', this.handleMessage);
  }

  removeListener() {
    window.removeEventListener('message', this.handleMessage);
  }

  /**
   * Handles the message event from the iframe.
   *
   * @param event - The MessageEvent received from the iframe
   * @returns
   */
  private handleMessage = (event: MessageEvent) => {
    const data = parseMessageEvent(event);

    // Return if the event is not valid
    if (!data) return;

    // Sort-circuit if the event is not from the expected origin or iframe
    if (
      event.origin !== this.iframeConfig.origin ||
      (this.iframe.element && event.source !== this.iframe.element.contentWindow)
    ) {
      return this.logger.log('Event sent from an invalid origin');
    }

    // Ensure the event is from the iframe
    if (event?.data?.source !== this.iframeConfig.eventSource) return;

    const messageTime = new Date(event.data.timestamp);
    const secondAgo = new Date(Date.now() - 1 * 1000);

    // Prevent replay attacks.
    if (messageTime < secondAgo) return;

    // After all checks are passed, call the onMessage handler
    this.onMessage(data, event);
  };
}
