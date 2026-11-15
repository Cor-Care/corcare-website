import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalList, LegalPage } from '@/components/LegalPage';
import { clinic } from '@/lib/config';
import { DELETED_ON_REQUEST, KEPT_BY_CLINIC } from '@/lib/legal';

export const metadata: Metadata = {
  title: `Delete your account — ${clinic.brandName}`,
  description: `How to delete your ${clinic.brandName} app and portal account, what is deleted, and what the clinic keeps as your medical record.`,
  alternates: { canonical: '/delete-account' },
};

export default function DeleteAccountPage() {
  return (
    <LegalPage title="Delete your account">
      <p>
        You can ask the clinic to delete your {clinic.brandName} sign-in and app data at any time.
        Your medical record stays with the clinic.
      </p>

      <h2>How to ask</h2>
      <ul>
        <li>
          <b>In the app:</b> More → Delete my account
        </li>
        <li>
          <b>In the patient portal:</b> Account → Delete my account
        </li>
        <li>
          <b>Without the app:</b> call <a href={clinic.phoneHref}>{clinic.phone}</a> or WhatsApp{' '}
          <a href={clinic.whatsappHref}>{clinic.whatsappDisplay}</a> (Mon–Sat {clinic.hoursShort}).
          We confirm it’s you (your name plus your date of birth or the phone number on your record)
          and delete it for you.
        </li>
      </ul>
      <p>When you ask in the app or the portal, you are signed out there straight away.</p>

      <h2>What is deleted</h2>
      <LegalList items={DELETED_ON_REQUEST} />

      <h2>What the clinic keeps, and why</h2>
      <p>
        Doctors must keep medical records, so the clinic keeps your medical record for as long as
        medical record-keeping rules require:
      </p>
      <LegalList items={KEPT_BY_CLINIC} />

      <h2>How long it takes</h2>
      <p>{`Your request is processed within ${clinic.accountDeletionDays} days.`}</p>

      <h2>Coming back later</h2>
      <p>
        If you register again with the same email, you get a new sign-in, and the clinic can
        re-link your old record.
      </p>

      <h2>Data on your phone</h2>
      <p>
        When the app signs you out, it removes your sign-in, the medical details it keeps ready for
        an SOS and your medicine reminders from the phone, and stops notifications to it.
      </p>

      <p>
        More detail is in our <Link href="/privacy">privacy policy</Link>.
      </p>
    </LegalPage>
  );
}
