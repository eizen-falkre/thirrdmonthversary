import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Petals } from "./Petals";
import { Flourish } from "./Flourish";
import type { SiteContent } from "@/lib/site";

export function PromiseCard({ site }: { site: SiteContent }) {
  const [confirmed, setConfirmed] = useState(false);
  const [burst, setBurst] = useState(0);
  const [evadeStyle, setEvadeStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  const evade = () => {
    const dx = (Math.random() - 0.5) * 180;
    const dy = (Math.random() - 0.5) * 80 - 10;
    setEvadeStyle({
      transform: `translate(${dx}px, ${dy}px)`,
      transition: "transform 0.35s cubic-bezier(.4,1.6,.4,1)",
    });
  };

  const confirm = () => {
    setConfirmed(true);
    setBurst((b) => b + 1);
  };

  return (
    <section className="relative isolate flex min-h-[80vh] items-center justify-center overflow-hidden bg-gradient-to-b from-[color:var(--wine)] via-[oklch(0.32_0.1_18)] to-[color:var(--wine)] px-6 py-24 text-[color:var(--ivory)]">
      <Petals count={10} color="oklch(0.82 0.1 20)" speed={0.5} />
      {burst > 0 && (
        <Petals key={burst} count={28} color="oklch(0.86 0.12 18)" speed={1.6} />
      )}

      <div
        ref={containerRef}
        className="relative w-full max-w-md rounded-2xl border border-[color:var(--blush)]/20 bg-[oklch(0.24_0.07_18)]/60 p-8 text-center shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-sm sm:p-12"
      >
        <Flourish className="mb-6 opacity-80" />
        <h2 className="font-serif text-2xl italic leading-snug text-[color:var(--ivory)] sm:text-3xl">
          “Akan selalu ada di sisi aku,<br/>selamanya, kan?”
        </h2>

        <div className="relative mt-10 flex h-32 flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {!confirmed ? (
              <motion.div
                key="buttons"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-5"
              >
                <button
                  onClick={confirm}
                  className="rounded-full bg-[color:var(--blush)] px-10 py-3 font-serif text-lg tracking-wide text-[color:var(--wine)] shadow-lg shadow-rose-900/40 transition hover:scale-105 hover:bg-[color:var(--ivory)] active:scale-95"
                >
                  Selalu 💕
                </button>
                <button
                  onMouseEnter={evade}
                  onTouchStart={evade}
                  onFocus={evade}
                  onClick={evade}
                  style={evadeStyle}
                  className="text-xs tracking-widest text-[color:var(--blush)]/70 underline-offset-4 hover:underline"
                >
                  Mungkin…?
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 16 }}
                className="font-serif text-xl italic leading-snug text-[color:var(--blush)] drop-shadow-[0_0_18px_rgba(255,200,210,0.45)]"
              >
                {site.reaffirmation_message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}