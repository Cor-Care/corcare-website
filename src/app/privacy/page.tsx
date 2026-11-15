import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalList, LegalPage } from '@/components/LegalPage';
import { clinic } from '@/lib/config';
import {
  DELETED_ON_REQUEST,
  GEMINI_LINE,
  HOSTING_LINE,
  KEPT_BY_CLINIC,
  NOT_A_MEDICAL_DEVICE,
  PROCESSORS,
} from '@/lib/legal';

export const metadata: Metadata = {
  title: `Privacy policy — ${clinic.brandName}`,
  description: `What ${clinic.brandName}'s website, patient portal, app and clinic system collect, why, where it is processed, and how to delete your account.`,
  alternates: { canonical: '/privacy' },
};

const siteHost = new URL(clinic.siteUrl).host;
const portalHost = new URL(clinic.portalUrl).host;

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy">
      <h2>Who we are</h2>
      <p>
        {clinic.brandName} is the private cardiology practice of {clinic.doctorName} (
        {clinic.doctorCreds}, PMDC No. {clinic.pmdcNumber}) at {clinic.address}. In this policy
        “we” and “the clinic” mean {clinic.brandName}. The clinic decides how your information is
        used and is responsible for it.
      </p>

      <h2>What this policy covers</h2>
      <p>
        Everything {clinic.brandName} runs: this website (<a href={clinic.siteUrl}>{siteHost}</a>),
        the patient portal (<a href={clinic.portalUrl}>{portalHost}</a>), the {clinic.brandName} app
        for Android and iPhone, and the clinic’s own system that staff use for appointments,
        records and Code Red alerts — including Cori, the doctor’s WhatsApp assistant.
      </p>

      <CollectedData />
      <CodeRed />
      <Notifications />
      <FamilyCircle />

      <h2>Cori, the doctor’s assistant</h2>
      <p>
        Cori is the doctor’s assistant inside the doctor’s own WhatsApp, and it takes
        instructions only from the doctor. When the doctor asks Cori about your record, or sends
        it a note, voice note or photo about your care, that message and the relevant parts of
        your record are processed by Google’s Gemini API to answer the doctor and update the
        clinic system. {GEMINI_LINE}
      </p>
      <p>
        Cori never messages patients on its own. It sends a WhatsApp message to a patient only
        when the doctor explicitly asks it to. The doctor’s instructions, Cori’s replies and any
        such message travel through WhatsApp, end-to-end encrypted.
      </p>

      <Processing />

      <h2>What we never do</h2>
      <ul>
        <li>No advertising, and we never sell your data.</li>
        <li>No analytics, and no tracking of you across other apps or websites.</li>
        <li>No payment details — patients pay at the clinic.</li>
      </ul>

      <Retention />
      <Rights />

      <h2>Children</h2>
      <p>
        The portal and app are not meant for children under 13 to use on their own. A parent or
        guardian registers and manages a child’s account.
      </p>

      <h2>Not a medical device</h2>
      <p className="legal-note">{NOT_A_MEDICAL_DEVICE}</p>

      <h2>Changes and contact</h2>
      <p>
        If we change what we collect or how we use it, we will update this page and the date at
        the top.
      </p>
      <p>
        Questions about your data: call <a href={clinic.phoneHref}>{clinic.phone}</a>, WhatsApp{' '}
        <a href={clinic.whatsappHref}>{clinic.whatsappDisplay}</a>, email{' '}
        <a href={`mailto:${clinic.email}`}>{clinic.email}</a>, or visit the clinic at{' '}
        {clinic.address} (Mon–Sat {clinic.hoursShort}).
      </p>
    </LegalPage>
  );
}

function CollectedData() {
  return (
    <>
      <h2>What we collect and why</h2>
      <h3>On this website</h3>
      <ul>
        <li>
          <b>Booking request.</b> Your name, phone number, preferred date, the reason for your visit
          and your language. Clinic staff use it to call you back and arrange your appointment.
        </li>
        <li>
          <b>Heart Age Check.</b> Your age and answers, saved anonymously — no name or phone
          number. It is linked to a booking request only if you book from your result.
        </li>
        <li>
          <b>Website assistant.</b> Your messages go through our server to Groq, which runs the AI
          model (openai/gpt-oss-120b) that writes the reply. We do not store the conversation.
          Please don’t type personal medical details there — book a visit instead. If you give the
          assistant your name and number to fill in the booking form, nothing reaches the clinic
          until you send that form yourself.
        </li>
        <li>No analytics, and no advertising or tracking cookies.</li>
      </ul>
      <h3>Your portal and app account</h3>
      <ul>
        <li>
          <b>Email address.</b> You sign in with a one-time code sent to your email; the code
          emails are sent by Resend.
        </li>
        <li>
          <b>Name</b>, and your <b>date of birth</b> if you give it when you register on the portal.
        </li>
        <li>
          <b>Phone number</b> — the one on your clinic record or in your booking requests.
        </li>
        <li>
          <b>Account ID</b> — a random identifier that links your records, devices and check-ins
          to your account.
        </li>
        <li>
          Your sign-in session is kept on your device (in the app, or in your browser for the
          portal) so you stay signed in.
        </li>
      </ul>
      <h3>Your health record</h3>
      <p>
        Your record at the clinic holds your appointments, the booking requests you send from the
        app and your queue tokens, vitals (including the readings you log yourself), medicines and
        your “taken” and “missed” check-ins, prescriptions, reports and your Cor Score. Staff also record conditions on file, clinic
        notes and tasks; notes and tasks are seen only by clinic staff. Prescriptions appear in
        the portal and app only after the clinic approves them. The clinic uses your record to
        care for you.
      </p>
    </>
  );
}

