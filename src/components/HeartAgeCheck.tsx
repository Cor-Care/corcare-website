'use client';

import { useEffect, useState } from 'react';
import { clinic } from '@/lib/config';
import { getDataSource } from '@/lib/data';
import { T, useLang } from '@/lib/i18n';
import { prefersReducedMotion, Reveal } from '@/lib/motion';

interface Question {
  key: string;
  q: string;
  type?: 'num';
  placeholder?: string;
  opts?: string[];
}

const QUESTIONS: Question[] = [
  { key: 'age', q: 'What is your age?', type: 'num', placeholder: 'e.g. 45' },
  { key: 'smoking', q: 'Do you smoke, or use naswar / hookah?', opts: ['Never', 'Quit over a year ago', 'Yes, currently'] },
  { key: 'bp', q: 'Has a doctor ever told you your blood pressure is high?', opts: ["No / it's normal", 'Yes, controlled with medicine', "Yes, or I've never checked"] },
  { key: 'family', q: 'Heart disease in your close family before age 60?', opts: ['No', 'Yes — one parent or sibling', 'Yes — more than one'] },
  { key: 'activity', q: 'How often do you get 30 minutes of brisk activity?', opts: ['Most days', '1–2 times a week', 'Rarely'] },
];

// Risk points → extra heart-age years (same banding as the approved v3 demo).
const EXTRA_YEARS = [0, 1, 3, 5, 8, 11, 14, 17];

// Gauge ring around the result: circumference of the r=66 circle. The filled
// fraction maps extra years onto the arc, floored so even a perfect result
// shows a visible sliver of band colour.
const RING_CIRCUMFERENCE = 414.69;
const ringFill = (extra: number) => Math.min(1, 0.12 + extra * 0.05);

