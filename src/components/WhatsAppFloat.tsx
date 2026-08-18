import { clinic } from '@/lib/config';

export function WhatsAppFloat() {
  return (
    <a className="wa-float" href={clinic.whatsappHref} aria-label="WhatsApp">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.2-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.2 2.4 1.5 2.7 1.7.3.1.5.1.7-.1l1-1.2c.2-.3.5-.2.8-.1l2 1c.3.1.5.2.6.4 0 .1 0 .7-.1 1.1z" />
      </svg>
    </a>
  );
}
