// Clinic-wide constants. Values in [square brackets] are placeholders
// awaiting the doctor's intake form — grep for "[" before launch.
export const clinic = {
  brandThe: 'The',
  brandName: 'Cor Care',
  city: 'Lahore',
  doctorName: 'Dr. [Full Name]',
  doctorCreds: 'MBBS, FCPS (Cardiology) · Consultant Interventional Cardiologist',
  phone: '+92 3XX XXXXXXX',
  phoneHref: 'tel:+923000000000',
  whatsappHref: 'https://wa.me/923000000000',
  email: 'care@thecorcare.pk',
  emergencyNumber: '1122',
  emergencyHref: 'tel:1122',
  address: '[Clinic address], DHA, Lahore',
  hoursLine: 'MON–SAT 17:00–21:00 · DHA LAHORE',
  consultationFee: 'Rs [3,000]',
  followUpDays: '[7]',
  portalUrl: '/portal',
  appUrl: '/app',
} as const;
