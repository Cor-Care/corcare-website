'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'ur';

const en = {
  nav_services: 'Services',
  nav_heartage: 'Heart Age Check',
  nav_about: 'The Doctor',
  nav_stories: 'Patients',
  nav_portal: 'Patient Portal',
  nav_app: 'The App',
  nav_book: 'Book a visit',
  hero_eyebrow: 'Consultant Cardiology · Lahore',
  hero_lead:
    "Unhurried consultations, clear explanations in Urdu or English, and honest advice — including when you don't need a procedure. Book online in under a minute; confirmation lands on WhatsApp.",
  hero_cta1: 'Book an appointment',
  hero_cta2: 'WhatsApp the clinic',
  stat1: 'years in cardiology',
  stat2: 'patients treated',
  stat3: 'average patient rating',
  stat4: 'average waiting time',
  svc_eyebrow: 'What we treat',
  svc_h2: 'Complete cardiac care, one specialist, one roof',
  svc_p: 'From a first check-up to advanced intervention — every scan performed and explained by the consultant himself, never delegated.',
  ha_eyebrow: 'Free · 60 seconds',
  ha_h2: 'How old is your heart?',
  ha_p: 'Your heart can age faster than you do. Answer five quick questions and get an instant estimate of your heart age — no registration, no phone number, nothing to pay.',
  book_eyebrow: 'Appointments',
  book_h2: 'Reserve your slot in under a minute',
};

const ur: Partial<Record<keyof typeof en, string>> = {
  nav_services: 'خدمات',
  nav_heartage: 'دل کی عمر معلوم کریں',
  nav_about: 'ڈاکٹر کا تعارف',
  nav_stories: 'مریضوں کی آراء',
  nav_portal: 'پیشنٹ پورٹل',
  nav_app: 'موبائل ایپ',
  nav_book: 'اپائنٹمنٹ بک کریں',
  hero_eyebrow: 'ماہرِ امراضِ قلب · لاہور',
  hero_lead:
    'سکون سے معائنہ، اردو یا انگریزی میں مکمل وضاحت، اور دیانتدارانہ مشورہ — بشمول اُس وقت جب آپ کو کسی پروسیجر کی ضرورت نہ ہو۔ ایک منٹ سے کم میں آن لائن بکنگ، تصدیق واٹس ایپ پر۔',
  hero_cta1: 'اپائنٹمنٹ بک کریں',
  hero_cta2: 'کلینک کو واٹس ایپ کریں',
  stat1: 'سال کارڈیالوجی کا تجربہ',
  stat2: 'مریضوں کا علاج',
  stat3: 'اوسط ریٹنگ',
  stat4: 'اوسط انتظار',
  svc_eyebrow: 'خدمات',
  svc_h2: 'دل کا مکمل علاج — ایک ماہر، ایک چھت',
  svc_p: 'پہلے چیک اپ سے جدید علاج تک — ہر ٹیسٹ ماہر خود کرتا اور سمجھاتا ہے۔',
  ha_eyebrow: 'مفت · صرف ساٹھ سیکنڈ',
  ha_h2: 'آپ کے دل کی عمر کتنی ہے؟',
  ha_p: 'دل آپ سے تیز بوڑھا ہو سکتا ہے۔ پانچ آسان سوالوں کے جواب دیں اور فوراً اپنے دل کی تخمینی عمر جانیں — نہ رجسٹریشن، نہ فون نمبر، نہ کوئی فیس۔',
  book_eyebrow: 'اپائنٹمنٹ',
  book_h2: 'ایک منٹ سے کم میں اپنی باری محفوظ کریں',
};

export type I18nKey = keyof typeof en;

interface LangContextValue {
  lang: Lang;
  toggle: () => void;
  /** Translated string for the current language (English fallback). */
  t: (key: I18nKey) => string;
  /** True when the current language renders this key in Urdu (RTL styling needed). */
  isUrdu: (key: I18nKey) => boolean;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const toggle = useCallback(() => setLang((l) => (l === 'en' ? 'ur' : 'en')), []);
  const t = useCallback((key: I18nKey) => (lang === 'ur' && ur[key]) || en[key], [lang]);
  const isUrdu = useCallback((key: I18nKey) => lang === 'ur' && Boolean(ur[key]), [lang]);
  return <LangContext.Provider value={{ lang, toggle, t, isUrdu }}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}

/** Convenience: translated text span that self-applies Urdu RTL styling. */
export function T({ k, className }: { k: I18nKey; className?: string }) {
  const { t, isUrdu } = useLang();
  const cls = [className, isUrdu(k) ? 'urdu' : null].filter(Boolean).join(' ');
  return <span className={cls || undefined}>{t(k)}</span>;
}
