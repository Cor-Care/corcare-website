'use client';

import { useEffect, useRef, useState } from 'react';
import { clinic } from '@/lib/config';
import { T, useLang } from '@/lib/i18n';
import { prefersReducedMotion } from '@/lib/motion';

const BPM_BASE = 70;
const BPM_JITTER = 5;
const BPM_TICK_MS = 2600;

const ECG_PATH =
  'M0 50 H120 l14-8 12 8 h50 l10-30 14 52 12-40 8 18 h60 l14-8 12 8 h120 l10-26 14 46 12-36 8 16 h90 l14-8 12 8 h60 l10-30 14 52 12-40 8 18 h120 l14-8 12 8 h100 l10-26 14 46 12-36 8 16 h90 l14-8 12 8 h70 l10-30 14 52 12-40 8 18 h330';

export function Hero() {
  const { lang } = useLang();
  const [bpm, setBpm] = useState(72);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(
      () => setBpm(BPM_BASE + Math.floor(Math.random() * BPM_JITTER)),
      BPM_TICK_MS,
    );
    return () => clearInterval(timer);
  }, []);

  // Gentle pointer tilt on the monitor card — mouse/trackpad only, and never
  // for users who asked for reduced motion.
  useEffect(() => {
    const el = tiltRef.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return;
    const move = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      el.style.setProperty('--tx', `${(dx * 5).toFixed(2)}deg`);
      el.style.setProperty('--ty', `${(-dy * 5).toFixed(2)}deg`);
    };
    const leave = () => {
      el.style.setProperty('--tx', '0deg');
      el.style.setProperty('--ty', '0deg');
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <header className="hero">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow" style={{ color: 'var(--pulse)' }}>
            <T k="hero_eyebrow" />
          </span>
          {lang === 'ur' ? (
            <h1 className="urdu">ایسا دل کا ڈاکٹر جو علاج سے پہلے آپ کی بات سنتا ہے</h1>
          ) : (
            <h1>
              A heart doctor who <em>listens</em> before he treats.
            </h1>
          )}
          <p className={`lead${lang === 'ur' ? ' urdu' : ''}`}>
            <T k="hero_lead" />
          </p>
          <div className="hero-ctas">
            <a href="#book" className="btn btn-red">
              <T k="hero_cta1" />
            </a>
            <a href={clinic.whatsappHref} className="btn btn-ghost">
              <svg className="ic" viewBox="0 0 24 24">
                <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z" />
              </svg>
              <T k="hero_cta2" />
            </a>
          </div>
        </div>
        <div className="hero-tilt" ref={tiltRef}>
          <div className="monitor">
            <div className="monitor-top">
              <span>
                {clinic.brandThe} {clinic.brandName} · Clinic
              </span>
              <span className="bpm">
                <span className="bpm-dot" />
                <span className="bpm-num" key={bpm}>
                  {bpm}
                </span>
                &nbsp;BPM
              </span>
            </div>
            <div className="portrait-img">
              Professional photo of the doctor
              <br />
              (to be provided)
            </div>
            <div className="monitor-meta">
              <h3>{clinic.doctorName}</h3>
              <div className="creds">{clinic.doctorCreds}</div>
              <div className="badges">
                <span className="badge ok">PMDC VERIFIED</span>
                <span className="badge">[HOSPITAL AFFILIATION]</span>
                <span className="badge">FCPS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ecg-band" aria-hidden="true">
        <svg viewBox="0 0 1560 90" preserveAspectRatio="none">
          <path className="ecg-dim" d={ECG_PATH} />
          <path className="ecg-path sweep" d={ECG_PATH} strokeDasharray="260 1300" />
        </svg>
      </div>
    </header>
  );
}
