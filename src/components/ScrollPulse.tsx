'use client';

import { useEffect, useRef } from 'react';

// Repeating flat → P wave → QRS segment, 150 units wide, starting and ending
// on the y=8 baseline so eight copies chain seamlessly across the viewBox.
const TILE = 'h30q4 -6 8 0h24l5 -5 5 10 4 -8 3 3h71';
const PULSE_PATH = `M0 8${TILE.repeat(8)}`;

// Page-pulse scrollbar: an ECG strip pinned to the navbar's bottom edge whose
// live trace draws in proportion to how far the page has been scrolled.
// Deliberately left running under prefers-reduced-motion — it only moves with
// the user's own scrolling, like a scrollbar thumb.
export function ScrollPulse() {
  const liveRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const live = liveRef.current;
    if (!live) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      live.style.strokeDashoffset = `${100 * (1 - progress)}`;
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
    <div className="scroll-pulse" aria-hidden="true">
      <svg viewBox="0 0 1200 14" preserveAspectRatio="none">
        <path className="sp-dim" d={PULSE_PATH} />
        <path className="sp-live" ref={liveRef} d={PULSE_PATH} pathLength={100} />
      </svg>
    </div>
  );
}