export function HeartAgeCheck() {
  const { lang } = useLang();
  const [step, setStep] = useState(0);
  const [age, setAge] = useState<number>(0);
  const [risk, setRisk] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [numInput, setNumInput] = useState('');
  const [numError, setNumError] = useState(false);

  const done = step >= QUESTIONS.length;
  const extra = EXTRA_YEARS[Math.min(risk, EXTRA_YEARS.length - 1)] ?? 0;
  const heartAge = age + extra;

  // Odometer: the result rolls from the real age up to the heart age, then
  // lands with a single pulse — the gap IS the story.
  const [displayAge, setDisplayAge] = useState<number | null>(null);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    if (!done) {
      setDisplayAge(null);
      setLanded(false);
      return;
    }
    if (prefersReducedMotion() || heartAge === age) {
      setDisplayAge(heartAge);
      setLanded(true);
      return;
    }
    setDisplayAge(age);
    const duration = 1100;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayAge(Math.round(age + (heartAge - age) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setLanded(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [done, age, heartAge]);

  // Gauge ring sweeps to its band in sync with the odometer: first commit a
  // frame at full offset (empty ring), then let the CSS transition carry it.
  const [ringOffset, setRingOffset] = useState(RING_CIRCUMFERENCE);

  useEffect(() => {
    if (!done) {
      setRingOffset(RING_CIRCUMFERENCE);
      return;
    }
    const target = RING_CIRCUMFERENCE * (1 - ringFill(extra));
    if (prefersReducedMotion()) {
      setRingOffset(target);
      return;
    }
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setRingOffset(target));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [done, extra]);

  const submitNum = () => {
    const value = parseInt(numInput, 10);
    if (!value || value < 18 || value > 100) {
      setNumError(true);
      return;
    }
    setNumError(false);
    setAge(value);
    setAnswers((a) => ({ ...a, age: value }));
    setStep((s) => s + 1);
  };

  const pick = (question: Question, optionIndex: number) => {
    const newAnswers = { ...answers, [question.key]: question.opts?.[optionIndex] };
    setAnswers(newAnswers);
    setRisk((r) => r + optionIndex);
    const next = step + 1;
    setStep(next);
    if (next >= QUESTIONS.length) {
      const finalRisk = risk + optionIndex;
      const finalExtra = EXTRA_YEARS[Math.min(finalRisk, EXTRA_YEARS.length - 1)] ?? 0;
      void getDataSource().recordHeartAgeCheck({
        answers: newAnswers,
        realAge: age,
        heartAge: age + finalExtra,
        language: lang,
      });
    }
  };

  const reset = () => {
    setStep(0);
    setAge(0);
    setRisk(0);
    setAnswers({});
    setNumInput('');
    setNumError(false);
  };

  const resultClass = extra <= 1 ? '' : extra <= 7 ? ' warn' : ' high';
  const band =
    extra <= 1
      ? 'Your heart age matches your real age — keep it that way.'
      : extra <= 7
        ? 'Your heart may be ageing a little faster than you are.'
        : 'Your heart may be significantly older than you — worth a proper check.';

  const current = QUESTIONS[step];

  return (
    <section id="heartage" className="dark">
      <div className="wrap ha-grid">
        <Reveal seq className="ha-copy">
          <span className="eyebrow">
            <T k="ha_eyebrow" />
          </span>
          <h2 className={lang === 'ur' ? 'urdu' : undefined}>
            <T k="ha_h2" />
          </h2>
          <p className={lang === 'ur' ? 'urdu' : undefined}>
            <T k="ha_p" />
          </p>
          <p style={{ fontSize: 14, color: 'var(--fog2)' }}>
            Built on established cardiovascular risk factors. It is a screening guide, not a
            diagnosis — your real numbers come from a proper check-up.
          </p>
        </Reveal>
        <Reveal className="ha-card rv-scale" delay={100}>
          <div className="ha-bar">
            <i style={{ width: done ? '100%' : `${(step / QUESTIONS.length) * 100 || 6}%` }} />
          </div>
          {done ? (
            <div className="ha-result">
              <span className="ha-step">Estimated heart age</span>
              <div className={`ha-ring${resultClass}`}>
                <svg viewBox="0 0 150 150" aria-hidden="true">
                  <circle className="ring-track" cx="75" cy="75" r="66" />
                  <circle
                    className="ring-fill"
                    cx="75"
                    cy="75"
                    r="66"
                    style={{ strokeDashoffset: ringOffset }}
                  />
                </svg>
                <div className={`big${resultClass}${landed ? ' landed' : ''}`}>
                  {displayAge ?? heartAge}
                </div>
              </div>
              <h3>{band}</h3>
              <p>
                A one-time consultation with ECG and BP check gives you your real numbers — and a
                plan to bring your heart age down.
              </p>
              <a href="#book" className="btn btn-red">
                Book a heart check — {clinic.consultationFee}
              </a>
              <br />
              <button className="ha-reset" onClick={reset}>
                ↺ Start again
              </button>
            </div>
          ) : (
            <div className="ha-swap" key={step}>
              <span className="ha-step">
                Question {step + 1} of {QUESTIONS.length}
              </span>
              <div className="ha-q">{current.q}</div>
              {current.type === 'num' ? (
                <>
                  <input
                    className={`ha-input${numError ? ' err' : ''}`}
                    type="number"
                    min={18}
                    max={100}
                    placeholder={current.placeholder}
                    value={numInput}
                    onChange={(e) => setNumInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') submitNum();
                    }}
                  />
                  <button className="btn btn-red ha-next" onClick={submitNum}>
                    Next
                  </button>
                </>
              ) : (
                <div className="ha-opts">
                  {current.opts?.map((opt, i) => (
                    <button className="ha-opt" key={opt} onClick={() => pick(current, i)}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="ha-note">
            Educational estimate only — not a medical diagnosis. If you have symptoms now, call{' '}
            {clinic.emergencyNumber}.
          </div>
        </Reveal>
      </div>
    </section>
  );
}
