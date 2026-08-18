import { clinic } from '@/lib/config';
import { Logo } from './Logo';

export function SiteFooter() {
  return (
    <footer className="site">
      <div className="foot-ecg" aria-hidden="true">
        <svg viewBox="0 0 1560 54" preserveAspectRatio="none">
          <path
            d="M0 30 H400 l14-6 12 6 h180 l10-18 14 32 12-26 8 12 h280 l14-6 12 6 h180 l10-18 14 32 12-26 8 12 h360"
            fill="none"
            stroke="rgba(53,217,154,.25)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="wrap">
        <div className="fgrid">
          <div>
            <Logo />
            <p style={{ marginTop: 18 }}>
              Honest, specialist heart care in {clinic.city}. Book online, consult by video, and
              keep your whole heart history in one place.
            </p>
            <p className="f-urdu urdu">دل کا علاج — دیانتداری کے ساتھ</p>
          </div>
          <div>
            <h4>Explore</h4>
            <a href="#services">Services</a>
            <a href="#heartage">Heart Age Check</a>
            <a href="#about">The doctor</a>
            <a href="#book">Book a visit</a>
            <a href={clinic.portalUrl}>Patient portal</a>
            <a href={clinic.appUrl}>The app</a>
          </div>
          <div>
            <h4>Clinic</h4>
            <a href="#">{clinic.address}</a>
            <a href={clinic.phoneHref}>{clinic.phone}</a>
            <a href={`mailto:${clinic.email}`}>{clinic.email}</a>
          </div>
          <div>
            <h4>Timings</h4>
            <p>
              Mon–Sat: 5:00–9:00 pm
              <br />
              Sunday: closed
              <br />
              <br />
              Video consultations:
              <br />
              Mon–Sat: 12:00–4:00 pm
            </p>
          </div>
        </div>
        <div className="fbottom">
          <span>
            © 2026 {clinic.brandThe} {clinic.brandName}. All rights reserved.
          </span>
          <span>Built by [Your Software House]</span>
        </div>
        <p className="disclaimer">
          Content on this website is for information only and is not a substitute for professional
          medical advice, diagnosis or treatment. The Heart Age Check is an educational screening
          tool, not a diagnosis. In an emergency, call {clinic.emergencyNumber} or visit the
          nearest hospital. Development build — names, numbers, queue data and statistics are
          placeholders.
        </p>
      </div>
    </footer>
  );
}
