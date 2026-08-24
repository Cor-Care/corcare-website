'use client';

import { useState } from 'react';
import { clinic } from '@/lib/config';
import { T, useLang } from '@/lib/i18n';
import { Logo } from './Logo';
import { ScrollPulse } from './ScrollPulse';

export function Navbar() {
  const { lang, toggle } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="top">
      <div className="wrap navbar">
        <Logo wordColor="#fbf7f8" />
        <div className={`navlinks${menuOpen ? ' open' : ''}`}>
          <a href="#services" onClick={closeMenu}><T k="nav_services" /></a>
          <a href="#heartage" onClick={closeMenu}><T k="nav_heartage" /></a>
          <a href="#about" onClick={closeMenu}><T k="nav_about" /></a>
          <a href="#stories" onClick={closeMenu}><T k="nav_stories" /></a>
          <a href={clinic.portalUrl} onClick={closeMenu}><T k="nav_portal" /></a>
          <a href={clinic.appUrl} onClick={closeMenu}><T k="nav_app" /></a>
        </div>
        <div className="nav-cta">
          <button className="lang-toggle" onClick={toggle}>
            {lang === 'ur' ? 'English' : 'اردو'}
          </button>
          <a href="#book" className="btn btn-red btn-sm">
            <T k="nav_book" />
          </a>
          <button
            className={`burger${menuOpen ? ' open' : ''}`}
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round">
              <path className="bl-1" d="M4 7h16" />
              <path className="bl-2" d="M4 12h16" />
              <path className="bl-3" d="M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
      <ScrollPulse />
    </nav>
  );
}
