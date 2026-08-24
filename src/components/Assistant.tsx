'use client';

import { useEffect, useRef, useState } from 'react';
import { AssistantAction, BOOKING_PREFILL_EVENT } from '@/lib/assistant';
import { clinic } from '@/lib/config';

interface Message {
  from: 'bot' | 'user';
  text: string;
  actions?: AssistantAction[];
}

// Emergencies are answered instantly on the client — never routed through the AI.
const EMERGENCY_RE = /chest pain|emergency|heart attack|saans|dard/i;
const EMERGENCY_REPLY =
  "If you're having chest pain, pressure, breathlessness or pain spreading to your arm/jaw RIGHT NOW — please call 1122 or go to the nearest emergency department immediately. Don't wait for an appointment.";

// Scripted fallbacks (regex → canned answers) used only when the AI route fails,
// so the assistant still answers the common questions offline.
const REPLIES: [RegExp, string, AssistantAction[]?][] = [
  [/book|appoint|slot|time/i, "You can book right on this page — tap 'Book a visit' above, or message us on WhatsApp and we'll confirm your slot instantly. Clinic hours are Mon–Sat, 2–9pm.", [{ type: 'book' }, { type: 'whatsapp' }]],
  [/fee|price|charge|cost/i, `Consultation fee is ${clinic.consultationFee}, with a free follow-up within ${clinic.followUpDays} days. You can pay at the clinic or online.`],
  [/heart age|quiz|check/i, "Try the free Heart Age Check on this page — five questions, sixty seconds, instant estimate. Scroll to 'How old is your heart?'"],
  [/token|queue|wait/i, 'After you book, you get a token number. The live bar on this site and the app shows which token is being seen right now, so you can time your arrival.'],
  [/bp|blood pressure|hypertension/i, 'High blood pressure often has no symptoms but silently damages the heart. We run a dedicated hypertension clinic — monitoring, medicine adjustment and diet guidance. Would you like to book a BP check-up?'],
  [/echo|ecg|test/i, 'We offer ECG, echocardiography and stress testing on-site, reported by the consultant on the same visit. You can book any test through the appointment form.'],
  [/video|online consult/i, "Yes — video consultations run Mon–Sat, 12–4pm. You'll receive your prescription digitally in the patient portal afterwards."],
  [/portal|report|app/i, `Your reports, prescriptions and reminders live in the ${clinic.brandName} patient portal — tap 'Patient Portal' in the menu, or see the mobile app preview under 'The App'.`],
];

const FALLBACK = `I couldn't reach our assistant just now. Ask me about fees, timings, tests, the Heart Age Check, video consultations or the patient portal — or call us at ${clinic.phone}.`;

const GREETING = `Assalam-o-Alaikum. I'm the ${clinic.brandName} assistant — I can help you book an appointment, explain our services, or answer general heart-health questions. How can I help?`;

const TYPING = '…';

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ from: 'bot', text: GREETING }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput('');

    if (EMERGENCY_RE.test(text)) {
      setMessages((m) => [
        ...m,
        { from: 'user', text },
        { from: 'bot', text: EMERGENCY_REPLY, actions: [{ type: 'emergency' }] },
      ]);
      return;
    }

    const history = [...messages, { from: 'user' as const, text }];
    setMessages([...history, { from: 'bot', text: TYPING }]);
    setBusy(true);

    let reply: Message;
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history
            .filter((message) => message.text !== GREETING)
            .map((message) => ({
              role: message.from === 'user' ? 'user' : 'assistant',
              content: message.text,
            })),
        }),
      });
      if (!res.ok) throw new Error(`assistant route ${res.status}`);
      const data: { reply?: string; actions?: AssistantAction[] } = await res.json();
      if (!data.reply) throw new Error('empty reply');
      reply = { from: 'bot', text: data.reply, actions: data.actions };
    } catch {
      const scripted = REPLIES.find(([re]) => re.test(text));
      reply = scripted
        ? { from: 'bot', text: scripted[1], actions: scripted[2] }
        : { from: 'bot', text: FALLBACK, actions: [{ type: 'whatsapp' }] };
    }

    setBusy(false);
    setMessages([...history, reply]);
  };

  const fillBookingForm = (action: AssistantAction) => {
    window.dispatchEvent(new CustomEvent(BOOKING_PREFILL_EVENT, { detail: action.booking ?? {} }));
    setOpen(false);
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
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
            <div key={i} style={{ display: 'contents' }}>
              <div className={`msg ${message.from}`}>{message.text}</div>
              {message.actions && message.actions.length > 0 && (
                <div className="msg-actions">
                  {message.actions.map((action) =>
                    action.type === 'book' ? (
                      <button
                        key="book"
                        className="msg-action"
                        onClick={() => fillBookingForm(action)}
                      >
                        {action.booking ? 'Review your pre-filled booking →' : 'Book a visit →'}
                      </button>
                    ) : action.type === 'whatsapp' ? (
                      <a
                        key="whatsapp"
                        className="msg-action"
                        href={clinic.whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        WhatsApp the clinic
                      </a>
                    ) : (
                      <a key="emergency" className="msg-action urgent" href={clinic.emergencyHref}>
                        Call {clinic.emergencyNumber} now
                      </a>
                    ),
                  )}
                </div>
              )}
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
          <button onClick={send} disabled={busy}>
            Send
          </button>
        </div>
        <div className="ai-note">
          AI assistant — general guidance, not medical advice. Never for emergencies — call{' '}
          {clinic.emergencyNumber}.
        </div>
      </div>
    </>
  );
}
