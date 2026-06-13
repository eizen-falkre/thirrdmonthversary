/** Thin gold botanical line-art divider. */
export function Flourish({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-[color:var(--gold)] ${className}`}>
      <span className="h-px w-16 bg-[color:var(--gold)]/40 sm:w-24" />
      <svg width="56" height="22" viewBox="0 0 80 28" fill="none" aria-hidden>
        <path d="M2 14 Q 18 4, 32 14 T 60 14 T 78 14"
              stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.85"/>
        <circle cx="40" cy="14" r="3.2" fill="currentColor" opacity="0.7"/>
        <path d="M40 10.8 C 38 8, 40 6, 42 8 C 44 10, 42 11.5, 40 10.8 Z" fill="currentColor" opacity="0.55"/>
        <path d="M40 17.2 C 38 20, 40 22, 42 20 C 44 17.5, 42 16.2, 40 17.2 Z" fill="currentColor" opacity="0.55"/>
      </svg>
      <span className="h-px w-16 bg-[color:var(--gold)]/40 sm:w-24" />
    </div>
  );
}

/** Tiny floral node marker for the timeline. */
export function FloralNode({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="3" fill="var(--gold)"/>
      <g fill="var(--blush)" opacity="0.95">
        <ellipse cx="12" cy="5"  rx="2.2" ry="3.4"/>
        <ellipse cx="19" cy="12" rx="3.4" ry="2.2"/>
        <ellipse cx="12" cy="19" rx="2.2" ry="3.4"/>
        <ellipse cx="5"  cy="12" rx="3.4" ry="2.2"/>
      </g>
      <circle cx="12" cy="12" r="1.4" fill="var(--wine)"/>
    </svg>
  );
}

/** Corner flourish for the love letter card. */
export function CornerFlourish({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={`text-[color:var(--gold)] ${className}`}
      style={{ transform: flip ? "scale(-1,1)" : undefined }}
      aria-hidden
    >
      <path d="M2 78 C 2 40, 40 2, 78 2" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7"/>
      <path d="M14 70 C 24 50, 50 24, 70 14" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.45"/>
      <g fill="currentColor" opacity="0.8">
        <circle cx="40" cy="40" r="2"/>
        <path d="M40 36 C 36 32, 40 28, 44 32 C 46 36, 44 38, 40 36 Z" opacity="0.7"/>
        <path d="M44 40 C 48 36, 52 40, 48 44 C 44 46, 42 44, 44 40 Z" opacity="0.7"/>
      </g>
    </svg>
  );
}