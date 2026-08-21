'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

// One shared IntersectionObserver drives every scroll reveal on the page —
// elements register a one-shot callback and are unobserved after firing.
let sharedObserver: IntersectionObserver | null = null;
const onIntersect = new WeakMap<Element, () => void>();

export function observeOnce(el: Element, cb: () => void): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    cb();
    return () => {};
  }
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onIntersect.get(entry.target)?.();
            sharedObserver?.unobserve(entry.target);
            onIntersect.delete(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
  }
  onIntersect.set(el, cb);
  sharedObserver.observe(el);
  return () => {
    sharedObserver?.unobserve(el);
    onIntersect.delete(el);
  };
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface RevealProps {
  /** Stagger the element's direct children instead of animating the wrapper itself. */
  seq?: boolean;
  className?: string;
  /** Entrance delay in ms (self-reveal only; seq children stagger via CSS). */
  delay?: number;
  style?: CSSProperties;
  children?: ReactNode;
}

// Scroll-reveal wrapper. Renders a plain div carrying `rv` (self) or `rv-seq`
// (staggered children) plus `in` once scrolled into view; globals.css owns the
// animation, including the prefers-reduced-motion opt-out.
export function Reveal({ seq = false, className, delay = 0, style, children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeOnce(el, () => setSeen(true));
  }, []);

  const cls = [seq ? 'rv-seq' : 'rv', seen ? 'in' : '', className].filter(Boolean).join(' ');
  return (
    <div ref={ref} className={cls} style={delay ? { ...style, animationDelay: `${delay}ms` } : style}>
      {children}
    </div>
  );
}

interface CountUpProps {
  value: number;
  decimals?: number;
  duration?: number;
}

// Counts from 0 to `value` with an ease-out-expo curve when scrolled into view.
export function CountUp({ value, decimals = 0, duration = 1500 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState('0');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (v: number) => (decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-US'));
    if (prefersReducedMotion()) {
      setText(fmt(value));
      return;
    }
    let raf = 0;
    const cancel = observeOnce(el, () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        setText(fmt(value * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    return () => {
      cancel();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, decimals, duration]);

  return <span ref={ref}>{text}</span>;
}
