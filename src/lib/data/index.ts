import { MockDataSource } from './mock';
import { SupabaseDataSource } from './supabase';
import type { DataSource } from './types';

// The one seam between mock and live. Set NEXT_PUBLIC_SUPABASE_URL and
// NEXT_PUBLIC_SUPABASE_KEY in .env.local and every component switches to
// the real backend — no code changes anywhere else.

let instance: DataSource | null = null;

export function getDataSource(): DataSource {
  if (!instance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_KEY;
    instance = url && key ? new SupabaseDataSource(url, key) : new MockDataSource();
  }
  return instance;
}

export type { BookingInput, DataSource, HeartAgeInput, QueueState } from './types';
