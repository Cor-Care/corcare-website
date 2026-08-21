import { T } from '@/lib/i18n';
import { CountUp, Reveal } from '@/lib/motion';

export function Telemetry() {
  return (
    <div className="telemetry">
      <Reveal seq className="wrap">
        <div className="tele">
          <b>
            <CountUp value={15} duration={1100} />
            <i>+</i>
          </b>
          <span>
            <T k="stat1" />
          </span>
        </div>
        <div className="tele">
          <b>
            <CountUp value={20000} />
            <i>+</i>
          </b>
          <span>
            <T k="stat2" />
          </span>
        </div>
        <div className="tele">
          <b>
            <CountUp value={4.9} decimals={1} duration={1200} />
            <i>/5</i>
          </b>
          <span>
            <T k="stat3" />
          </span>
        </div>
        <div className="tele">
          <b>
            &lt;
            <CountUp value={15} duration={1100} />
            <i>min</i>
          </b>
          <span>
            <T k="stat4" />
          </span>
        </div>
      </Reveal>
    </div>
  );
}
