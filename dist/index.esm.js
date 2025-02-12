var s = Object.defineProperty;
var o = (r, e, i) => e in r ? s(r, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : r[e] = i;
var n = (r, e, i) => o(r, typeof e != "symbol" ? e + "" : e, i);
class d {
  constructor(e) {
    n(this, "ready", !1);
    n(this, "iframe", null);
    n(this, "onReady");
    n(this, "onSuccess");
    n(this, "onError");
    if (this.options = e, this.onReady = e.onReady || (() => {
    }), this.onSuccess = e.onSuccess || (() => {
    }), this.onError = e.onError || (() => {
    }), !this.options.publicKey) {
      this.onError({
        reason: "INVALID_API_KEY",
        additionalData: {
          name: "InvalidApiKey",
          message: "Public key is required",
          code: 400,
          className: "InvalidApiKey",
          data: {
            errorCode: "INVALID_API_KEY"
          }
        }
      });
      return;
    }
    setTimeout(() => {
      this.ready = !0, this.onReady();
    }, 1e3);
  }
  show(e) {
    if (this.iframe) {
      this.onError({
        reason: "UNKNOWN_ERROR",
        additionalData: {
          name: "DuplicateInstance",
          message: "SDK instance already exists",
          code: 400,
          className: "DuplicateInstance",
          data: {
            errorCode: "DUPLICATE_INSTANCE"
          }
        }
      });
      return;
    }
    const i = document.createElement("iframe"), a = new URL("https://embeded.1-click.verified.inc");
    a.searchParams.append("publicKey", this.options.publicKey), i.src = a.toString(), e.appendChild(i), this.iframe = i;
  }
  destroy() {
    this.iframe && this.iframe.parentElement && (this.iframe.parentElement.removeChild(this.iframe), this.iframe = null);
  }
}
const t = {
  Client: d
};
typeof window < "u" && (window.VerifiedInc ? window.VerifiedInc.Client = t.Client : window.VerifiedInc = t);
export {
  d as ClientImpl
};
