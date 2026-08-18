'use client';

import { useEffect, useRef, useState } from 'react';
import { clinic } from '@/lib/config';

interface Message {
  from: 'bot' | 'user';
  text: string;
}

// Scripted demo assistant (regex → canned answers), same behaviour as the
// approved v3 demo. The live version swaps this for a safety-tuned medical AI.
const REPLIES: [RegExp, string][] = [
  [/book|appoint|slot|time/i, "You can book right on this page — tap 'Book a visit' above, or message us on WhatsApp and we'll confirm your slot instantly. Clinic hours are Mon–Sat, 5–9pm."],
  [/fee|price|charge|cost/i, `Consultation fee is ${clinic.consultationFee}, with a free follow-up within 7 days. You can pay at the clinic or online.`],
  [/chest pain|emergency|heart attack|saans|dard/i, "If you're having chest pain, pressure, breathlessness or pain spreading to your arm/jaw RIGHT NOW — please call 1122 or go to the nearest emergency department immediately. Don't wait for an appointment."],
  [/heart age|quiz|check/i, "Try the free Heart Age Check on this page — five questions, sixty seconds, instant estimate. Scroll to 'How old is your heart?'"],
  [/token|queue|wait/i, 'After you book, you get a token number. The live bar on this site and the app shows which token is being seen right now, so you can time your arrival.'],
  [/bp|blood pressure|hypertension/i, 'High blood pressure often has no symptoms but silently damages the heart. We run a dedicated hypertension clinic — monitoring, medicine adjustment and diet guidance. Would you like to book a BP check-up?'],
  [/echo|ecg|test/i, 'We offer ECG, echocardiography and stress testing on-site, reported by the consultant on the same visit. You can book any test through the appointment form.'],
  [/video|online consult/i, "Yes — video consultations run Mon–Sat, 12–4pm. You'll receive your prescription digitally in the patient portal afterwards."],
  [/portal|report|app/i, `Your reports, prescriptions and reminders live in the ${clinic.brandName} patient portal — tap 'Patient Portal' in the menu, or see the mobile app preview under 'The App'.`],
];

const FALLBACK =
  "Good question. In the live version I'd answer with a safety-tuned medical AI. For now, ask me about fees, timings, tests, the Heart Age Check, video consultations or the patient portal.";

const GREETING = `Assalam-o-Alaikum. I'm the ${clinic.brandName} assistant — I can help you book an appointment, explain our services, or answer general heart-health questions. How can I help?`;

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ from: 'bot', text: GREETING }]);
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages((m) => [...m, { from: 'user', text }]);
    const answer = REPLIES.find(([re]) => re.test(text))?.[1] ?? FALLBACK;
    setTimeout(() => setMessages((m) => [...m, { from: 'bot', text: answer }]), 500);
  };

  return (
    <>
      <button className="ai-fab" onClick={() => setOpen((v) => !v)}>
        <svg className="ic" viewBox="0 0 24 24" style={{ stroke: '#fff' }}>
          <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H13l-4 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-7z" />
        </svg>
        Ask {clinic.brandThe} {clinic.brandName}
      </button>
      <div className={`ai-panel${open ? ' open' : ''}`}>
        <div className="ai-head">
          <div>
            <b>
              {clinic.brandThe} {clinic.brandName} Assistant
            </b>
            <span>AI health guide — not a doctor</span>
          </div>
          <button className="ai-close" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>
        <div className="ai-body" ref={bodyRef}>
          {messages.map((message, i) => (
            <div className={`msg ${message.from}`} key={i}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="ai-input">
          <input
            placeholder="Type your question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') send();
            }}
          />
          <button onClick={send}>Send</button>
        </div>
        <div className="ai-note">
          Demo assistant with sample answers. Never for emergencies — call{' '}
          {clinic.emergencyNumber}.
        </div>
      </div>
    </>
  );
}
