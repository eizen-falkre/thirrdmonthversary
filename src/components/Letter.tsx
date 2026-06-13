import { motion } from "motion/react";
import { CornerFlourish, Flourish } from "./Flourish";
import type { SiteContent } from "@/lib/site";

export function Letter({ site }: { site: SiteContent }) {
  const paragraphs = site.letter_text.split(/\n\s*\n/).filter(Boolean);
  return (
    <section className="relative bg-[oklch(0.94_0.02_30)] px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <div className="relative overflow-hidden rounded-md paper-grain p-8 shadow-[0_30px_80px_-30px_rgba(70,10,20,0.4)] sm:p-14">
          <CornerFlourish className="absolute left-3 top-3 h-14 w-14" />
          <CornerFlourish className="absolute right-3 top-3 h-14 w-14" flip />
          <CornerFlourish className="absolute left-3 bottom-3 h-14 w-14 rotate-[270deg]" />
          <CornerFlourish className="absolute right-3 bottom-3 h-14 w-14 rotate-180" flip />

          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--rose-deep)]">Surat Cinta</p>
            <Flourish className="mt-5" />
          </div>

          <div className="mx-auto mt-8 max-w-prose space-y-5 font-serif text-[1.05rem] leading-[1.85] text-[color:var(--ink)] sm:text-[1.15rem]">
            {paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.12, duration: 1, ease: "easeOut" }}
              >
                {p}
              </motion.p>
            ))}
          </div>

          <Flourish className="mt-10 opacity-80" />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1.4 }}
            className="mt-6 text-right font-script text-3xl text-[color:var(--wine)] sm:text-4xl"
          >
            — {site.partner1_name} &amp; {site.partner2_name}
          </motion.p>
        </div>
      </div>
    </section>
  );
}