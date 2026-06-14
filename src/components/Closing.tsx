import { Petals } from "./Petals";
import { Flourish } from "./Flourish";
import {
  daysUntilNextMonthsversary,
  todayLabelID,
  type SiteContent,
} from "@/lib/site";

export function Closing({ site }: { site: SiteContent }) {
  const days = daysUntilNextMonthsversary(site.relationship_start_date);

  return (
    <footer className="relative isolate overflow-hidden bg-gradient-to-b from-[oklch(0.94_0.02_30)] to-[color:var(--ivory)] px-5 py-24 text-center">
      <Petals count={10} speed={0.5} />
      <Flourish />
      <h2 className="mt-6 font-serif text-3xl italic text-[color:var(--wine)] sm:text-4xl">
        {site.closing_headline}
      </h2>
      <p className="mx-auto mt-4 max-w-md font-serif text-[color:var(--muted-foreground)]">
        {site.closing_subtitle}
      </p>

      <div className="mx-auto mt-10 inline-flex flex-col items-center rounded-2xl border border-[color:var(--gold)]/30 bg-[color:var(--ivory)]/70 px-8 py-6 backdrop-blur">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--rose-deep)]">
          {site.next_label}
        </p>
        <p className="mt-2 font-serif text-4xl text-[color:var(--wine)]">
          {days} <span className="text-2xl italic">hari lagi</span>
        </p>
      </div>

      <Flourish className="mt-12 opacity-70" />

      <p className="mt-6 font-script text-2xl text-[color:var(--rose-deep)]">
        {site.closing_note}
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[color:var(--muted-foreground)]">
        {todayLabelID()}
      </p>
    </footer>
  );
}