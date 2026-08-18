interface Wave {
  tag: string;
  title: string;
  body: string;
  path: string;
  dashed?: boolean;
}

const WAVES: Wave[] = [
  {
    tag: 'P · Book',
    title: 'Book in a minute',
    body: 'Pick a slot here, in the app, or just WhatsApp us. Confirmation is instant — no queues, no phone hold music.',
    path: 'M2 20 h10 a5 5 0 0 1 10 0 h20',
  },
  {
    tag: 'QRS · Visit',
    title: 'Be seen, properly',
    body: 'A full, unhurried consultation at the clinic — or by video from home. Tests done and explained the same visit.',
    path: 'M2 20 h10 l4-6 5 14 5-24 5 20 3-4 h10',
  },
  {
    tag: 'T · Plan',
    title: 'Leave with clarity',
    body: 'A written plan in plain words. Reports, prescriptions and reminders arrive in your portal — nothing gets lost.',
    path: 'M2 20 h14 a7 7 0 0 1 14 0 h12',
  },
  {
    tag: 'R–R · Follow',
    title: 'We stay with you',
    body: 'Medicine reminders, BP tracking and follow-up nudges between visits. Your heart is watched, not forgotten.',
    path: 'M2 15 h8 m6 0 h8 m6 0 h12',
    dashed: true,
  },
];

export function RhythmJourney() {
  return (
    <section className="rhythm">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow" style={{ color: 'var(--oxblood)' }}>
            One complete beat
          </span>
          <h2>Your visit, in rhythm</h2>
          <p style={{ color: 'var(--muted)' }}>
            Like a heartbeat, good care has a rhythm — four waves, nothing skipped.
          </p>
        </div>
        <div className="rhythm-strip">
          <div className="rhythm-line" aria-hidden="true" />
          <div className="waves">
            {WAVES.map((wave) => (
              <div className="wave" key={wave.tag}>
                <div className="wv">
                  <svg viewBox="0 0 44 30">
                    <path d={wave.path} strokeDasharray={wave.dashed ? '2 5' : undefined} />
                  </svg>
                </div>
                <span className="tag-mono">{wave.tag}</span>
                <h3>{wave.title}</h3>
                <p>{wave.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
