export type OptedOutEventHandleData = { redirectUrl: string };

export class OptedOutEvent {
  handle(data: OptedOutEventHandleData): void {
    window.location.href = data.redirectUrl;
  }
}