function CodeRed() {
  return (
    <>
      <h2>Code Red (SOS)</h2>
      <p>
        Code Red starts only when you press SOS — nothing about your location is collected before
        that. In the app, once you press it, we receive:
      </p>
      <ul>
        <li>
          your location — precise, or approximate if that is all your phone allows — about every
          15 seconds for up to 60 minutes or until the Code Red is ended, if you allowed location
          sharing. It keeps going if you switch away from the app, and your phone shows a “Code
          Red active” notification while it runs;
        </li>
        <li>your battery level;</li>
        <li>
          a medical snapshot: your name, date of birth, sex and phone number, the conditions on
          file, your medicines, your latest blood pressure and heart rate, and your Cor Score.
          Your emergency contacts are never included.
        </li>
      </ul>
      <p>In the portal, pressing SOS sends one location reading if your browser allows it.</p>
      <p>
        This goes to the clinic and to your accepted family circle. The {clinic.emergencyNumber}{' '}
        call is placed by your own phone and is not recorded by us. A Test SOS (More → Test SOS in
        the app) runs the same steps without calling {clinic.emergencyNumber} and is marked TEST
        for the clinic and your family.
      </p>
      <p>
        The clinic’s Code Red map loads its map images from OpenStreetMap, which sees the area
        being shown but not who you are. “Open in Maps” hands the location to a maps app (such as
        Google Maps) only when someone taps it.
      </p>
    </>
  );
}

function Notifications() {
  return (
    <>
      <h2>Notifications</h2>
      <p>
        If you allow notifications, the app registers one push token for each of your devices.
        Notifications are sent through Expo’s push service, which hands them to Google Firebase
        Cloud Messaging (Android) or Apple Push Notification service (iPhone). They can include an
        appointment time (“Your visit on … is confirmed”), a prescription approval or, for family
        members, “Code Red: &lt;name&gt;”.
      </p>
      <p>
        Medicine reminders are scheduled on your phone only; they are not sent from our servers.
        You can turn notifications off in your phone’s settings.
      </p>
    </>
  );
}

function FamilyCircle() {
  return (
    <>
      <h2>Family circle</h2>
      <p>
        A family member linked to your account can see your record only after they accept the
        link. Accepted family members can see your profile details, appointments, vitals, medicines
        and check-ins, approved prescriptions, reports, Cor Score and queue token — and, during a
        Code Red, your location and medical snapshot, with a Code Red notification on their phone.
        They cannot see clinic notes, tasks or your booking requests.
      </p>
      <p>
        During a Code Red the clinic can see your accepted family members’ names and phone numbers
        so it can call them. Ask the clinic to remove a family link at any time.
      </p>
    </>
  );
}

function Processing() {
  return (
    <>
      <h2>Where your data is processed</h2>
      <div className="legal-table">
        <table>
          <thead>
            <tr>
              <th scope="col">Service</th>
              <th scope="col">What it does for us</th>
              <th scope="col">Where</th>
            </tr>
          </thead>
          <tbody>
            {PROCESSORS.map((processor) => (
              <tr key={processor.name}>
                <td>{processor.name}</td>
                <td>{processor.purpose}</td>
                <td data-label="Where">{processor.where}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>{HOSTING_LINE}</p>
      <p>
        Your data travels encrypted (HTTPS). The database applies row-level access rules, so each
        person can open only the records they are allowed to see, and prescription and report
        files are kept in private storage. Our hosting and database providers keep technical logs
        of requests (such as IP address and device type) to run and protect the service.
      </p>
    </>
  );
}

function Retention() {
  return (
    <>
      <h2>How long we keep data</h2>
      <p>
        Your sign-in and app data are kept until you delete your account (see{' '}
        <Link href="/delete-account">Delete your account</Link>). Your medical record is kept for
        as long as medical record-keeping rules require, even after your account is deleted.
        Anonymous Heart Age Check results are kept as statistics. Cori keeps the doctor’s
        conversation history, which can include details from your record, on the computer it runs
        on, and the conversation also stays in the doctor’s WhatsApp.
      </p>
      <h3>Deleted when you delete your account</h3>
      <LegalList items={DELETED_ON_REQUEST} />
      <h3>Kept by the clinic</h3>
      <LegalList items={KEPT_BY_CLINIC} />
    </>
  );
}

function Rights() {
  return (
    <>
      <h2>Your choices and rights</h2>
      <ul>
        <li>See your own record in the portal or the app.</li>
        <li>Ask the clinic to correct anything that is wrong — by phone, WhatsApp or email.</li>
        <li>
          Turn SOS location sharing on or off in the app under More → SOS location sharing, or in
          your phone’s settings.
        </li>
        <li>Turn notifications off in your phone’s settings.</li>
        <li>
          Delete your account at any time — see{' '}
          <Link href="/delete-account">Delete your account</Link>.
        </li>
      </ul>
    </>
  );
}
