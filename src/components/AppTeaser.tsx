import { clinic } from '@/lib/config';
import { Reveal } from '@/lib/motion';

export function AppTeaser() {
  return (
    <section className="dark appteaser" style={{ padding: '64px 0' }}>
      <Reveal seq className="wrap">
        <div>
          <h3>
            Your heart, in your pocket — {clinic.brandThe} {clinic.brandName} app
          </h3>
          <p>
            Appointments, reports, medicine reminders, live queue tracking — and an SOS button
            that calls {clinic.emergencyNumber} while alerting your doctor and family. One app for
            Android and iOS.
          </p>
        </div>
        <a href={clinic.appUrl} className="btn btn-ghost">
          See the app preview →
        </a>
      </Reveal>
    </section>
  );
}
