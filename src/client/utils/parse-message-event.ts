import { ClientMessageEvent } from '@sdk/types';
import { PossibleEventTypes } from '@sdk/values';

/**
 * Parses and validates a MessageEvent from the iframe.
 *
 * @param event - The MessageEvent received from the iframe
 * @returns A typed ClientMessageEvent if the message is valid, false otherwise
 */
export function parseMessageEvent(event: MessageEvent): ClientMessageEvent | false {
  // Ensure the event has data
  if (!event?.data) return false;

  // Ensure data is an object first
  if (typeof event.data !== 'object' || event.data === null) return false;

  const { data } = event;

  // Validate the data
  const isValid =
    data.source === 'Verified.Client' &&
    typeof data.timestamp === 'number' &&
    typeof data.type === 'string' &&
    Object.values(PossibleEventTypes).includes(data.type) &&
    ((typeof data.data === 'object' && data.data !== null) || data.data === null);

  // Ensure the data is valid
  if (!isValid) return false;

  return {
    type: data.type,
    source: data.source,
    timestamp: data.timestamp,
    data: data.data,
  };
}
