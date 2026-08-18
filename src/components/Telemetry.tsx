import { T } from '@/lib/i18n';

export function Telemetry() {
  return (
    <div className="telemetry">
      <div className="wrap">
        <div className="tele">
          <b>
            15<i>+</i>
          </b>
          <span>
            <T k="stat1" />
          </span>
        </div>
        <div className="tele">
          <b>
            20,000<i>+</i>
          </b>
          <span>
            <T k="stat2" />
          </span>
        </div>
        <div className="tele">
          <b>
            4.9<i>/5</i>
          </b>
          <span>
            <T k="stat3" />
          </span>
        </div>
        <div className="tele">
          <b>
            &lt;15<i>min</i>
          </b>
          <span>
            <T k="stat4" />
          </span>
        </div>
      </div>
    </div>
  );
}
