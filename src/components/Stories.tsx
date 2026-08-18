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
        <div className="sec-head center">
          <span className="eyebrow" style={{ color: 'var(--oxblood)' }}>
            Patient stories
          </span>
          <h2>Trusted by thousands of families</h2>
          <p>Sample content for the demo — real testimonials will be collected with permission.</p>
        </div>
        <div className="stories-grid">
          {STORIES.map((story) => (
            <div className="story" key={story.name}>
              <span className="mark">&ldquo;</span>
              <p>{story.quote}</p>
              <footer>
                <b>{story.name}</b>
                <br />
                {story.place}
              </footer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
