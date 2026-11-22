import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  createSwitchReader,
  DEFAULT_MAINTENANCE_MESSAGE,
  isAlwaysOpen,
  maintenanceHtml,
  maintenanceResponse,
  type SwitchReaderOptions,
} from './maintenance';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

function reader(answers: (() => Promise<Response>)[], extra: Partial<SwitchReaderOptions> = {}) {
  const urls: string[] = [];
  let clock = 0;
  const read = createSwitchReader({
    surface: 'portal',
    url: 'https://example.supabase.co/',
    key: 'anon-key',
    fetchImpl: (async (input: string | URL | Request) => {
      urls.push(String(input));
      const next = answers.shift();
      if (!next) throw new Error('no answer left');
      return next();
    }) as typeof fetch,
    now: () => clock,
    ...extra,
  });
  return { read, urls, advance: (ms: number) => (clock += ms) };
}

test('reads this surface only and reports off with the owner message', async () => {
  const { read, urls } = reader([async () => json([{ enabled: false, message: ' Back at 5 PM ' }])]);
  assert.deepEqual(await read(), { enabled: false, message: 'Back at 5 PM' });
  assert.deepEqual(urls, [
    'https://example.supabase.co/rest/v1/platform_switches?surface=eq.portal&select=enabled,message',
  ]);
});

test('caches for 30 s, then refreshes in the background while the last state answers', async () => {
  const { read, urls, advance } = reader([
    async () => json([{ enabled: false, message: null }]),
    async () => json([{ enabled: true, message: null }]),
  ]);
  assert.equal((await read()).enabled, false);
  advance(29_999);
  assert.equal((await read()).enabled, false);
  assert.equal(urls.length, 1);
  advance(1);
  const kept: Promise<unknown>[] = [];
  // Expired: the last state answers at once, the refresh is handed to waitUntil.
  assert.equal((await read((p) => kept.push(p))).enabled, false);
  assert.equal(urls.length, 2);
  assert.equal(kept.length, 1);
  await kept[0];
  assert.equal((await read()).enabled, true);
  assert.equal(urls.length, 2);
});

test('waits for a fresh read when nothing is cached or the state is too old', async () => {
  const { read, urls, advance } = reader([
    async () => json([{ enabled: true, message: null }]),
    async () => json([{ enabled: false, message: null }]),
  ]);
  assert.equal((await read()).enabled, true);
  advance(30_000 + 10 * 60_000);
  assert.equal((await read()).enabled, false);
  assert.equal(urls.length, 2);
});

test('an expired state starts one background refresh for many callers', async () => {
  const { read, urls, advance } = reader([
    async () => json([{ enabled: true }]),
    async () => json([{ enabled: true }]),
  ]);
  await read();
  advance(30_000);
  const kept: Promise<unknown>[] = [];
  await Promise.all([read((p) => kept.push(p)), read((p) => kept.push(p)), read()]);
  await Promise.all(kept);
  assert.equal(urls.length, 2);
});

test('concurrent callers share one request', async () => {
  const { read, urls } = reader([async () => json([{ enabled: true }])]);
  await Promise.all([read(), read(), read()]);
  assert.equal(urls.length, 1);
});

test('fails open on network error, timeout, HTTP error, bad JSON and a missing row', async () => {
  const cases: (() => Promise<Response>)[] = [
    async () => {
      throw new TypeError('fetch failed');
    },
    async () => {
      throw new DOMException('timed out', 'TimeoutError');
    },
    async () => json({ message: 'relation does not exist' }, 404),
    async () => new Response('not json', { status: 200 }),
    async () => json([]),
    async () => json([{ enabled: 'false' }]),
  ];
  for (const answer of cases) {
    const { read } = reader([answer]);
    assert.deepEqual(await read(), { enabled: true, message: null });
  }
});

test('a hanging Supabase is cut off by the timeout and fails open', async () => {
  const read = createSwitchReader({
    surface: 'portal',
    url: 'https://example.supabase.co',
    key: 'k',
    timeoutMs: 20,
    fetchImpl: ((_input: unknown, init?: RequestInit) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(init.signal?.reason));
      })) as typeof fetch,
  });
  // AbortSignal.timeout's timer is unref'd; keep the test process alive meanwhile.
  const keepAlive = setTimeout(() => undefined, 5_000);
  try {
    assert.deepEqual(await read(), { enabled: true, message: null });
  } finally {
    clearTimeout(keepAlive);
  }
});

test('mock mode (no Supabase env) never fetches and is always on', async () => {
  const { read, urls } = reader([], { url: undefined, key: undefined });
  assert.deepEqual(await read(), { enabled: true, message: null });
  assert.equal(urls.length, 0);
});

test('always-open paths match whole segments only', () => {
  const open = ['/privacy', '/delete-account'];
  assert.equal(isAlwaysOpen('/privacy', open), true);
  assert.equal(isAlwaysOpen('/delete-account/confirm', open), true);
  assert.equal(isAlwaysOpen('/privacy-old', open), false);
  assert.equal(isAlwaysOpen('/', open), false);
});

test('maintenance page: default copy, escaped owner text, call buttons', () => {
  const page = maintenanceHtml(null);
  assert.ok(page.includes(DEFAULT_MAINTENANCE_MESSAGE));
  assert.equal(DEFAULT_MAINTENANCE_MESSAGE, 'Cor Care is temporarily unavailable. Please call 0326 2000341.');
  assert.ok(page.includes('tel:1122'));
  assert.ok(page.includes('tel:+923262000341'));
  assert.ok(maintenanceHtml('<b>x</b> & "y"').includes('&lt;b&gt;x&lt;/b&gt; &amp; &quot;y&quot;'));
});

test('maintenance response: 503 HTML for pages, JSON for /api, never cached', async () => {
  const page = maintenanceResponse(null, '/today');
  assert.equal(page.status, 503);
  assert.equal(page.headers.get('cache-control'), 'no-store');
  assert.equal(page.headers.get('x-corcare-maintenance'), '1');
  assert.match(page.headers.get('content-type') ?? '', /text\/html/);
  const api = maintenanceResponse('Back soon', '/api/assistant');
  assert.equal(api.status, 503);
  assert.deepEqual(await api.json(), { error: 'maintenance', message: 'Back soon' });
});
