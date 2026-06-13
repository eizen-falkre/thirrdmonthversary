/** Hand-drawn-style peony/rose SVG that "blooms" via CSS keyframes. */
export function BloomingFlower({
  delay = 0,
  duration = 2.6,
  size = 180,
  className = "",
}: {
  delay?: number;
  duration?: number;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`animate-bloom origin-center drop-shadow-[0_8px_24px_rgba(80,10,20,0.35)] ${className}`}
      style={{
        ["--bd" as never]: `${duration}s`,
        ["--bdelay" as never]: `${delay}s`,
      }}
      aria-hidden
    >
      <defs>
        <radialGradient id={`bg-${delay}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="oklch(0.78 0.13 18)" />
          <stop offset="55%" stopColor="oklch(0.62 0.16 18)" />
          <stop offset="100%" stopColor="oklch(0.42 0.12 18)" />
        </radialGradient>
      </defs>
      {/* outer petals */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * 360;
        return (
          <ellipse
            key={i}
            cx="100" cy="56" rx="24" ry="42"
            fill={`url(#bg-${delay})`}
            opacity="0.85"
            transform={`rotate(${a} 100 100)`}
          />
        );
      })}
      {/* middle petals */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * 360 + 30;
        return (
          <ellipse
            key={i}
            cx="100" cy="72" rx="18" ry="28"
            fill="oklch(0.7 0.15 14)"
            opacity="0.95"
            transform={`rotate(${a} 100 100)`}
          />
        );
      })}
      {/* inner bud */}
      <circle cx="100" cy="100" r="18" fill="oklch(0.52 0.16 16)" />
      <circle cx="100" cy="100" r="9"  fill="oklch(0.4 0.12 18)" />
      <circle cx="100" cy="100" r="3"  fill="var(--gold)" opacity="0.8" />
    </svg>
  );
}