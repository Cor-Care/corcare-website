'use client';

import { clinicStats } from '@/lib/content';
import { useLang } from '@/lib/i18n';
import { CountUp, Reveal } from '@/lib/motion';

export function Telemetry() {
  const { lang } = useLang();
  if (clinicStats.length === 0) return null;

  return (
    <div className="telemetry">
      <Reveal seq className="wrap">
        {clinicStats.map((stat) => (
          <div className="tele" key={stat.label.en}>
            <b>
              {stat.prefix}
              <CountUp value={stat.value} decimals={stat.decimals} />
              <i>{stat.suffix}</i>
            </b>
            <span className={lang === 'ur' ? 'urdu' : undefined}>{stat.label[lang]}</span>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
