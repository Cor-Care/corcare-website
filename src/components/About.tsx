import { clinic } from '@/lib/config';

const CHECK = (
  <svg viewBox="0 0 24 24">
    <path d="m5 13 4 4L19 7" />
  </svg>
);

export function About() {
  return (
    <section id="about" className="porc">
      <div className="wrap about-grid">
        <div className="about-img">
          Clinic / doctor photo
          <br />
          (to be provided)
        </div>
        <div className="about">
          <span className="eyebrow" style={{ color: 'var(--oxblood)' }}>
            The doctor
          </span>
          <h2>Experience you can trust. Honesty you can feel.</h2>
          <p>
            {clinic.doctorName} is a consultant cardiologist with [15+] years across
            Pakistan&apos;s leading cardiac centres. Thousands of families come back for one
            reason: he tells them the truth about their hearts — including when the news is good.
          </p>
          <div className="pull">
            &ldquo;Explain everything. Never over-treat. Treat every patient like family.&rdquo;
          </div>
          <ul className="tick">
            <li>{CHECK}MBBS, FCPS (Cardiology) — [College/University]</li>
            <li>{CHECK}Fellowship / training at [Institution]</li>
            <li>{CHECK}[20,000+] patients treated · [X,000+] procedures</li>
            <li>{CHECK}Consultations in Urdu, English and Punjabi</li>
          </ul>
          <a href="#book" className="btn btn-red">
            Consult {clinic.doctorName.replace('[Full Name]', '[Name]')}
          </a>
        </div>
      </div>
    </section>
  );
}
