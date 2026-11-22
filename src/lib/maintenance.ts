// Maintenance switch, set by the owner control panel (secret.thecorcare.com).
// src/proxy.ts reads the public `platform_switches` row for this surface
// (corcare-db migration 20261122100000) and answers 503 with a maintenance
// page while it is off. The flag is cached for TTL_MS; after that the last
// known state keeps answering (for up to STALE_MS) while one background read
// refreshes it, so a visitor never waits on Supabase once an instance has read
// the switch. Any failure (Supabase down, slow, table missing) counts as ON, so
// an outage never takes the site down twice. Without Supabase env (mock mode)
// nothing is ever fetched.
// Same file in corcare-website, corcare-portal and corcare-crm/web.

export const DEFAULT_MAINTENANCE_MESSAGE = 'Cor Care is temporarily unavailable. Please call 0326 2000341.';
const CLINIC_PHONE_TEL = '+923262000341';
const EMERGENCY_TEL = '1122';
const TTL_MS = 30_000;
/** How long an expired state may still answer while the refresh runs; older = wait for it. */
const STALE_MS = 10 * 60_000;
const TIMEOUT_MS = 1_500;

export interface SwitchState {
  enabled: boolean;
  /** Owner's text for the maintenance page; null = the default message. */
  message: string | null;
}

const OPEN: SwitchState = { enabled: true, message: null };

export interface SwitchReaderOptions {
  surface: 'website' | 'portal' | 'crm';
  url: string | undefined;
  key: string | undefined;
  fetchImpl?: typeof fetch;
  ttlMs?: number;
  staleMs?: number;
  timeoutMs?: number;
  now?: () => number;
}

async function fetchSwitch(options: SwitchReaderOptions, url: string, key: string): Promise<SwitchState> {
  const fetchImpl = options.fetchImpl ?? fetch;
  try {
    const res = await fetchImpl(
      `${url.replace(/\/+$/, '')}/rest/v1/platform_switches?surface=eq.${options.surface}&select=enabled,message`,
      {
        headers: { apikey: key, Accept: 'application/json' },
        cache: 'no-store',
        signal: AbortSignal.timeout(options.timeoutMs ?? TIMEOUT_MS),
      },
    );
    if (!res.ok) return OPEN;
    const rows: unknown = await res.json();
    const row = Array.isArray(rows) ? (rows[0] as { enabled?: unknown; message?: unknown } | undefined) : undefined;
    if (row?.enabled !== false) return OPEN;
    const message = typeof row.message === 'string' && row.message.trim() ? row.message.trim() : null;
    return { enabled: false, message };
  } catch {
    return OPEN;
  }
}

/** Keeps background work alive after the response (the proxy's `event.waitUntil`). */
export type WaitUntil = (promise: Promise<unknown>) => void;

/**
 * Returns a cached reader of this surface's switch (one request per TTL, shared by concurrent
 * callers). Within STALE_MS after the TTL the last state answers at once and the refresh runs in
 * the background (handed to `waitUntil`); with nothing cached, or older, callers wait for it.
 */
export function createSwitchReader(options: SwitchReaderOptions): (waitUntil?: WaitUntil) => Promise<SwitchState> {
  const { url, key } = options;
  if (!url || !key) return async () => OPEN;
  const now = options.now ?? Date.now;
  const ttl = options.ttlMs ?? TTL_MS;
  const stale = options.staleMs ?? STALE_MS;
  let cached: { state: SwitchState; at: number } | null = null;
  let inflight: Promise<SwitchState> | null = null;
  return (waitUntil) => {
    const age = cached ? now() - cached.at : Infinity;
    if (cached && age < ttl) return Promise.resolve(cached.state);
    inflight ??= fetchSwitch(options, url, key)
      .then((state) => {
        cached = { state, at: now() };
        return state;
      })
      .finally(() => {
        inflight = null;
      });
    if (cached && age < ttl + stale) {
      waitUntil?.(inflight);
      return Promise.resolve(cached.state);
    }
    return inflight;
  };
}

/** True for paths that stay reachable during maintenance (prefix match on whole segments). */
export function isAlwaysOpen(pathname: string, openPaths: readonly string[]): boolean {
  return openPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

const escapeHtml = (text: string): string =>
  text.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch] ?? ch);

/** The self-contained maintenance page (no scripts, no external assets). */
export function maintenanceHtml(message: string | null): string {
  const text = escapeHtml(message ?? DEFAULT_MAINTENANCE_MESSAGE);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Cor Care — temporarily unavailable</title>
<style>
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f4f1f1;color:#1b1216;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;padding:24px;box-sizing:border-box}
main{max-width:440px;text-align:center}
h1{font-family:Georgia,serif;font-weight:500;font-size:28px;margin:0 0 12px}
p{font-size:17px;line-height:1.5;margin:0 0 24px;color:#3b2f35}
a{display:block;margin:10px auto;padding:14px 18px;border-radius:999px;text-decoration:none;font-weight:600;font-size:16px}
.call{background:#1f2b5b;color:#fff}.sos{background:#e0333f;color:#fff}
</style></head>
<body><main><h1>Cor Care</h1><p>${text}</p>
<a class="call" href="tel:${CLINIC_PHONE_TEL}">Call the clinic: 0326 2000341</a>
<a class="sos" href="tel:${EMERGENCY_TEL}">Emergency? Call 1122</a>
</main></body></html>`;
}

/** 503 for a request while the surface is off: JSON under /api, the HTML page elsewhere. */
export function maintenanceResponse(message: string | null, pathname: string): Response {
  const headers = { 'Cache-Control': 'no-store', 'Retry-After': '60', 'x-corcare-maintenance': '1' };
  if (pathname === '/api' || pathname.startsWith('/api/')) {
    return Response.json(
      { error: 'maintenance', message: message ?? DEFAULT_MAINTENANCE_MESSAGE },
      { status: 503, headers },
    );
  }
  return new Response(maintenanceHtml(message), {
    status: 503,
    headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' },
  });
}
