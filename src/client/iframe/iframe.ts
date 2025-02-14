import { IframeConfig } from "@sdk/client/iframe/iframe-config";

export class Iframe {
  public element: HTMLIFrameElement | null = null;
  private readonly iframeConfig: IframeConfig;

  constructor(iframeConfig: IframeConfig) {
    this.iframeConfig = iframeConfig;
  }

  public make(parent: HTMLElement): HTMLIFrameElement {
    const iframe = document.createElement("iframe");
    iframe.src = this.iframeConfig.url.toString();

    // Default security configurations
    const defaultAttributes = {
      title: "Client SDK Iframe",
      security: "restricted",
      loading: "eager",
      referrerpolicy: "no-referrer",
      allow: "camera 'none'; microphone 'none'; geolocation 'none'",
      sandbox:
        "allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation",
      style:
        "display: none; border: none; width: 100%; height: 100%; max-width: 500px; min-width: min(500px, 100%); overflow: hidden; margin: auto;",
    };

    // Apply default attributes
    Object.entries(defaultAttributes).forEach(([key, value]) => {
      iframe.setAttribute(key, value);
    });

    this.element = iframe;
    parent.appendChild(this.element);

    return this.element;
  }

  public dispose(): void {
    if (this.element && this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
    }

    this.element = null;
  }
}
