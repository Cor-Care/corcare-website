// Clinic-wide constants — real values from the doctor's intake form
// (19 Aug 2026, Dr Zeeshan Malik) + address supplied by Baqir 20 Aug 2026.
export const clinic = {
  // Canonical origin for metadata, sitemap, robots, and JSON-LD.
  // Live on thecorcare.com since Sep 2026; the apex 308s to www, so www is canonical.
  siteUrl: 'https://www.thecorcare.com',
  brandName: 'Cor Care',
  city: 'Lahore',
  doctorName: 'Dr. Zeeshan Malik',
  doctorCreds: 'MBBS, FCPS (Cardiology) · Consultant Interventional Cardiologist',
  pmdcNumber: '45087-P',
  phone: '+92 326 2000341',
  phoneHref: 'tel:+923262000341',
  whatsappHref: 'https://wa.me/923312000311',
  whatsappDisplay: '+92 331 2000311',
  email: 'care@thecorcare.com',
  emergencyNumber: '1122',
  emergencyHref: 'tel:1122',
  address: '67 CCA, Block A, Khayaban-e-Amin, Lahore',
  hoursLine: 'MON–SAT 14:00–21:00 · KHAYABAN-E-AMIN, LAHORE',
  hoursShort: '2–9 pm',
  consultationFee: 'Rs 3,000',
  followUpDays: '5',
  portalUrl: 'https://portal.thecorcare.com',
  appUrl: '/app',
  // keep in sync: website / portal / app
  accountDeletionDays: 30,
} as const;

// Official social profiles, supplied 19 Nov 2026; Instagram and X added
// 25 Nov 2026. Shown in the footer and listed as `sameAs` in the homepage
// JSON-LD, so each entry must be the profile itself (not a post or photo).
export const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61596829883145' },
  { label: 'Instagram', href: 'https://www.instagram.com/thecorcare/' },
  { label: 'X', href: 'https://x.com/thecorcare' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/145456710/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@thecorcare' },
  { label: 'Google reviews', href: 'https://share.google/PMjX2JtWbVUBBBSXw' },
] as const;
