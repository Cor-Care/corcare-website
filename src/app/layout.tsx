import type { Metadata } from 'next';
import { Fraunces, Instrument_Sans, Spline_Sans_Mono, Noto_Nastaliq_Urdu } from 'next/font/google';
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

export const metadata: Metadata = {
  title: 'The Cor Care — Consultant Cardiology, Lahore | Dr. Zeeshan Malik',
  description:
    "The Cor Care — a consultant cardiologist's private practice in Lahore. Honest, unhurried heart care. Book online, check your heart age, live clinic queue, ECG & Echo on-site.",
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
