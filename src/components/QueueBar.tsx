'use client';

import { useEffect, useRef, useState } from 'react';
import { getDataSource, type QueueState } from '@/lib/data';
import { clinic } from '@/lib/config';

export function QueueBar() {
  const [queue, setQueue] = useState<QueueState | null>(null);
  const [flash, setFlash] = useState(false);
  const prevToken = useRef<number | null>(null);

  useEffect(() => getDataSource().subscribeQueue(setQueue), []);

  // One green pulse whenever the clinic advances to the next token.
  useEffect(() => {
    if (!queue) return;
    const changed = prevToken.current !== null && queue.currentToken !== prevToken.current;
    prevToken.current = queue.currentToken;
    if (!changed) return;
    setFlash(true);
    const timer = setTimeout(() => setFlash(false), 1300);
    return () => clearTimeout(timer);
  }, [queue]);

  if (!queue) return null;

  const tokensAhead = Math.max(0, queue.lastIssuedToken - queue.currentToken);
  const waitMinutes = Math.round((tokensAhead * queue.avgConsultMinutes) / 10) * 10 || 5;

  return (
    <div className={`queue${flash ? ' flash' : ''}`} id="queue">
      <div className="wrap">
        {queue.active ? (
          <>
            <span className="live">
              <span className="bpm-dot" />
              CLINIC LIVE
            </span>
            <span className="sep">|</span>
            <span>Open today 14:00–21:00</span>
            <span className="sep">|</span>
            <span>
              Now seeing token{' '}
              <span className="tok roll" key={queue.currentToken}>
                {queue.currentToken}
              </span>{' '}
              of <span className="tok">{queue.lastIssuedToken}</span>
            </span>
            <span className="sep">|</span>
            <span>
              Est. wait ≈ <span className="tok">{waitMinutes} min</span>
            </span>
          </>
        ) : (
          <>
            <span className="live paused">● CLINIC CLOSED</span>
            <span className="sep">|</span>
            <span>Next session: Mon–Sat, 14:00–21:00</span>
          </>
        )}
        <span style={{ marginLeft: 'auto' }}>
          <a href={clinic.portalUrl}>Track your token in the portal →</a>
        </span>
      </div>
    </div>
  );
}
