import { PossibleEventTypes } from '@sdk/values';
export { OneClickError } from '@sdk/errors/one-click-error';

export type SuccessEventResponseData = {
  identityUuid: string;
};

export interface ClientMessageEvent {
  type: (typeof PossibleEventTypes)[keyof typeof PossibleEventTypes];
  data: Record<string, unknown> | null;
  source: 'Verified.Client';
  timestamp: number;
}
