import { T } from '@/lib/i18n';

interface Service {
  tag: string;
  title: string;
  body: string;
  iconPath: React.ReactNode;
}

const SERVICES: Service[] = [
  {
    tag: 'CONSULT',
    title: 'Cardiac consultation',
    body: 'Thorough evaluation of chest pain, palpitations, breathlessness and risk factors — with time to actually listen.',
    iconPath: (
      <>
        <path d="M4.8 8V4.8h3.2M4.8 4.8 9 9m10.2-1V4.8H16m3.2 0L15 9m-6 11a3 3 0 0 0 6 0v-5" />
        <circle cx="12" cy="9" r="3.2" />
      </>
    ),
  },
  {
    tag: 'ECG·ETT',
    title: 'ECG & stress testing',
    body: 'On-site ECG, exercise tolerance testing and Holter monitoring, reported the same visit with a plain-language explanation.',
    iconPath: <path d="M3 12h4l2.5-6 4 12 2.5-6H21" />,
  },
  {
    tag: 'ECHO',
    title: 'Echocardiography',
    body: 'Detailed heart ultrasound performed and read by the consultant — not a technician, not rushed.',
    iconPath: <path d="M12 21C7 17 3.5 13.4 3.5 9.6A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8.5 2.6c0 3.8-3.5 7.4-8.5 11.4z" />,
  },
  {
    tag: 'BP·LIPID',
    title: 'Hypertension & lipid clinic',
    body: 'Structured programmes — with on-site blood tests — that bring blood pressure and cholesterol under control before they damage the heart.',
    iconPath: (
      <>
        <path d="M12 3v6m0 0a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 8v4" />
        <path d="M5 12H3m18 0h-2" />
      </>
    ),
  },
  {
    tag: '2ND OPN',
    title: 'Second opinions',
    body: 'Honest advice on angiography, stents and surgery — we recommend only what you truly need, and say so in writing.',
    iconPath: (
      <>
        <path d="M9 12h6m-3-3v6" />
        <circle cx="12" cy="12" r="8.5" />
      </>
    ),
  },
  {
    tag: 'PREVENT',
    title: 'Preventive cardiology',
    body: 'Heart disease in the family? Screening and prevention plans for you — and the people you love.',
    iconPath: (
      <>
        <path d="M12 3.5 4.5 7v5c0 4.5 3.2 7.6 7.5 8.5 4.3-.9 7.5-4 7.5-8.5V7L12 3.5z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
];

export function Services() {
  return (
    <section id="services">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow" style={{ color: 'var(--oxblood)' }}>
            <T k="svc_eyebrow" />
          </span>
          <h2>
            <T k="svc_h2" />
          </h2>
          <p>
            <T k="svc_p" />
          </p>
        </div>
        <div className="svc-grid">
          {SERVICES.map((service) => (
            <div className="svc" key={service.tag}>
              <span className="num">{service.tag}</span>
              <svg className="ic" viewBox="0 0 24 24">
                {service.iconPath}
              </svg>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
