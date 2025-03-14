export type OptedOutEventHandleData = { redirectUrl: string };

export class OptedOutEvent {
  handle(data: OptedOutEventHandleData) {
    window.location.href = data.redirectUrl;
  }
}
