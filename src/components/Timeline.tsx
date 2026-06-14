import { motion } from "motion/react";
import { Flourish, FloralNode } from "./Flourish";
import { MemoryImage } from "./MemoryImage";
import type { Memory } from "@/lib/site";

export function Timeline({ title, memories }: { title: string; memories: Memory[] }) {
  return (
    <section className="relative bg-[oklch(0.96_0.018_60)] px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--rose-deep)]">Memori Kita</p>
        <h2 className="mt-3 font-serif text-4xl text-[color:var(--wine)] sm:text-5xl">{title}</h2>
        <Flourish className="mt-6" />
      </div>

      <div className="relative mx-auto mt-14 max-w-5xl">
        {/* center line (desktop) */}
        <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[color:var(--gold)]/60 to-transparent sm:block" />
        {/* left line (mobile) */}
        <div className="pointer-events-none absolute left-[26px] top-0 h-full w-px bg-gradient-to-b from-transparent via-[color:var(--gold)]/60 to-transparent sm:hidden" />

        <ul className="flex flex-col gap-12 sm:gap-16">
          {memories.map((m, idx) => {
            const side = idx % 2 === 0 ? "left" : "right";
            return (
              <li key={m.id} className="relative">
                {/* node */}
                <FloralNode className="absolute left-[14px] top-2 h-6 w-6 sm:left-1/2 sm:-translate-x-1/2" />

                <motion.article
                  initial={{ opacity: 0, y: 24, x: side === "left" ? -20 : 20 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className={`ml-14 sm:ml-0 sm:w-[52%] ${side === "right" ? "sm:ml-auto sm:pl-10" : "sm:mr-auto sm:pr-10"}`}
                >
                  <div className="overflow-hidden rounded-md border border-[oklch(0.9_0.02_45)] bg-[color:var(--ivory)] p-3 shadow-[0_18px_40px_-22px_rgba(70,10,20,0.35)]">
                    <div className="overflow-hidden rounded-sm">
                      <MemoryImage path={m.image_url} alt={m.title || m.week_label} />
                    </div>
                    <div className="px-1 pt-4 pb-2 text-left">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-script text-xl text-[color:var(--rose-deep)]">{m.week_label}</p>
                        <p className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)]">{m.date_label}</p>
                      </div>
                      <h3 className="mt-1 font-serif text-xl text-[color:var(--wine)]">{m.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[color:var(--ink)]/80">{m.description}</p>
                    </div>
                  </div>
                </motion.article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}