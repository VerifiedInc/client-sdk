import { IframeConfig } from '@sdk/client/iframe/iframe-config';

import { Loader } from '@sdk/client/loader/loader';

export class Iframe {
  public element: HTMLIFrameElement | null = null;
  public loader: Loader | null = null;
  private readonly iframeConfig: IframeConfig;

  constructor(iframeConfig: IframeConfig) {
    this.iframeConfig = iframeConfig;
  }

  public make(parent: HTMLElement): HTMLIFrameElement {
    // Add spinner styles to document head
    const container = document.createElement('div');
    container.classList.add('sdk-iframe-container');
    container.style.cssText = 'position: relative;';

    // Create SVG loader container
    this.loader = new Loader();
    this.loader.make(container);

    const iframe = document.createElement('iframe');
    iframe.src = this.iframeConfig.url.toString();

    // Default security configurations
    const defaultAttributes = {
      title: 'Client SDK Iframe',
      security: 'restricted',
      loading: 'eager',
      referrerpolicy: 'no-referrer',
      sandbox:
        'allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation',
      style:
        'display: block; border: none; width: 100%; height: 100%; min-height: 326px; max-width: 396px; min-width: min(396px, 100%); overflow: hidden; margin: auto;',
    };

    // Apply default attributes
    Object.entries(defaultAttributes).forEach(([key, value]) => {
      iframe.setAttribute(key, value);
    });

    // Add load event listener to hide spinner when iframe is loaded
    iframe.addEventListener('load', () => {
      // Remove loader
      this.loader?.dispose();
    });

    this.element = iframe;

    // Order matters
    container.appendChild(iframe);
    parent.appendChild(container);

    return this.element;
  }

  public dispose(): void {
    if (this.element?.parentElement) {
      // Remove container div from the DOM
      this.element.parentElement?.remove();
    }

    if (this.loader) {
      this.loader?.dispose();
    }

    this.element = null;
    this.loader = null;
  }
}
