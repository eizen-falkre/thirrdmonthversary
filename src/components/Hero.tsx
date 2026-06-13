import { motion } from "motion/react";
import { Petals } from "./Petals";
import { Flourish } from "./Flourish";
import { monthsAndDays, type SiteContent } from "@/lib/site";

export function Hero({ site }: { site: SiteContent }) {
  const { months, days } = monthsAndDays(site.relationship_start_date);

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 animate-slow-gradient"
        style={{
          backgroundImage:
            "radial-gradient(120% 80% at 30% 20%, oklch(0.92 0.04 20) 0%, transparent 60%), radial-gradient(100% 70% at 80% 90%, oklch(0.88 0.06 18) 0%, transparent 55%), linear-gradient(180deg, var(--ivory), oklch(0.94 0.025 30))",
        }}
      />
      <Petals count={12} speed={0.55} />

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="font-script text-3xl text-[color:var(--rose-deep)] sm:text-4xl"
      >
        {site.occasion_title}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1.3, ease: "easeOut" }}
        className="mt-4 font-serif text-5xl leading-[1.05] text-[color:var(--wine)] sm:text-7xl"
      >
        {site.partner1_name}
        <span className="mx-3 italic text-[color:var(--rose-deep)]">&amp;</span>
        {site.partner2_name}
      </motion.h1>

      <Flourish className="mt-8" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1.2 }}
        className="mt-8"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--muted-foreground)]">
          Sudah bersama selama
        </p>
        <p className="mt-3 font-serif text-3xl text-[color:var(--ink)] sm:text-4xl">
          <span className="text-[color:var(--wine)]">{months}</span> Bulan,{" "}
          <span className="text-[color:var(--wine)]">{days}</span> Hari
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1.4 }}
        className="mt-6 max-w-md font-serif italic text-[color:var(--muted-foreground)]"
      >
        “{site.hero_tagline}”
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.4, duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 flex flex-col items-center text-[color:var(--rose-deep)]"
      >
        <span className="text-[10px] uppercase tracking-[0.4em]">Geser</span>
        <svg width="14" height="22" viewBox="0 0 14 22" className="mt-1" aria-hidden>
          <path d="M7 1v18M1 14l6 6 6-6" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </section>
  );
}