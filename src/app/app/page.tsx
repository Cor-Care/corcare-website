import Link from 'next/link';
import { clinic } from '@/lib/config';

// The app is not in the stores yet; until it is, point patients to the portal.
export default function AppPage() {
  return (
    <main className="dark" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 32 }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <span className="eyebrow" style={{ color: 'var(--pulse)' }}>
          The App
        </span>
        <h1 style={{ fontSize: 40, color: '#fbf7f8', marginBottom: 16 }}>Android & iOS, one app</h1>
        <p style={{ color: 'var(--fog)', marginBottom: 16 }}>
          Queue tracking, medicine streaks, family circle, your Cor Score — and an SOS button that
          calls {clinic.emergencyNumber} while sharing your live location with your doctor and
          family.
        </p>
        <p style={{ color: 'var(--fog)', marginBottom: 28 }}>
          The app isn&apos;t available to download yet. Until it is, your appointments, reports,
          medicines and the live queue are in the{' '}
          <a href={clinic.portalUrl} style={{ color: '#fbf7f8' }}>
            patient portal
          </a>
          .
        </p>
        <Link href="/" className="btn btn-red">
          Back to the website
        </Link>
      </div>
    </main>
  );
}
