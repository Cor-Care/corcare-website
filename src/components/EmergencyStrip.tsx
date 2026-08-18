import { clinic } from '@/lib/config';

export function EmergencyStrip() {
  return (
    <div className="strip">
      <div className="wrap">
        <div>
          <span className="em">Chest pain right now?</span> Call{' '}
          <a className="em-call" href={clinic.emergencyHref}>
            {clinic.emergencyNumber}
          </a>{' '}
          — do not wait for an appointment · or press SOS in the app
        </div>
        <div className="mono" style={{ fontSize: 12 }}>
          {clinic.hoursLine} · <b>{clinic.phone}</b>
        </div>
      </div>
    </div>
  );
}
