import { EventSource, PossibleEventTypes, SdkErrorReasons, SdkResultValues } from '@sdk/values';

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

export type SdkStep = 'consent' | 'phone' | 'verificationCode' | 'birthday' | 'ssn4' | 'info';

type SdkResultData = {
  identityUuid: string;
  redirectUrl: string | null;
  birthDate: string | null;
  birthDateMismatched: boolean | null;
  phone: string | null;
  ssn4: string | null;
  ssn4Mismatched: boolean | null;
  step: SdkStep;
};

type SdkResultDataNullable = Nullable<SdkResultData>;

type SdkResultUserOptedOut =
  | (SdkResultDataNullable & {
      type: typeof SdkResultValues.USER_OPTED_OUT;
      step: 'phone';
    })
  | (SdkResultData & {
      type: typeof SdkResultValues.USER_OPTED_OUT;
      step: Exclude<SdkStep, 'phone'>;
    });

type SdkResultNoCredentialsFound = {
  type: typeof SdkResultValues.NO_CREDENTIALS_FOUND;
} & SdkResultData;

type SdkResultRiskScoreTooHigh = {
  type: typeof SdkResultValues.RISK_SCORE_TOO_HIGH;
} & SdkResultData;

type SdkResultMaxInputsAttemptsExceeded = {
  type: typeof SdkResultValues.MAX_INPUT_ATTEMPTS_EXCEEDED;
} & SdkResultData;

type SdkResultMaxOtpAttemptsExceeded = {
  type: typeof SdkResultValues.MAX_OTP_ATTEMPTS_EXCEEDED;
} & SdkResultData;

type SdkResultUserSharedCredentials = {
  type: typeof SdkResultValues.USER_SHARED_CREDENTIALS;
} & SdkResultData;

export type SdkResult =
  | SdkResultUserOptedOut
  | SdkResultNoCredentialsFound
  | SdkResultRiskScoreTooHigh
  | SdkResultMaxInputsAttemptsExceeded
  | SdkResultMaxOtpAttemptsExceeded
  | SdkResultUserSharedCredentials;

export type SdkError = {
  reason: (typeof SdkErrorReasons)[keyof typeof SdkErrorReasons];
};

export interface ClientMessageEvent {
  type: (typeof PossibleEventTypes)[keyof typeof PossibleEventTypes];
  data: Record<string, unknown> | null;
  source: typeof EventSource;
  timestamp: number;
}
