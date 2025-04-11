import { SdkErrorReasons } from '@sdk/values';

export class SdkErrorClass extends Error {
  public readonly reason: keyof typeof SdkErrorReasons;

  constructor(reason: keyof typeof SdkErrorReasons) {
    super(reason);
    this.reason = reason;
  }
}
