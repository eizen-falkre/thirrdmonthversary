import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSite, useMemories } from "@/lib/site";
import { Intro } from "@/components/Intro";
import { Hero } from "@/components/Hero";
import { PromiseCard } from "@/components/PromiseCard";
import { Timeline } from "@/components/Timeline";
import { Letter } from "@/components/Letter";
import { Reasons } from "@/components/Reasons";
import { Closing } from "@/components/Closing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Untuk Kamu — Cerita Kita" },
      { name: "description", content: "Sebuah surat cinta digital dan buku kenangan, ditulis dengan seluruh hati." },
      { property: "og:title", content: "Untuk Kamu — Cerita Kita" },
      { property: "og:description", content: "Sebuah surat cinta digital dan buku kenangan, ditulis dengan seluruh hati." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: site } = useSite();
  const { data: memories } = useMemories();
  const [showIntro, setShowIntro] = useState(true);

  // Lock scroll while the intro is on screen
  useEffect(() => {
    if (showIntro) document.documentElement.style.overflow = "hidden";
    else document.documentElement.style.overflow = "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [showIntro]);

  if (!site) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-[color:var(--ivory)]">
        <div className="font-serif italic text-[color:var(--rose-deep)]">memuat cerita kita…</div>
      </div>
    );
  }

  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)]">
      {showIntro && <Intro site={site} onDone={() => setShowIntro(false)} />}
      <Hero site={site} />
      <PromiseCard site={site} />
      <Timeline title="Cerita Kita" memories={memories ?? []} />
      <Letter site={site} />
      <Reasons />
      <Closing site={site} />
    </main>
  );
}
