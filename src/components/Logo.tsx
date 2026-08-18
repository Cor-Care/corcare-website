import { clinic } from '@/lib/config';

export function Logo({ wordColor }: { wordColor?: string }) {
  return (
    <a className="logo" href="#" aria-label={`${clinic.brandThe} ${clinic.brandName}`}>
      <svg viewBox="0 0 32 32" fill="none">
        <path
          d="M3 19h6.5l2.5-7 4.5 12 3.5-9 2 4H29"
          stroke="#e0333f"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="word" style={wordColor ? { color: wordColor } : undefined}>
        <small>{clinic.brandThe}</small>
        {clinic.brandName}
      </span>
    </a>
  );
}
