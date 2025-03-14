import { ErrorReasons } from '@sdk/values';

// This is the core-service additional data error structure, but only with the important properties included.
export interface ErrorAdditionalData {
  name: string;
  message: string;
  code: number;
  className: string;
  data: {
    errorCode: string;
  };
}

export class OneClickError extends Error {
  public readonly reason: (typeof ErrorReasons)[keyof typeof ErrorReasons];
  public readonly additionalData?: ErrorAdditionalData | null;

  constructor(
    reason: (typeof ErrorReasons)[keyof typeof ErrorReasons],
    additionalData?: ErrorAdditionalData | null
  ) {
    super(additionalData?.message || reason);
    this.reason = reason;
    this.additionalData = additionalData;
  }
}
