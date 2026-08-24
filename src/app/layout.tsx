import type { Metadata } from 'next';
import { Fraunces, Instrument_Sans, Spline_Sans_Mono, Noto_Nastaliq_Urdu } from 'next/font/google';
import { clinic } from '@/lib/config';
import { LangProvider } from '@/lib/i18n';
import './globals.css';

const serif = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});
const sans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-sans',
});
const mono = Spline_Sans_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});
const urdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '600'],
  variable: '--font-urdu',
});

const siteTitle = 'The Cor Care — Consultant Cardiologist in Lahore | Dr. Zeeshan Malik';
const siteDescription =
  "The Cor Care — a consultant cardiologist's private practice in Lahore, Pakistan. Honest, unhurried heart care. Book online, check your heart age, live clinic queue, ECG & Echo on-site.";

export const metadata: Metadata = {
  metadataBase: new URL(clinic.siteUrl),
  title: siteTitle,
  description: siteDescription,
  keywords: [
    'cardiologist in Lahore',
    'best cardiologist Lahore',
    'heart specialist Lahore',
    'interventional cardiologist Pakistan',
    'Dr Zeeshan Malik cardiologist',
    'ECG test Lahore',
    'echocardiography Lahore',
    'angiography Lahore',
    'heart checkup Pakistan',
    'online cardiologist consultation Pakistan',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: `${clinic.brandThe} ${clinic.brandName}`,
    locale: 'en_PK',
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: 'summary',
    title: siteTitle,
    description: siteDescription,
  },
  robots: { index: true, follow: true },
  category: 'Health',
  other: {
    'geo.region': 'PK-PB',
    'geo.placename': 'Lahore',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} ${mono.variable} ${urdu.variable}`}>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
