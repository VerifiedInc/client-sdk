import { type SdkErrorReasonsType } from '@sdk/values';

export class SdkError extends Error {
  public readonly reason: SdkErrorReasonsType;

  constructor(reason: SdkErrorReasonsType) {
    super(reason);
    this.reason = reason;
  }
}
