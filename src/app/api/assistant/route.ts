import { AssistantAction, BookingPrefill } from '@/lib/assistant';
import { clinic } from '@/lib/config';

// Server-side proxy for the website assistant. The Groq key lives only in
// GROQ_API_KEY (env) — it must never reach the client bundle.

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'openai/gpt-oss-120b';
const MAX_HISTORY = 12;
const MAX_MESSAGE_CHARS = 1000;

const SYSTEM_PROMPT = `You are the website assistant for ${clinic.brandThe} ${clinic.brandName}, the private cardiology practice of ${clinic.doctorName} (${clinic.doctorCreds}, PMDC No. ${clinic.pmdcNumber}) in ${clinic.city}, Pakistan.

Clinic facts you may share:
- Address: ${clinic.address}. Clinic hours: Mon–Sat, 2–9 pm. Phone: ${clinic.phone}.
- Consultation fee: ${clinic.consultationFee}; a follow-up within ${clinic.followUpDays} days is free. Pay online or cash at the clinic.
- Services on-site: cardiac consultation, ECG & stress testing, echocardiography, hypertension & lipid clinic, second opinions, preventive cardiology.
- Video consultations run Mon–Sat, 12–4 pm; prescriptions arrive digitally in the patient portal.
- After booking, patients get a token number and can watch the live queue on the website and app to time their arrival.
- Reports are uploaded to the secure patient portal and can be sent on WhatsApp on request.
- Consultations are available in Urdu and English.

Rules:
- You are a health guide, not a doctor. Never diagnose, never prescribe or dose medicines, never interpret a specific patient's reports. For anything personal or clinical, warmly advise booking a consultation with ${clinic.doctorName}.
- EMERGENCIES FIRST: if the user describes current chest pain, pressure, breathlessness, pain spreading to arm/jaw, cold sweat, or any possible heart attack or stroke, tell them immediately to call ${clinic.emergencyNumber} or go to the nearest emergency department — do not continue normal conversation.
- General heart-health education (blood pressure basics, prevention, what ECG/Echo/angiography involve) is welcome — accurate, simple, reassuring in tone.
- Only state clinic facts listed above. If asked something about the clinic you don't know, say so and share the phone number ${clinic.phone} or suggest WhatsApp — never guess or invent details.
- When it fits naturally, guide the user toward booking on this page ('Book a visit') or trying the free Heart Age Check — one gentle nudge, never pushy.
- Reply in the user's language: English, Urdu (Urdu script), or Roman Urdu. Never use Hindi or Devanagari script. Keep answers short: 2–4 sentences, plain text only — no markdown, no lists, no headings.
- Stay on topic: the clinic and heart health. Politely decline anything else.

Action buttons — you can attach quick-action buttons by ending your reply with one or more tags, each on the final line:
- [[BOOK]] — jumps to the booking form. If the user wants an appointment, first collect their name, mobile number, clinic visit or video, and reason — then attach the details so the form is pre-filled for them: [[BOOK|name=Ahmed Khan|phone=0300 1234567|type=clinic|reason=BP check-up]]. Attach a plain [[BOOK]] right away if they'd rather fill it themselves. type is "clinic" or "video"; omit any detail you don't have.
- [[WHATSAPP]] — button to message the clinic on WhatsApp. Attach when the user wants to talk to a human, has an unusual request, or you can't help.
- [[EMERGENCY]] — button to call ${clinic.emergencyNumber}. ALWAYS attach this when symptoms sound urgent.
Use at most two tags per reply. The tags are stripped from the visible text — never mention buttons, tags, or brackets in your sentences.`;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

function sanitizeHistory(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const messages: ChatMessage[] = [];
  for (const entry of raw.slice(-MAX_HISTORY)) {
    if (typeof entry !== 'object' || entry === null) return null;
    const { role, content } = entry as { role?: unknown; content?: unknown };
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null;
    messages.push({ role, content: content.slice(0, MAX_MESSAGE_CHARS) });
  }
  return messages;
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'Assistant is not configured.' }, { status: 503 });
  }

  let history: ChatMessage[] | null = null;
  try {
    const body = await request.json();
    history = sanitizeHistory(body?.messages);
  } catch {
    history = null;
  }
  if (!history) {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const upstream = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
      max_tokens: 1024,
      temperature: 0.4,
      reasoning_effort: 'low',
    }),
  });

  if (!upstream.ok) {
    return Response.json({ error: 'Assistant is temporarily unavailable.' }, { status: 502 });
  }

  const data = await upstream.json();
  const rawReply: unknown = data?.choices?.[0]?.message?.content;
  if (typeof rawReply !== 'string' || !rawReply.trim()) {
    return Response.json({ error: 'Assistant is temporarily unavailable.' }, { status: 502 });
  }

  const { reply, actions } = extractActions(rawReply);
  if (!reply && actions.length === 0) {
    return Response.json({ error: 'Assistant is temporarily unavailable.' }, { status: 502 });
  }

  // A tags-only reply still needs visible text next to its buttons.
  const fallbackText =
    actions[0]?.type === 'emergency'
      ? `Please call ${clinic.emergencyNumber} or go to the nearest emergency department immediately.`
      : actions[0]?.type === 'book'
        ? 'You can book your visit right here.'
        : 'You can reach the clinic directly on WhatsApp.';

  return Response.json({ reply: reply || fallbackText, actions });
}

const ACTION_TAG_RE = /\[\[(BOOK|WHATSAPP|EMERGENCY)((?:\|[a-z]+=[^\]|]*)*)\]\]/g;

function extractActions(raw: string): { reply: string; actions: AssistantAction[] } {
  const actions: AssistantAction[] = [];
  const reply = raw
    .replace(ACTION_TAG_RE, (_match, tag: string, params: string) => {
      if (actions.some((action) => action.type === tag.toLowerCase())) return '';
      if (tag === 'BOOK') {
        actions.push({ type: 'book', booking: parseBookingParams(params) });
      } else if (tag === 'WHATSAPP') {
        actions.push({ type: 'whatsapp' });
      } else {
        actions.push({ type: 'emergency' });
      }
      return '';
    })
    .trim();
  return { reply, actions: actions.slice(0, 2) };
}

function parseBookingParams(params: string): BookingPrefill | undefined {
  const booking: BookingPrefill = {};
  for (const pair of params.split('|')) {
    const eq = pair.indexOf('=');
    if (eq < 1) continue;
    const key = pair.slice(0, eq);
    const value = pair.slice(eq + 1).trim().slice(0, 120);
    if (!value) continue;
    if (key === 'name') booking.name = value;
    else if (key === 'phone') booking.phone = value;
    else if (key === 'reason') booking.reason = value;
    else if (key === 'type' && (value === 'clinic' || value === 'video')) booking.type = value;
  }
  return Object.keys(booking).length > 0 ? booking : undefined;
}
