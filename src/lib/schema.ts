import { clinic } from '@/lib/config';
import { FAQS } from '@/lib/faqs';

// schema.org JSON-LD for search engines and AI answer engines (SEO/GEO).
// Rendered as a <script type="application/ld+json"> on the homepage.

const brandFull = `${clinic.brandThe} ${clinic.brandName}`;
const clinicId = `${clinic.siteUrl}/#clinic`;
const physicianId = `${clinic.siteUrl}/#physician`;

const address = {
  '@type': 'PostalAddress',
  streetAddress: '67 CCA, Block A, Khayaban-e-Amin',
  addressLocality: clinic.city,
  addressRegion: 'Punjab',
  addressCountry: 'PK',
};

export const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'MedicalClinic',
      '@id': clinicId,
      name: brandFull,
      url: clinic.siteUrl,
      description:
        "A consultant cardiologist's private practice in Lahore, Pakistan. Cardiac consultation, ECG & stress testing, echocardiography, hypertension & lipid clinic, and preventive cardiology — with online booking, video consultations, and a live clinic queue.",
      medicalSpecialty: 'Cardiovascular',
      telephone: clinic.phone,
      email: clinic.email,
      address,
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '14:00',
        closes: '21:00',
      },
      priceRange: clinic.consultationFee,
      currenciesAccepted: 'PKR',
      availableService: [
        'Cardiac consultation',
        'ECG & stress testing',
        'Echocardiography',
        'Hypertension & lipid clinic',
        'Second opinions',
        'Preventive cardiology',
        'Video consultation',
      ].map((name) => ({ '@type': 'MedicalProcedure', name })),
      employee: { '@id': physicianId },
      areaServed: { '@type': 'Country', name: 'Pakistan' },
    },
    {
      '@type': 'Physician',
      '@id': physicianId,
      name: clinic.doctorName,
      jobTitle: 'Consultant Interventional Cardiologist',
      description: `${clinic.doctorName} — MBBS, FCPS (Cardiology), PMDC No. ${clinic.pmdcNumber}. Consultant interventional cardiologist in Lahore with 15+ years across Pakistan's leading cardiac centres. Angiography, angioplasty (incl. primary PCI), graft studies & pacemakers. Consultations in Urdu and English.`,
      medicalSpecialty: 'Cardiovascular',
      telephone: clinic.phone,
      address,
      worksFor: { '@id': clinicId },
      knowsLanguage: ['en', 'ur'],
    },
    {
      '@type': 'FAQPage',
      '@id': `${clinic.siteUrl}/#faq`,
      mainEntity: FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    },
  ],
};

// Next.js docs: escape `<` so the payload can never break out of the script tag.
export const siteJsonLdString = JSON.stringify(siteJsonLd).replace(/</g, '\\u003c');
