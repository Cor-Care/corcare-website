import Link from 'next/link';
import type { ReactNode } from 'react';
import { POLICY_UPDATED } from '@/lib/legal';
import { Logo } from './Logo';
import { SiteFooter } from './SiteFooter';

interface LegalPageProps {
  title: string;
  children: ReactNode;
}

// Shell for the plain-text legal pages (/privacy, /delete-account): no Navbar,
// just the logo and a way back, then the shared footer.
export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <>
      <header className="legal-top">
        <div className="wrap legal-bar">
          <Logo />
          <Link href="/" className="legal-back">
            ← Back to the website
          </Link>
        </div>
      </header>
      <main className="legal">
        <h1>{title}</h1>
        <p className="legal-date">{`Last updated ${POLICY_UPDATED}`}</p>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

export function LegalList({ items }: { items: readonly string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
