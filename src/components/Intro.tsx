import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BloomingFlower } from "./BloomingFlower";
import { Petals } from "./Petals";
import { monthsAndDays, type SiteContent } from "@/lib/site";

type Props = { site: SiteContent; onDone: () => void };

export function Intro({ site, onDone }: Props) {
  const [leaving, setLeaving] = useState(false);
  const { months } = monthsAndDays(site.relationship_start_date);

  useEffect(() => {
    const t = setTimeout(() => setLeaving(true), 5200);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => setLeaving(true);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!leaving && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[oklch(0.22_0.06_18)] via-[oklch(0.18_0.05_20)] to-[oklch(0.12_0.04_22)] text-[color:var(--ivory)]"
        >
          <Petals count={22} color="oklch(0.78 0.12 18)" speed={0.7} />

          {/* Cluster of blooms */}
          <div className="pointer-events-none relative h-[55vh] w-full max-w-md">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <BloomingFlower delay={0.15} duration={2.6} size={220} />
            </div>
            <div className="absolute left-[12%] top-[18%]">
              <BloomingFlower delay={0.55} duration={2.2} size={120} />
            </div>
            <div className="absolute right-[10%] top-[14%]">
              <BloomingFlower delay={0.85} duration={2.4} size={110} />
            </div>
            <div className="absolute left-[18%] bottom-[8%]">
              <BloomingFlower delay={1.1} duration={2.5} size={140} />
            </div>
            <div className="absolute right-[14%] bottom-[12%]">
              <BloomingFlower delay={1.35} duration={2.3} size={130} />
            </div>
          </div>

          {/* Names + count */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 1.4, ease: "easeOut" }}
            className="z-10 mt-2 px-6 text-center"
          >
            <p className="font-script text-2xl text-[color:var(--blush)]">
              {site.partner1_name} &amp; {site.partner2_name}
            </p>
            <h1 className="mt-2 font-serif text-4xl italic tracking-wide text-[color:var(--ivory)] sm:text-5xl">
              {months} Bulan Bersama
            </h1>
          </motion.div>

          {/* Tap to continue */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.6, duration: 1 }}
            onClick={dismiss}
            className="z-10 mt-8 rounded-full border border-[color:var(--blush)]/40 px-6 py-2 text-sm tracking-widest text-[color:var(--blush)] backdrop-blur-sm transition hover:bg-[color:var(--blush)]/10"
          >
            Mulai →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}