import { clinic } from '@/lib/config';
import { Reveal } from '@/lib/motion';

const CHECK = (
  <svg viewBox="0 0 24 24">
    <path d="m5 13 4 4L19 7" />
  </svg>
);

export function About() {
  return (
    <section id="about" className="porc">
      <div className="wrap about-grid">
        <Reveal className="about-img rv-scale">
          Clinic / doctor photo
          <br />
          (to be provided)
        </Reveal>
        <Reveal seq className="about">
          <span className="eyebrow" style={{ color: 'var(--oxblood)' }}>
            The doctor
          </span>
          <h2>Experience you can trust. Honesty you can feel.</h2>
          <p>
            {clinic.doctorName} is a consultant interventional cardiologist with 15+ years
            across Pakistan&apos;s leading cardiac centres. Thousands of families come back for
            one reason: he tells them the truth about their hearts — including when the news is
            good.
          </p>
          <div className="pull">
            &ldquo;Explain everything. Never over-treat. Treat every patient like family.&rdquo;
          </div>
          <ul className="tick">
            <li>{CHECK}MBBS, FCPS (Cardiology) · PMDC No. {clinic.pmdcNumber}</li>
            <li>{CHECK}Sir Ganga Ram Hospital · Punjab Institute of Cardiology · University of Lahore Hospital</li>
            <li>{CHECK}Angiography, angioplasty (incl. primary PCI), graft studies & pacemakers</li>
            <li>{CHECK}Consultations in Urdu and English</li>
          </ul>
          <a href="#book" className="btn btn-red">
            Consult {clinic.doctorName}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
