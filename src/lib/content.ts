// Verified public content. Nothing here is shown until it is real.
//
// - clinicStats: an empty list means the stats strip is not rendered. Add an entry only
//   once the number is verified, e.g.
//   { value: 15, suffix: '+', label: { en: 'years in cardiology', ur: 'سال کارڈیالوجی کا تجربہ' } }
//   (optional: `prefix` such as '<', `decimals` for values like 4.9).
// - testimonials: an empty list means the patient-stories section and its nav link are not
//   rendered. Add an entry only with a real quote and the patient's permission, e.g.
//   { quote: '...', name: 'A. Patient', place: 'LAHORE · 2026' }.

export interface ClinicStat {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix: string;
  label: { en: string; ur: string };
}

export interface Testimonial {
  quote: string;
  name: string;
  place: string;
}

export const clinicStats: readonly ClinicStat[] = [];

export const testimonials: readonly Testimonial[] = [];
