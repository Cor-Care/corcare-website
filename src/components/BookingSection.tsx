'use client';

import { useState, type FormEvent } from 'react';
import { clinic } from '@/lib/config';
import { getDataSource } from '@/lib/data';
import { T, useLang } from '@/lib/i18n';
import { Reveal } from '@/lib/motion';

const CHECK = (
  <svg viewBox="0 0 24 24">
    <path d="m5 13 4 4L19 7" />
  </svg>
);

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function BookingSection() {
  const { lang } = useLang();
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    setStatus('submitting');
    const result = await getDataSource().submitBooking({
      fullName: String(fields.get('name') ?? ''),
      phone: String(fields.get('phone') ?? ''),
      type: fields.get('type') === 'Video consultation' ? 'video' : 'clinic',
      preferredDate: String(fields.get('date') ?? '') || null,
      reason: String(fields.get('reason') ?? ''),
      language: lang,
    });
    if (result.ok) {
      setStatus('success');
      form.reset();
    } else {
      setStatus('error');
      setErrorMsg(result.error ?? 'Something went wrong — please try again or WhatsApp us.');
    }
  };

  return (
    <section id="book" className="dark book">
      <div className="wrap book-grid">
        <Reveal seq>
          <span className="eyebrow">
            <T k="book_eyebrow" />
          </span>
          <h2 className={lang === 'ur' ? 'urdu' : undefined}>
            <T k="book_h2" />
          </h2>
          <p className="bl">
            Clinic visit or video consultation — confirmation and reminders arrive by WhatsApp and
            SMS.
          </p>
          <ul className="tick">
            <li>
              {CHECK}Consultation fee: <b>&nbsp;{clinic.consultationFee}</b>&nbsp;— pay at clinic
              or online
            </li>
            <li>{CHECK}Live token tracking — leave home at the right time</li>
            <li>
              {CHECK}Free follow-up within {clinic.followUpDays} days
            </li>
          </ul>
          <p className="note">
            Prefer to call? <b style={{ color: '#fff' }}>{clinic.phone}</b> (Mon–Sat, 2–9pm)
          </p>
        </Reveal>
        <Reveal className="rv-scale" delay={120}>
          {status === 'success' ? (
          <div className="form-card form-success">
            <div className="big-tick">
              <svg viewBox="0 0 24 24">
                <path d="m5 13 4 4L19 7" pathLength={40} />
              </svg>
            </div>
            <svg className="success-ecg" viewBox="0 0 300 26" aria-hidden="true">
              <path d="M0 14 H118 l6-9 6 14 5-10 4 5 H300" pathLength={320} />
            </svg>
            <h3>Request received</h3>
            <p>
              The clinic will confirm your slot on WhatsApp shortly. If it&apos;s urgent, call{' '}
              <b>{clinic.phone}</b>.
            </p>
            <button className="btn btn-ghost-ink" onClick={() => setStatus('idle')}>
              Book another visit
            </button>
          </div>
        ) : (
          <form className="form-card" onSubmit={onSubmit}>
            <div className="row2">
              <div>
                <label htmlFor="bkName">Full name</label>
                <input id="bkName" name="name" required placeholder="e.g. Muhammad Ali" />
              </div>
              <div>
                <label htmlFor="bkPhone">Mobile number</label>
                <input id="bkPhone" name="phone" required placeholder="03XX XXXXXXX" />
              </div>
            </div>
            <div className="row2">
              <div>
                <label htmlFor="bkType">Type</label>
                <select id="bkType" name="type">
                  <option>Clinic visit</option>
                  <option>Video consultation</option>
                </select>
              </div>
              <div>
                <label htmlFor="bkDate">Preferred date</label>
                <input id="bkDate" name="date" type="date" />
              </div>
            </div>
            <label htmlFor="bkReason">Reason for visit (optional)</label>
            <textarea
              id="bkReason"
              name="reason"
              rows={3}
              placeholder="e.g. chest pain, BP check-up, second opinion…"
            />
            <div style={{ marginTop: 24 }}>
              <button
                className="btn btn-red"
                style={{ width: '100%' }}
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Sending…' : 'Confirm booking'}
              </button>
            </div>
            {status === 'error' && (
              <p className="note" style={{ color: 'var(--red)' }}>
                {errorMsg}
              </p>
            )}
            <p className="note">Your information is private and used only for your appointment.</p>
          </form>
        )}
        </Reveal>
      </div>
    </section>
  );
}
