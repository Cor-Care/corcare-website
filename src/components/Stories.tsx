import { testimonials } from '@/lib/content';
import { Reveal } from '@/lib/motion';

// Small heartbeat line each card carries between quote and attribution.
const STORY_ECG = 'M0 9 H44 l4-6 4 10 3-7 3 3 H120';

export function Stories() {
  if (testimonials.length === 0) return null;

  return (
    <section id="stories" className="porc">
      <div className="wrap">
        <Reveal className="sec-head center">
          <span className="eyebrow" style={{ color: 'var(--oxblood)' }}>
            Patient stories
          </span>
          <h2>What patients say</h2>
        </Reveal>
        <Reveal seq className="stories-grid">
          {testimonials.map((story) => (
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
