import { SdkErrorReasons } from '@sdk/values';

export class SdkError extends Error {
  public readonly reason: keyof typeof SdkErrorReasons;

  constructor(reason: keyof typeof SdkErrorReasons) {
    super(reason);
    this.reason = reason;
  }
}
