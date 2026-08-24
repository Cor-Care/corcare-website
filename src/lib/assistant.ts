// Shared contract between the assistant API route and the client widgets.

export type AssistantActionType = 'book' | 'whatsapp' | 'emergency';

export interface BookingPrefill {
  name?: string;
  phone?: string;
  type?: 'clinic' | 'video';
  reason?: string;
}

export interface AssistantAction {
  type: AssistantActionType;
  booking?: BookingPrefill;
}

// CustomEvent (detail: BookingPrefill) the assistant dispatches so the
// booking form can pre-fill itself.
export const BOOKING_PREFILL_EVENT = 'corcare:prefill-booking';
