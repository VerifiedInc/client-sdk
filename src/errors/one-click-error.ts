import { ErrorReasons } from "@sdk/values";

interface ErrorAdditionalData {
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
  public readonly additionalData?: ErrorAdditionalData;

  constructor(
    reason: (typeof ErrorReasons)[keyof typeof ErrorReasons],
    additionalData?: ErrorAdditionalData
  ) {
    super(additionalData?.message || reason);
    this.reason = reason;
    this.additionalData = additionalData;
  }
}
