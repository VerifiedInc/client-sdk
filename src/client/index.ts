import { OneClickError, OneClickResponseData, ErrorReasons } from "@sdk/types";
import { ClientOptions, ClientInterface } from "./types";

export class Client implements ClientInterface {
  public ready: boolean = false;

  private iframe: HTMLIFrameElement | null = null;
  private readonly logName = "VerifiedInc Client SDK";
  private readonly onReady: () => void;
  private readonly onSuccess: (data: OneClickResponseData) => void;
  private readonly onError: (error: OneClickError) => void;

  constructor(private options: ClientOptions) {
    this.onReady = options.onReady || (() => {});
    this.onSuccess = options.onSuccess || (() => {});
    this.onError = options.onError || (() => {});

    if (!this.options.publicKey) {
      this.onError({
        reason: ErrorReasons.INVALID_API_KEY,
        additionalData: {
          name: "InvalidApiKey",
          message: "Public key is required",
          code: 400,
          className: "InvalidApiKey",
          data: {
            errorCode: "INVALID_API_KEY",
          },
        },
      });
      return;
    }

    // Mock async initialization
    setTimeout(() => {
      this.ready = true;
      // Optionally notify success
      this.onReady();
    }, 1000);
  }

  public show(element: HTMLElement): void {
    if (this.iframe) {
      this.logError({
        reason: ErrorReasons.DUPLICATE_IFRAME_ATTEMPT,
        additionalData: {
          name: "DuplicateIframe",
          message: "SDK iframe already exists",
          code: 400,
          className: "DuplicateIframe",
          data: {
            errorCode: "DUPLICATE_IFRAME_ATTEMPT",
          },
        },
      });
      this.onError({
        reason: ErrorReasons.DUPLICATE_IFRAME_ATTEMPT,
        additionalData: {
          name: "DuplicateIframe",
          message: "SDK iframe already exists",
          code: 400,
          className: "DuplicateIframe",
          data: {
            errorCode: "DUPLICATE_IFRAME_ATTEMPT",
          },
        },
      });
      return;
    }

    const iframe = document.createElement("iframe");
    const url = new URL("https://embeded.1-click.verified.inc");
    url.searchParams.append("publicKey", this.options.publicKey);

    iframe.src = url.toString();
    element.appendChild(iframe);
    this.iframe = iframe;
  }

  public destroy(): void {
    if (this.iframe && this.iframe.parentElement) {
      this.iframe.parentElement.removeChild(this.iframe);
      this.iframe = null;
    }
  }

  private logError(message?: any, ...optionalParams: any[]): void {
    console.error(this.logName + ": ", message, ...optionalParams);
  }
}

// Create the VerifiedInc namespace and attach to window
const VerifiedInc = {
  Client: Client,
};

// If running in the browser, attach to window
if (typeof window !== "undefined") {
  if (!window.VerifiedInc) {
    window.VerifiedInc = VerifiedInc;
  } else {
    window.VerifiedInc.Client = VerifiedInc.Client;
  }
}

export default VerifiedInc;
