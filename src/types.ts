import { EventSource, PossibleEventTypes, SdkErrorReasons, SdkResultValues } from '@sdk/values';

export type SdkResult =
  | {
      type: typeof SdkResultValues.USER_SHARED_CREDENTIALS;
      identityUuid: string;
    }
  | {
      type: typeof SdkResultValues.USER_OPTED_OUT;
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
