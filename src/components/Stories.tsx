import { Reveal } from '@/lib/motion';

// Small heartbeat line each card carries between quote and attribution.
const STORY_ECG = 'M0 9 H44 l4-6 4 10 3-7 3 3 H120';

const STORIES = [
  {
    quote:
      "Doctor sahib explained my father's angiography report in simple Urdu and told us honestly that he did not need a stent. That honesty is rare.",
    name: 'M. Ahmed',
    place: 'LAHORE · 2026',
  },
  {
    quote:
      'Booked online at night, confirmation came on WhatsApp within a minute. No standing in line for hours. Very organised clinic.',
    name: 'S. Fatima',
    place: 'GUJRANWALA · 2026',
  },
  {
    quote:
      'My BP is finally controlled after years. The reminders and diet plan in the app kept me on track between visits.',
    name: 'R. Khan',
    place: 'LAHORE · 2026',
  },
];

export function Stories() {
  return (
    <section id="stories" className="porc">
      <div className="wrap">
        <Reveal className="sec-head center">
          <span className="eyebrow" style={{ color: 'var(--oxblood)' }}>
            Patient stories
          </span>
          <h2>Trusted by thousands of families</h2>
          <p>Sample content for the demo — real testimonials will be collected with permission.</p>
        </Reveal>
        <Reveal seq className="stories-grid">
          {STORIES.map((story) => (
            <div className="story" key={story.name}>
              <span className="mark">&ldquo;</span>
              <p>{story.quote}</p>
              <svg className="story-ecg" viewBox="0 0 120 16" aria-hidden="true">
                <path d={STORY_ECG} pathLength={100} />
              </svg>
              <footer>
                <b>{story.name}</b>
                <br />
                {story.place}
              </footer>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
