import { IframeConfig } from '@sdk/client/iframe/iframe-config';

import { Loader } from '@sdk/client/loader/loader';

// CSS classes for iframe and container — avoids inline style attributes for CSP compliance
const iframeStyles = `
  .sdk-iframe-container {
    position: relative;
  }

  .sdk-iframe {
    display: block;
    border: none;
    width: 100%;
    height: 100%;
    min-height: 326px;
    max-width: 396px;
    min-width: min(396px, 100%);
    overflow: hidden;
    margin: auto;
  }
`;

export class Iframe {
  public element: HTMLIFrameElement | null = null;
  public loader: Loader | null = null;
  private readonly iframeConfig: IframeConfig;
  private styleElement: HTMLStyleElement | null = null;

  constructor(iframeConfig: IframeConfig) {
    this.iframeConfig = iframeConfig;
  }

  public make(parent: HTMLElement): HTMLIFrameElement {
    // Inject styles via <style> element for CSP compliance
    this.styleElement = document.createElement('style');
    const nonce = document
      .querySelector('meta[property="csp-nonce"]')
      ?.getAttribute('content');
    if (nonce) this.styleElement.setAttribute('nonce', nonce);
    this.styleElement.textContent = iframeStyles;
    document.head.appendChild(this.styleElement);

    const container = document.createElement('div');
    container.classList.add('sdk-iframe-container');

    // Create SVG loader container
    this.loader = new Loader();
    this.loader.make(container);

    const iframe = document.createElement('iframe');
    iframe.src = this.iframeConfig.url.toString();
    iframe.classList.add('sdk-iframe');

    // Security attributes (non-style)
    iframe.setAttribute('title', 'Client SDK Iframe');
    iframe.setAttribute('security', 'restricted');
    iframe.setAttribute('loading', 'eager');
    iframe.setAttribute('referrerpolicy', 'no-referrer');
    iframe.setAttribute(
      'sandbox',
      'allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation',
    );

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

    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }

    this.element = null;
    this.loader = null;
  }
}
