import { EventSource, PossibleEventTypes, SdkErrorReasons, SdkResultValues } from '@sdk/values';

export type SdkResult =
  | {
      type: typeof SdkResultValues.USER_SHARED_CREDENTIALS;
      identityUuid: string;
      redirectUrl: string | null;
      birthDate: string | null;
      phone: string | null;
      ssn4: string | null;
    }
  | {
      type: typeof SdkResultValues.USER_OPTED_OUT;
      identityUuid: string | null;
      redirectUrl: string | null;
      birthDate: string | null;
      phone: string | null;
      ssn4: string | null;
    };

export type SdkError = {
  reason: (typeof SdkErrorReasons)[keyof typeof SdkErrorReasons];
};

export interface ClientMessageEvent {
  type: (typeof PossibleEventTypes)[keyof typeof PossibleEventTypes];
  data: Record<string, unknown> | null;
  source: typeof EventSource;
  timestamp: number;
}
