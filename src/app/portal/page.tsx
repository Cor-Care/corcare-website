import Link from 'next/link';
import { clinic } from '@/lib/config';

// Placeholder until the corcare-portal app deploys to portal.thecorcare.pk.
export default function PortalComingSoon() {
  return (
    <main className="dark" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 32 }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <span className="eyebrow" style={{ color: 'var(--pulse)' }}>
          Patient Portal
        </span>
        <h1 style={{ fontSize: 40, color: '#fbf7f8', marginBottom: 16 }}>Opening soon</h1>
        <p style={{ color: 'var(--fog)', marginBottom: 28 }}>
          Live queue tokens, reports, medicine reminders and your Cor Score — the{' '}
          {clinic.brandName} patient portal is being built right now.
        </p>
        <Link href="/" className="btn btn-red">
          Back to the website
        </Link>
      </div>
    </main>
  );
}
