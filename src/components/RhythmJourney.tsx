'use client';

import { useEffect, useRef, useState } from 'react';
import { Reveal } from '@/lib/motion';

interface Wave {
  tag: string;
  title: string;
  body: string;
  path: string;
  dashed?: boolean;
}

const WAVES: Wave[] = [
  {
    tag: 'P · Book',
    title: 'Book in a minute',
    body: 'Pick a slot here, in the app, or just WhatsApp us. Confirmation is instant — no queues, no phone hold music.',
    path: 'M2 20 h10 a5 5 0 0 1 10 0 h20',
  },
  {
    tag: 'QRS · Visit',
    title: 'Be seen, properly',
    body: 'A full, unhurried consultation at the clinic — or by video from home. Tests done and explained the same visit.',
    path: 'M2 20 h10 l4-6 5 14 5-24 5 20 3-4 h10',
  },
  {
    tag: 'T · Plan',
    title: 'Leave with clarity',
    body: 'A written plan in plain words. Reports, prescriptions and reminders arrive in your portal — nothing gets lost.',
    path: 'M2 20 h14 a7 7 0 0 1 14 0 h12',
  },
  {
    tag: 'R–R · Follow',
    title: 'We stay with you',
    body: 'Medicine reminders, BP tracking and follow-up nudges between visits. Your heart is watched, not forgotten.',
    path: 'M2 15 h8 m6 0 h8 m6 0 h12',
    dashed: true,
  },
];

// One continuous ECG trace behind the four step circles: flat line → P wave →
// QRS complex → T wave → two follow-up beats. Drawn progressively with scroll.
// Starts at the first circle's center so no stub pokes out to its left.
const TRACE =
  'M27 34 H115 q10 -15 20 0 H355 l6 5 6 -27 7 36 5 -19 4 5 H605 q13 -17 26 0 H845 l5 -9 6 9 H920 l5 -9 6 9 H1000';

// x of each step circle's center in the trace's viewBox — each card wakes the
// moment the drawn tip crosses its circle, so wake points must be derived from
// the real path geometry, never hardcoded fractions of arc length.
const CIRCLE_X = [27, 277, 527, 777];

export function RhythmJourney() {
  const stripRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const strip = stripRef.current;
    const live = liveRef.current;
    const dot = dotRef.current;
    if (!strip || !live || !dot) return;
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 980px)').matches
    ) {
      setActive(WAVES.length);
      return;
    }

    const glow = strip.querySelector<SVGPathElement>('.rt-glow');
    const halo = strip.querySelector<SVGCircleElement>('.rt-dot-halo');
    const len = live.getTotalLength();
    for (const path of [live, glow]) {
      if (!path) continue;
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
    }

    // Arc-length fraction at which the tip reaches each circle's center
    // (x is monotonic along the trace, so binary search works).
    const wakeAt = CIRCLE_X.map((cx) => {
      let lo = 0;
      let hi = len;
      for (let k = 0; k < 18; k++) {
        const mid = (lo + hi) / 2;
        if (live.getPointAtLength(mid).x < cx) lo = mid;
        else hi = mid;
      }
      return hi / len;
    });
    wakeAt[0] = Math.max(wakeAt[0], 0.02);

    let raf = 0;
    let lastProgress = -1;
    const update = () => {
      raf = 0;
      const rect = strip.getBoundingClientRect();
      const vh = window.innerHeight;
      // Skip all work while the section is far off-screen.
      if (rect.bottom < -100 || rect.top > vh + 100) return;
      const progress = Math.max(0, Math.min(1, (vh * 0.82 - rect.top) / (vh * 0.6)));
      if (progress === lastProgress) return;
      lastProgress = progress;
      const offset = `${len * (1 - progress)}`;
      live.style.strokeDashoffset = offset;
      if (glow) glow.style.strokeDashoffset = offset;
      const tip = live.getPointAtLength(len * progress);
      const visible = progress > 0.01 && progress < 0.995 ? '1' : '0';
      dot.setAttribute('cx', `${tip.x}`);
      dot.setAttribute('cy', `${tip.y}`);
      dot.style.opacity = visible;
      if (halo) {
        halo.setAttribute('cx', `${tip.x}`);
        halo.setAttribute('cy', `${tip.y}`);
        halo.style.opacity = visible;
      }
      const reached = wakeAt.filter((t) => progress >= t).length;
      setActive((prev) => (prev === reached ? prev : reached));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="rhythm">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow" style={{ color: 'var(--oxblood)' }}>
            One complete beat
          </span>
          <h2>Your visit, in rhythm</h2>
          <p style={{ color: 'var(--muted)' }}>
            Like a heartbeat, good care has a rhythm — four waves, nothing skipped.
          </p>
        </Reveal>
        <div className="rhythm-strip" ref={stripRef}>
          <div className="rhythm-trace" aria-hidden="true">
            <svg viewBox="0 0 1000 68" preserveAspectRatio="none">
              <path className="rt-dim" d={TRACE} />
              <path className="rt-glow" d={TRACE} />
              <path className="rt-live" ref={liveRef} d={TRACE} />
              <circle className="rt-dot-halo" r="9" cx="0" cy="34" style={{ opacity: 0 }} />
              <circle className="rt-dot" ref={dotRef} r="4" cx="0" cy="34" style={{ opacity: 0 }} />
            </svg>
          </div>
          <div className="waves">
            {WAVES.map((wave, i) => (
              <div className={`wave${i < active ? ' on' : ''}`} key={wave.tag}>
                <div className="wv">
                  <svg viewBox="0 0 44 30">
                    <path d={wave.path} strokeDasharray={wave.dashed ? '2 5' : undefined} />
                  </svg>
                </div>
                <span className="tag-mono">{wave.tag}</span>
                <h3>{wave.title}</h3>
                <p>{wave.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
