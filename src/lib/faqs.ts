import { clinic } from '@/lib/config';

// Single source of truth for FAQ content: rendered by <Faq/> and mirrored
// into the FAQPage JSON-LD in lib/schema.ts so the two can never drift.
export type FaqItem = { q: string; a: string; open?: boolean };

export const FAQS: FaqItem[] = [
  {
    q: 'What should I bring to my first appointment?',
    a: 'Any previous reports (ECG, Echo, angiography, blood tests), your current medicines, and your questions. No reports? No problem — we can start fresh.',
    open: true,
  },
  {
    q: 'What is the consultation fee?',
    a: `Consultation with ${clinic.doctorName} is ${clinic.consultationFee}, and a follow-up visit within ${clinic.followUpDays} days is free. You can pay online when booking, or in cash at the clinic.`,
  },
  {
    q: 'When should I see a cardiologist?',
    a: 'See one promptly for chest pain or tightness, breathlessness on stairs or walking, a racing or skipping heartbeat, or fainting spells. Even without symptoms, if you have diabetes, high blood pressure, a smoking habit, or a parent or sibling with early heart disease, a baseline check from around age 35–40 is wise — South Asians develop heart disease earlier than most of the world.',
  },
  {
    q: 'What are the warning signs of a heart attack?',
    a: 'A pressure, heaviness, or burning in the centre of the chest — often spreading to the left arm, jaw, neck, or back — with cold sweat, nausea, or breathlessness. In women, the elderly, and people with diabetes the signs can be milder: unusual fatigue, indigestion-like discomfort, or breathlessness alone. If this is happening, call 1122 now; do not drive yourself.',
  },
  {
    q: 'Why do heart attacks happen so young in Pakistan?',
    a: 'Heart disease is the leading cause of death in Pakistan, and it strikes early: South Asians tend to develop diabetes and high cholesterol 10–20 years sooner than other populations, and the average first heart attack in South Asia occurs around age 53 — years earlier than in the West. Genetics play a part, but smoking, uncontrolled sugar and blood pressure, and skipped checkups do most of the damage — and those can all be changed.',
  },
  {
    q: 'What is the difference between an ECG and an Echo?',
    a: "An ECG records the heart's electrical activity — it takes five minutes and shows rhythm problems and signs of a heart attack. An Echo (echocardiogram) is an ultrasound movie of the heart — it shows how strongly the heart pumps and how the valves work. They answer different questions, so your doctor may advise both. Both are done on-site at the clinic.",
  },
  {
    q: 'What happens during an angiography? Is it painful?',
    a: 'Angiography is a day procedure done under local anaesthesia, usually through a small puncture in the wrist. A thin tube and dye let us see the heart arteries on X-ray and find any blockages — it typically takes under 30 minutes, you stay awake, and most patients feel only pressure at the wrist and go home the same day.',
  },
  {
    q: 'If I have a blockage, will I always need a stent or bypass?',
    a: 'No. Many blockages are best treated with medicines and lifestyle changes alone — it depends on where the blockage is, how severe it is, and your symptoms. Our promise is honest advice: you will be told plainly when a procedure is needed, and just as plainly when it is not.',
  },
  {
    q: 'What should my blood pressure be?',
    a: 'For most adults, below 140/90 — and closer to 120/80 is healthier still. High blood pressure usually causes no symptoms at all, which is why it quietly damages the heart, brain, and kidneys for years. Check it regularly, and if you also have diabetes or high cholesterol, our hypertension and lipid clinic can manage them together.',
  },
  {
    q: 'How can I lower my risk of heart disease?',
    a: 'Five things matter most: stop smoking (including sheesha), walk briskly 30 minutes a day, cut down fried food, ghee, and sugary drinks, keep blood sugar and blood pressure controlled, and get a checkup — yearly after 40, earlier if heart disease runs in your family. Small, boring habits prevent most heart attacks.',
  },
  {
    q: 'Do you offer video consultations?',
    a: 'Yes. Patients from other cities, or those unable to travel, can consult by video and receive their prescription digitally in the patient portal.',
  },
  {
    q: 'How does live token tracking work?',
    a: 'After booking you get a token number. The website and app show which token is currently being seen, so you can leave home at the right time instead of waiting at the clinic.',
  },
  {
    q: 'How do I get my reports?',
    a: 'Reports are uploaded to your secure patient portal, and can be sent on WhatsApp on request.',
  },
  {
    q: 'Is online payment secure?',
    a: 'Yes — payments run through licensed Pakistani payment gateways. Cash at the clinic is always fine too.',
  },
  {
    q: 'What if I have chest pain right now?',
    a: 'Do not wait for an appointment. Call 1122 or go to the nearest emergency department immediately.',
  },
];
