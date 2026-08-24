import { FAQS } from '@/lib/faqs';
import { Reveal } from '@/lib/motion';

export function Faq() {
  return (
    <section id="faq" style={{ paddingTop: 90 }}>
      <div className="wrap" style={{ maxWidth: 760 }}>
        <Reveal className="sec-head">
          <span className="eyebrow" style={{ color: 'var(--oxblood)' }}>
            Common questions
          </span>
          <h2>Heart questions, honest answers</h2>
          <p>
            Heart disease is Pakistan&apos;s number one cause of death — and it arrives early
            here, with first heart attacks in South Asia averaging around age 53. The answers
            below cover what patients ask us most, about the clinic and about the heart itself.
          </p>
        </Reveal>
        <Reveal seq>
          {FAQS.map((faq) => (
            <details key={faq.q} open={faq.open}>
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
