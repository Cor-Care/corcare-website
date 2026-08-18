const FAQS: { q: string; a: string; open?: boolean }[] = [
  {
    q: 'What should I bring to my first appointment?',
    a: 'Any previous reports (ECG, Echo, angiography, blood tests), your current medicines, and your questions. No reports? No problem — we can start fresh.',
    open: true,
  },
  {
    q: 'Do you offer video consultations?',
    a: 'Yes. Patients from other cities, or those unable to travel, can consult by video and receive their prescription digitally in the patient portal.',
  },
  {
    q: 'How does live token tracking work?',
    a: 'After booking you get a token number. The website and app show which token is currently being seen, so you can leave home at the right time instead of waiting at the clinic.',
  },
  {
    q: 'How do I get my reports?',
    a: 'Reports are uploaded to your secure patient portal, and can be sent on WhatsApp on request.',
  },
  {
    q: 'Is online payment secure?',
    a: 'Yes — payments run through licensed Pakistani payment gateways. Cash at the clinic is always fine too.',
  },
  {
    q: 'What if I have chest pain right now?',
    a: 'Do not wait for an appointment. Call 1122 or go to the nearest emergency department immediately.',
  },
];

export function Faq() {
  return (
    <section id="faq" style={{ paddingTop: 90 }}>
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div className="sec-head">
          <span className="eyebrow" style={{ color: 'var(--oxblood)' }}>
            Common questions
          </span>
          <h2>Before you visit</h2>
        </div>
        {FAQS.map((faq) => (
          <details key={faq.q} open={faq.open}>
            <summary>{faq.q}</summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
