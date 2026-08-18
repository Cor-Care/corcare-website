import type { BookingInput, DataSource, HeartAgeInput, QueueState } from './types';

// Mock backend: a believable evening clinic session that advances its queue
// on a timer. Bookings and heart-age checks persist to localStorage so the
// client can inspect what "reached the server" during demos.

const STORAGE_KEYS = {
  bookings: 'corcare.mock.bookings',
  heartAge: 'corcare.mock.heartAgeChecks',
} as const;

const QUEUE_TICK_MS = 45_000;
const NETWORK_DELAY_MS = 450;

function appendToStorage(key: string, row: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = JSON.parse(window.localStorage.getItem(key) ?? '[]') as unknown[];
    existing.push({ ...row, createdAt: new Date().toISOString() });
    window.localStorage.setItem(key, JSON.stringify(existing));
  } catch {
    // Storage full or unavailable — the mock quietly drops the row.
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockDataSource implements DataSource {
  readonly isMock = true;

  private queue: QueueState = {
    active: true,
    currentToken: 14,
    lastIssuedToken: 32,
    avgConsultMinutes: 12,
  };

  subscribeQueue(onChange: (state: QueueState) => void): () => void {
    onChange({ ...this.queue });
    const timer = setInterval(() => {
      if (this.queue.currentToken < this.queue.lastIssuedToken - 1) {
        this.queue = { ...this.queue, currentToken: this.queue.currentToken + 1 };
        onChange({ ...this.queue });
      }
    }, QUEUE_TICK_MS);
    return () => clearInterval(timer);
  }

  async submitBooking(input: BookingInput): Promise<{ ok: boolean; error?: string }> {
    await wait(NETWORK_DELAY_MS);
    appendToStorage(STORAGE_KEYS.bookings, { ...input });
    return { ok: true };
  }

  async recordHeartAgeCheck(input: HeartAgeInput): Promise<{ id: string | null }> {
    const id = `mock-${Date.now().toString(36)}`;
    appendToStorage(STORAGE_KEYS.heartAge, { id, ...input });
    return { id };
  }
}
