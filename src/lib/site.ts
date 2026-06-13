import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteContent = {
  id: number;
  partner1_name: string;
  partner2_name: string;
  relationship_start_date: string;
  occasion_title: string;
  hero_tagline: string;
  letter_text: string;
  reaffirmation_message: string;
  closing_note: string;
};

export type Memory = {
  id: string;
  order_index: number;
  week_label: string;
  date_label: string;
  title: string;
  description: string;
  image_url: string | null;
};

export const SITE_QUERY_KEY = ["site_content"] as const;
export const MEMORIES_QUERY_KEY = ["memories"] as const;

export async function fetchSite(): Promise<SiteContent> {
  const { data, error } = await supabase
    .from("site_content" as never)
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return data as unknown as SiteContent;
}

export async function fetchMemories(): Promise<Memory[]> {
  const { data, error } = await supabase
    .from("memories" as never)
    .select("*")
    .order("order_index", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Memory[];
}

export function useSite() {
  return useQuery({ queryKey: SITE_QUERY_KEY, queryFn: fetchSite });
}

export function useMemories() {
  return useQuery({ queryKey: MEMORIES_QUERY_KEY, queryFn: fetchMemories });
}

export function useInvalidate() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: SITE_QUERY_KEY });
    qc.invalidateQueries({ queryKey: MEMORIES_QUERY_KEY });
  };
}

/** Convert a storage path (e.g. "abc.jpg") to a usable signed URL. */
export function useSignedImage(pathOrUrl: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!pathOrUrl) { setUrl(null); return; }
    // If already an external URL, use as-is
    if (/^https?:\/\//.test(pathOrUrl)) { setUrl(pathOrUrl); return; }
    let cancelled = false;
    supabase.storage
      .from("memories")
      .createSignedUrl(pathOrUrl, 60 * 60 * 24 * 7) // 7 days
      .then(({ data }) => { if (!cancelled) setUrl(data?.signedUrl ?? null); });
    return () => { cancelled = true; };
  }, [pathOrUrl]);
  return url;
}

/** Compute months + remaining days between start date and today. */
export function monthsAndDays(startISO: string) {
  const start = new Date(startISO + "T00:00:00");
  const now = new Date();
  let months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());
  const anchor = new Date(start);
  anchor.setMonth(anchor.getMonth() + months);
  if (now < anchor) {
    months -= 1;
    anchor.setMonth(anchor.getMonth() - 1);
  }
  const days = Math.floor((now.getTime() - anchor.getTime()) / 86400000);
  return { months: Math.max(0, months), days: Math.max(0, days) };
}

export function daysUntilNextMonthsversary(startISO: string) {
  const start = new Date(startISO + "T00:00:00");
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), start.getDate());
  if (next <= now) next.setMonth(next.getMonth() + 1);
  return Math.ceil((next.getTime() - now.getTime()) / 86400000);
}

export function todayLabelID() {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}