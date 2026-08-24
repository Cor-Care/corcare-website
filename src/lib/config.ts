// Clinic-wide constants — real values from the doctor's intake form
// (19 Aug 2026, Dr Zeeshan Malik) + address supplied by Baqir 20 Aug 2026.
export const clinic = {
  // Canonical origin for metadata, sitemap, robots, and JSON-LD.
  // Swap to 'https://thecorcare.pk' once the domain is purchased and pointed.
  siteUrl: 'https://corcare-website.vercel.app',
  brandThe: 'The',
  brandName: 'Cor Care',
  city: 'Lahore',
  doctorName: 'Dr. Zeeshan Malik',
  doctorCreds: 'MBBS, FCPS (Cardiology) · Consultant Interventional Cardiologist',
  pmdcNumber: '45087-P',
  phone: '+92 326 2000341',
  phoneHref: 'tel:+923262000341',
  whatsappHref: 'https://wa.me/923312000311',
  email: 'care@thecorcare.pk',
  emergencyNumber: '1122',
  emergencyHref: 'tel:1122',
  address: '67 CCA, Block A, Khayaban-e-Amin, Lahore',
  hoursLine: 'MON–SAT 14:00–21:00 · KHAYABAN-E-AMIN, LAHORE',
  hoursShort: '2–9 pm',
  consultationFee: 'Rs 3,000',
  followUpDays: '5',
  portalUrl: '/portal',
  appUrl: '/app',
} as const;
