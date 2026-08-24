import { AppTeaser } from '@/components/AppTeaser';
import { Assistant } from '@/components/Assistant';
import { About } from '@/components/About';
import { BookingSection } from '@/components/BookingSection';
import { EmergencyStrip } from '@/components/EmergencyStrip';
import { Faq } from '@/components/Faq';
import { HeartAgeCheck } from '@/components/HeartAgeCheck';
import { Hero } from '@/components/Hero';
import { Navbar } from '@/components/Navbar';
import { QueueBar } from '@/components/QueueBar';
import { RhythmJourney } from '@/components/RhythmJourney';
import { Services } from '@/components/Services';
import { SiteFooter } from '@/components/SiteFooter';
import { Stories } from '@/components/Stories';
import { Telemetry } from '@/components/Telemetry';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { siteJsonLdString } from '@/lib/schema';

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: siteJsonLdString }} />
      <EmergencyStrip />
      <Navbar />
      <Hero />
      <Telemetry />
      <QueueBar />
      <Services />
      <HeartAgeCheck />
      <About />
      <RhythmJourney />
      <Stories />
      <BookingSection />
      <Faq />
      <AppTeaser />
      <SiteFooter />
      <WhatsAppFloat />
      <Assistant />
    </>
  );
}
