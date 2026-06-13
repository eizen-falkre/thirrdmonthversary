import { useMemo } from "react";

type Props = {
  count?: number;
  className?: string;
  /** Speed multiplier; 1 = normal, 0.5 = twice as slow */
  speed?: number;
  color?: string;
};

/** Subtle falling petal/heart particles. Pure CSS — no JS frame loop. */
export function Petals({ count = 14, className = "", speed = 1, color }: Props) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;
        const size = 10 + Math.random() * 18;
        const dur = (14 + Math.random() * 18) / speed;
        const delay = -Math.random() * dur;
        const dx = (Math.random() - 0.5) * 120;
        const rot = Math.random() * 360;
        return { i, left, size, dur, delay, dx, rot };
      }),
    [count, speed],
  );

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {petals.map((p) => (
        <svg
          key={p.i}
          viewBox="0 0 24 24"
          className="absolute animate-drift"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            top: 0,
            transform: `rotate(${p.rot}deg)`,
            ["--dd" as never]: `${p.dur}s`,
            ["--ddelay" as never]: `${p.delay}s`,
            ["--dx" as never]: `${p.dx}px`,
            color: color ?? "var(--blush)",
          }}
        >
          <path
            d="M12 3c3 2.5 6 5.2 6 9a6 6 0 1 1-12 0c0-3.8 3-6.5 6-9z"
            fill="currentColor"
            opacity="0.65"
          />
        </svg>
      ))}
    </div>
  );
}