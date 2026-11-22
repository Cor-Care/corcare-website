import type { SupabaseClient } from '@supabase/supabase-js';
import type { BookingInput, DataSource, HeartAgeInput, QueueState } from './types';

// Live backend against the corcare-db schema (see the corcare-db repo).
// Dormant until NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_KEY are set.
// supabase-js (~200 KB of script) is loaded on first use, after the page has
// rendered, so it is not part of the home page's first load.

interface ClinicSettingsRow {
  queue_active: boolean;
  current_token: number;
  last_issued_token: number;
  avg_consult_minutes: number;
}

function toQueueState(row: ClinicSettingsRow): QueueState {
  return {
    active: row.queue_active,
    currentToken: row.current_token,
    lastIssuedToken: row.last_issued_token,
    avgConsultMinutes: row.avg_consult_minutes,
  };
}

export class SupabaseDataSource implements DataSource {
  readonly isMock = false;
  private client: Promise<SupabaseClient> | null = null;

  constructor(
    private readonly url: string,
    private readonly key: string,
  ) {}

  private getClient(): Promise<SupabaseClient> {
    this.client ??= import('@supabase/supabase-js').then(({ createClient }) => createClient(this.url, this.key));
    return this.client;
  }

  subscribeQueue(onChange: (state: QueueState) => void): () => void {
    let stopped = false;
    let stop: (() => void) | null = null;

    void this.getClient().then((client) => {
      if (stopped) return;
      void client
        .from('clinic_settings')
        .select('queue_active, current_token, last_issued_token, avg_consult_minutes')
        .single()
        .then(({ data }) => {
          if (data && !stopped) onChange(toQueueState(data as ClinicSettingsRow));
        });

      const channel = client
        .channel('clinic-queue')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'clinic_settings' },
          (payload) => onChange(toQueueState(payload.new as ClinicSettingsRow)),
        )
        .subscribe();

      stop = () => {
        void client.removeChannel(channel);
      };
    });

    return () => {
      stopped = true;
      stop?.();
    };
  }

  async submitBooking(input: BookingInput): Promise<{ ok: boolean; error?: string }> {
    const client = await this.getClient();
    const { error } = await client.from('booking_requests').insert({
      full_name: input.fullName,
      phone: input.phone,
      preferred_date: input.preferredDate,
      preferred_time: input.type === 'video' ? 'video consultation' : null,
      message: input.reason || null,
      language: input.language,
      heart_age_check_id: input.heartAgeCheckId ?? null,
    });
    return error ? { ok: false, error: error.message } : { ok: true };
  }

  async recordHeartAgeCheck(input: HeartAgeInput): Promise<{ id: string | null }> {
    const client = await this.getClient();
    const { data } = await client
      .from('heart_age_checks')
      .insert({
        answers: input.answers,
        real_age: input.realAge,
        heart_age: input.heartAge,
        language: input.language,
      })
      .select('id')
      .single();
    return { id: (data as { id: string } | null)?.id ?? null };
  }
}
