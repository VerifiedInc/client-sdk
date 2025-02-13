import { ErrorReasons, PossibleEventTypes } from "@sdk/values";

export interface OneClickError {
  reason: (typeof ErrorReasons)[keyof typeof ErrorReasons];
  additionalData: {
    name: string;
    message: string;
    code: number;
    className: string;
    data: {
      errorCode: string;
    };
  };
}

export interface OneClickResponseData {
  // Add response data fields here as needed
}

export interface ClientMessageEvent {
  type: (typeof PossibleEventTypes)[keyof typeof PossibleEventTypes];
  data: Record<string, unknown> | null;
  source: "VerifiedInc.Client";
  timestamp: number;
}
