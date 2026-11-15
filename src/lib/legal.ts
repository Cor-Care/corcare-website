// Shared facts for /privacy and /delete-account — every list lives here once.
// DELETED_ON_REQUEST / KEPT_BY_CLINIC mirror what process_account_deletion()
// in corcare-db actually removes and keeps (launch contract C2); keep them in
// step with the app's and portal's delete-account screens.

export const POLICY_UPDATED = '16 November 2026';

/** Removed when the clinic processes an account-deletion request. */
export const DELETED_ON_REQUEST: readonly string[] = [
  'Your sign-in: the email login and every signed-in session',
  'The notification tokens for your devices',
  'Family-circle links, in both directions',
  'Your medicine check-ins (the “taken” and “missed” taps)',
  'Your Code Red location trail',
  'Your SOS consent settings (location sharing and emergency call) and your profile picture reference',
];

/** Kept by the clinic as your medical record after the account is deleted. */
export const KEPT_BY_CLINIC: readonly string[] = [
  'Your name, phone number, date of birth and sex on the clinic record',
  'Appointments, visit history and booking requests',
  'Vitals (including readings you logged) and the medicines prescribed to you',
  'Prescriptions, reports and your Cor Score history',
  'Clinic notes, tasks and Code Red event records (time, outcome, the medical snapshot and notes — without the location trail)',
];

export interface Processor {
  name: string;
  purpose: string;
  where: string;
}

/** Services that handle personal data for Cor Care. Hosting is HOSTING_LINE, not a row here. */
export const PROCESSORS: readonly Processor[] = [
  {
    name: 'Supabase',
    purpose: 'Database, sign-in and file storage for the website, portal, app and clinic system',
    where: 'Sydney, Australia (AWS ap-southeast-2)',
  },
  {
    name: 'Resend',
    purpose: 'Sends the one-time sign-in code emails',
    where: 'USA',
  },
  {
    name: 'Expo (650 Industries)',
    purpose: 'Push service that passes app notifications to Google and Apple',
    where: 'USA',
  },
  {
    name: 'Groq',
    purpose: 'Runs the AI model that writes the website assistant’s replies',
    where: 'USA',
  },
  {
    name: 'Google',
    purpose: 'Gemini API for Cori, the doctor’s assistant; Firebase Cloud Messaging for Android notifications',
    where: 'USA and other countries where Google operates',
  },
  {
    name: 'Apple',
    purpose: 'Apple Push Notification service for iPhone notifications',
    where: 'USA',
  },
  {
    name: 'OpenStreetMap',
    purpose: 'Map images on the clinic’s Code Red map',
    where: 'United Kingdom (OpenStreetMap Foundation)',
  },
];

// Where the website, portal and clinic system run. Update at the VPS cutover.
export const HOSTING_LINE =
  'The website, the patient portal and the clinic system are hosted by Vercel Inc. in the USA, which carries the web traffic to them.';

// Exact launch-contract disclaimer (C4) — identical in both store listings and the review notes.
export const NOT_A_MEDICAL_DEVICE =
  "Cor Care is not a medical device and does not diagnose or treat any condition. The Cor Score and Heart Age Check are educational estimates — always follow your doctor's advice. In an emergency, call 1122.";

// Free-tier wording until billing is on for the clinic's Google project; then use:
// "The clinic uses Google's paid tier, under which Google does not use this content to improve its products."
export const GEMINI_LINE =
  "While the clinic uses Google's free tier, Google may use this content to improve its services; we will switch to the paid tier, where it does not, before relying on Cori for patient care.";
