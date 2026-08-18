import Link from 'next/link';
import { clinic } from '@/lib/config';

// Placeholder until the corcare-app (Expo) preview page is ready.
export default function AppComingSoon() {
  return (
    <main className="dark" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 32 }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <span className="eyebrow" style={{ color: 'var(--pulse)' }}>
          The App
        </span>
        <h1 style={{ fontSize: 40, color: '#fbf7f8', marginBottom: 16 }}>Android & iOS, one app</h1>
        <p style={{ color: 'var(--fog)', marginBottom: 28 }}>
          Queue tracking, medicine streaks, family circle, your Cor Score — and an SOS button that
          calls {clinic.emergencyNumber} while sharing your live location with your doctor and
          family. Coming with Phase 2.
        </p>
        <Link href="/" className="btn btn-red">
          Back to the website
        </Link>
      </div>
    </main>
  );
}
