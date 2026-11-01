import type { SVGProps } from 'react';
export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: 'bag' | 'search' | 'close' | 'menu' | 'arrow' | 'chevron' }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      aria-hidden="true"
      {...props}
    >
      {name === 'bag' ? (
        <>
          <path d="M5 7h14l1 14H4L5 7Z" />
          <path d="M8 8V6a4 4 0 0 1 8 0v2" />
        </>
      ) : name === 'search' ? (
        <>
          <circle cx="10.5" cy="10.5" r="6.8" />
          <path d="m16 16 5 5" />
        </>
      ) : name === 'close' ? (
        <path d="m5 5 14 14M19 5 5 19" />
      ) : name === 'menu' ? (
        <path d="M3 7h18M3 12h18M3 17h18" />
      ) : name === 'arrow' ? (
        <path d="M3 12h17m-7-7 7 7-7 7" />
      ) : (
        <path d="m6 9 6 6 6-6" />
      )}
    </svg>
  );
}
