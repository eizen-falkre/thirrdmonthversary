import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Flourish } from "./Flourish";
import { useReasons } from "@/lib/site";

export function Reasons() {
  const { data: reasons } = useReasons();
  const list = (reasons ?? []).slice().sort((a, b) => a.order_index - b.order_index);
  const total = list.length;

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused || total <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % total), 5000);
    return () => clearInterval(t);
  }, [paused, total]);

  if (total === 0) return null;
  const current = list[Math.min(idx, total - 1)];

  const goTo = (i: number, scroll = false) => {
    setIdx(((i % total) + total) % total);
    if (scroll && spotlightRef.current) {
      spotlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section className="relative bg-[color:var(--ivory)] px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <Flourish className="mb-6 opacity-80" />
          <h2 className="font-serif text-3xl text-[color:var(--wine)] sm:text-4xl">
            3++ Alasan Aku Mencintaimu
          </h2>
          <Flourish className="mt-6 opacity-80" />
        </div>

        {/* Spotlight card */}
        <div
          ref={spotlightRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
          className="mx-auto mt-10 max-w-[600px] paper-grain rounded-md p-8 text-center shadow-[0_30px_80px_-30px_rgba(70,10,20,0.35)] sm:p-12"
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-[color:var(--gold)]">
            Alasan ke-{current.order_index} dari 3++
          </p>
          <div className="relative mt-6 min-h-[140px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={current.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="font-serif text-[20px] leading-[1.7] text-[color:var(--ink)] sm:text-[22px]"
              >
                {current.text}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <GhostBtn onClick={() => goTo(idx - 1)} aria-label="Sebelumnya">‹</GhostBtn>
            <GhostBtn
              onClick={() => {
                let n = idx;
                if (total > 1) while (n === idx) n = Math.floor(Math.random() * total);
                goTo(n);
              }}
            >
              ✦ Acak
            </GhostBtn>
            <GhostBtn onClick={() => goTo(idx + 1)} aria-label="Berikutnya">›</GhostBtn>
          </div>
        </div>

        {/* Toggle */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setOpen((o) => !o)}
            className="font-serif text-sm italic text-[color:var(--rose-deep)] underline-offset-4 hover:underline"
          >
            {open ? "Sembunyikan ↑" : "Lihat Semua Alasan ↓"}
          </button>
        </div>

        {/* Full list */}
        <motion.div
          initial={false}
          animate={{ maxHeight: open ? 4000 : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {list.map((r, i) => (
              <li key={r.id}>
                <button
                  onClick={() => goTo(i, true)}
                  className="flex w-full items-start gap-3 rounded-md border border-[color:var(--gold)]/30 bg-[oklch(0.98_0.012_60)] p-3 text-left transition hover:border-[color:var(--gold)]/60 hover:bg-white"
                >
                  <span className="mt-0.5 shrink-0 text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold)]">
                    {String(r.order_index).padStart(3, "0")}
                  </span>
                  <span className="font-serif text-[13px] leading-[1.55] text-[color:var(--ink)] sm:text-[14px]">
                    {r.text}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

function GhostBtn({
  children,
  onClick,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      {...rest}
      className="rounded-full border border-[color:var(--gold)]/40 px-4 py-1.5 font-serif text-sm text-[color:var(--wine)] transition hover:border-[color:var(--gold)] hover:bg-[color:var(--gold)]/10"
    >
      {children}
    </button>
  );
}