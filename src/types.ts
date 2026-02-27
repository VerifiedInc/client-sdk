import {
  EventSource,
  PossibleEventTypes,
  SdkErrorReasons,
  SdkEventValues,
  SdkResultValues,
} from '@sdk/values';

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

export type SdkStep =
  | 'consent'
  | 'phone'
  | 'verificationCode'
  | 'birthday'
  | 'ssn4'
  | 'fullName.firstName'
  | 'info';

export type SdkResultData = {
  identityUuid: string;
  redirectUrl: string | null;
  birthDate: string | null;
  birthDateMismatched: boolean | null;
  phone: string | null;
  ssn4: string | null;
  ssn4Mismatched: boolean | null;
  fullName: {
    firstName: string | null;
  } | null;
  fullNameMismatched: boolean | null;
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

type SdkResultNoInsuranceFound = {
  type: typeof SdkResultValues.NO_INSURANCE_FOUND;
} & SdkResultData;

type SdkResultRiskScoreTooHigh = {
  type: typeof SdkResultValues.RISK_SCORE_TOO_HIGH;
} & SdkResultData;

type SdkResultMaxInputsAttemptsExceeded = {
  type: typeof SdkResultValues.MAX_INPUT_ATTEMPTS_EXCEEDED;
} & SdkResultData;

type SdkResultMaxVerificationCodeAttemptsExceeded = {
  type: typeof SdkResultValues.MAX_VERIFICATION_CODE_ATTEMPTS_EXCEEDED;
} & SdkResultData;

type SdkResultUserSharedCredentials = {
  type: typeof SdkResultValues.USER_SHARED_CREDENTIALS;
} & SdkResultData;

export type SdkResultUserSharedHealthData = {
  type: typeof SdkResultValues.USER_SHARED_HEALTH_DATA;
  healthDataUuid: string;
} & SdkResultData;

export type SdkResult =
  | SdkResultUserOptedOut
  | SdkResultNoCredentialsFound
  | SdkResultNoInsuranceFound
  | SdkResultRiskScoreTooHigh
  | SdkResultMaxInputsAttemptsExceeded
  | SdkResultMaxVerificationCodeAttemptsExceeded
  | SdkResultUserSharedCredentials
  | SdkResultUserSharedHealthData;

export type SdkError = {
  reason: (typeof SdkErrorReasons)[keyof typeof SdkErrorReasons];
};

export interface ClientMessageEvent {
  type: (typeof PossibleEventTypes)[keyof typeof PossibleEventTypes];
  data: Record<string, unknown> | null;
  source: typeof EventSource;
  timestamp: number;
}

// -- SDK Event types --

export type SdkProduct = '1-click-signup' | '1-click-health';

export type SdkHealthInsurance = {
  memberId: string;
  payer?: {
    name: string;
    verifiedId: string;
    logoUrl?: string;
  };
};

export type SdkMetadata = {
  identityUuid: string | null;
  redirectUrl: string | null;
  birthDate: string | null;
  birthDateMismatched: boolean | null;
  phone: string | null;
  ssn4: string | null;
  ssn4Mismatched: boolean | null;
  fullName: {
    firstName: string | null;
  } | null;
  fullNameMismatched: boolean | null;
  step: SdkStep;
};

type SdkEventData<EventData> = {
  metadata: SdkMetadata;
} & EventData;

type SdkReadyEvent = {
  type: typeof SdkEventValues.SDK_READY;
};

type UserStepChangeEvent = {
  type: typeof SdkEventValues.USER_STEP_CHANGE;
  step: SdkStep;
  previousStep?: SdkStep;
};

type StepTimeSpentEvent = {
  type: typeof SdkEventValues.STEP_TIME_SPENT;
  step: SdkStep;
  durationMs: number;
};

type UserCompletedProductEvent = {
  type: typeof SdkEventValues.USER_COMPLETED_PRODUCT;
  product: SdkProduct;
};

type OneClickSignupFormSubmittedEvent = {
  type: typeof SdkEventValues.ONE_CLICK_SIGNUP_FORM_SUBMITTED;
  form: Record<string, unknown>;
};

type OneClickHealthFormSubmittedEvent = {
  type: typeof SdkEventValues.ONE_CLICK_HEALTH_FORM_SUBMITTED;
  form: { healthInsurance: Array<SdkHealthInsurance> };
};

type SdkEvents =
  | SdkReadyEvent
  | UserStepChangeEvent
  | StepTimeSpentEvent
  | UserCompletedProductEvent
  | OneClickSignupFormSubmittedEvent
  | OneClickHealthFormSubmittedEvent;

export type SdkEvent = SdkEventData<SdkEvents>;
