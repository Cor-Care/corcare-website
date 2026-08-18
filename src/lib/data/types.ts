// The website's entire backend surface. One interface, two implementations:
// MockDataSource (default, zero config) and SupabaseDataSource (activates
// when NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_KEY exist).

export interface QueueState {
  active: boolean;
  currentToken: number;
  lastIssuedToken: number;
  avgConsultMinutes: number;
}

export interface BookingInput {
  fullName: string;
  phone: string;
  type: 'clinic' | 'video';
  preferredDate: string | null;
  reason: string;
  language: 'en' | 'ur';
  heartAgeCheckId?: string | null;
}

export interface HeartAgeInput {
  answers: Record<string, unknown>;
  realAge: number;
  heartAge: number;
  language: 'en' | 'ur';
}

export interface DataSource {
  /** Live queue state; returns an unsubscribe function. Emits immediately, then on change. */
  subscribeQueue(onChange: (state: QueueState) => void): () => void;
  /** Website booking form → booking_requests. */
  submitBooking(input: BookingInput): Promise<{ ok: boolean; error?: string }>;
  /** Heart Age Check funnel → heart_age_checks. Returns the row id for booking attribution. */
  recordHeartAgeCheck(input: HeartAgeInput): Promise<{ id: string | null }>;
  /** True when running against the mock (used to show a subtle demo notice). */
  readonly isMock: boolean;
}
