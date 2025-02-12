export const enum ErrorReasons {
  DUPLICATE_IFRAME_ATTEMPT = "DUPLICATE_IFRAME_ATTEMPT",
  SESSION_TIMEOUT = "SESSION_TIMEOUT",
  NETWORK_CONNECTIVITY_ISSUE = "NETWORK_CONNECTIVITY_ISSUE",
  INVALID_API_KEY = "INVALID_API_KEY",
  SHARE_CREDENTIALS_ERROR = "SHARE_CREDENTIALS_ERROR",
  BIRTHDATE_MISMATCH = "BIRTHDATE_MISMATCH",
  SSN4_MISMATCH = "SSN4_MISMATCH",
  ADDITIONAL_DATA_EXCEEDED_ATTEMPTS = "ADDITIONAL_DATA_EXCEEDED_ATTEMPTS",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface OneClickError {
  reason: ErrorReasons;
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
