import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchMemories,
  fetchSite,
  fetchReasons,
  type Memory,
  type Reason,
  type SiteContent,
} from "@/lib/site";
import {
  addMemory,
  addReason,
  deleteMemory,
  deleteReason,
  reorderReasons,
  saveMemory,
  saveReason,
  swapMemoryOrder,
  updateSite,
  uploadMemoryImage,
  verifyEditorPasscode,
} from "@/lib/editor.functions";

// The real passcode lives only in the EDITOR_PASSCODE server secret.
// We keep it in sessionStorage (cleared on tab close) so each save can re-send it.
const STORAGE_KEY = "lovestory_editor_passcode";

export const Route = createFileRoute("/edit")({
  head: () => ({
    meta: [
      { title: "Editor" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EditPage,
});

function EditPage() {
  const [passcode, setPasscode] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) setPasscode(saved);
  }, []);

  if (!passcode) return <Lock onUnlock={(p) => setPasscode(p)} />;
  return <Editor passcode={passcode} onLock={() => setPasscode(null)} />;
}

function Lock({ onUnlock }: { onUnlock: (passcode: string) => void }) {
  const [v, setV] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-[color:var(--ivory)] px-6">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!v) return;
          setBusy(true);
          try {
            await verifyEditorPasscode({ data: { passcode: v } });
            sessionStorage.setItem(STORAGE_KEY, v);
            onUnlock(v);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Kode salah");
          } finally {
            setBusy(false);
          }
        }}
        className="w-full max-w-sm rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-8 text-center shadow-sm"
      >
        <h1 className="font-serif text-2xl text-[color:var(--wine)]">Editor</h1>
        <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">Masukkan kode rahasia</p>
        <input
          type="password"
          autoFocus
          value={v}
          onChange={(e) => setV(e.target.value)}
          className="mt-6 w-full rounded-md border border-[color:var(--input)] bg-white px-3 py-2 text-center font-mono tracking-widest outline-none focus:border-[color:var(--gold)]"
        />
        <button disabled={busy} className="mt-4 w-full rounded-md bg-[color:var(--wine)] py-2 font-medium text-[color:var(--ivory)] hover:opacity-90 disabled:opacity-50">
          {busy ? "Memeriksa…" : "Buka"}
        </button>
      </form>
      <Toaster richColors />
    </div>
  );
}

function Editor({ passcode, onLock }: { passcode: string; onLock: () => void }) {
  const [site, setSite] = useState<SiteContent | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSite().then(setSite).catch((e) => toast.error(e.message));
    fetchMemories().then(setMemories).catch((e) => toast.error(e.message));
  }, []);

  const onSaveSite = async () => {
    if (!site) return;
    setSaving(true);
    try {
      await updateSite({
        data: {
          passcode,
          site: {
            partner1_name: site.partner1_name,
            partner2_name: site.partner2_name,
            relationship_start_date: site.relationship_start_date,
            occasion_title: site.occasion_title,
            hero_tagline: site.hero_tagline,
            letter_text: site.letter_text,
            reaffirmation_message: site.reaffirmation_message,
            closing_note: site.closing_note,
            closing_headline: site.closing_headline,
            closing_subtitle: site.closing_subtitle,
            next_label: site.next_label,
          },
        },
      });
      toast.success("Tersimpan");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  if (!site) return <div className="p-8 font-serif italic">memuat…</div>;

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.015_60)] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-3xl text-[color:var(--wine)]">Editor</h1>
          <div className="flex gap-2">
            <a href="/" className="rounded-md border px-3 py-1.5 text-sm hover:bg-white">Lihat situs</a>
            <button
              onClick={() => { sessionStorage.removeItem(STORAGE_KEY); onLock(); }}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-white"
            >
              Kunci
            </button>
          </div>
        </header>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl text-[color:var(--wine)]">Detail</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Nama kamu">
              <input className={inputCls} value={site.partner1_name} onChange={(e) => setSite({ ...site, partner1_name: e.target.value })}/>
            </Field>
            <Field label="Nama dia">
              <input className={inputCls} value={site.partner2_name} onChange={(e) => setSite({ ...site, partner2_name: e.target.value })}/>
            </Field>
            <Field label="Tanggal mulai pacaran">
              <input type="date" className={inputCls} value={site.relationship_start_date} onChange={(e) => setSite({ ...site, relationship_start_date: e.target.value })}/>
            </Field>
            <Field label="Judul ucapan">
              <input className={inputCls} value={site.occasion_title} onChange={(e) => setSite({ ...site, occasion_title: e.target.value })}/>
            </Field>
          </div>
          <Field label="Tagline hero" className="mt-4">
            <input className={inputCls} value={site.hero_tagline} onChange={(e) => setSite({ ...site, hero_tagline: e.target.value })}/>
          </Field>
          <Field label="Pesan reaffirmation (setelah klik 'Selalu')" className="mt-4">
            <input className={inputCls} value={site.reaffirmation_message} onChange={(e) => setSite({ ...site, reaffirmation_message: e.target.value })}/>
          </Field>
          <Field label="Surat cinta" className="mt-4">
            <textarea rows={14} className={inputCls + " font-serif leading-relaxed"} value={site.letter_text} onChange={(e) => setSite({ ...site, letter_text: e.target.value })}/>
          </Field>
          <Field label="Catatan penutup" className="mt-4">
            <input className={inputCls} value={site.closing_note} onChange={(e) => setSite({ ...site, closing_note: e.target.value })}/>
          </Field>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Judul penutup">
              <input className={inputCls} value={site.closing_headline ?? ""} onChange={(e) => setSite({ ...site, closing_headline: e.target.value })}/>
            </Field>
            <Field label="Label hitung mundur">
              <input className={inputCls} value={site.next_label ?? ""} onChange={(e) => setSite({ ...site, next_label: e.target.value })}/>
            </Field>
          </div>
          <Field label="Subjudul penutup" className="mt-4">
            <input className={inputCls} value={site.closing_subtitle ?? ""} onChange={(e) => setSite({ ...site, closing_subtitle: e.target.value })}/>
          </Field>

          <button onClick={onSaveSite} disabled={saving} className="mt-6 rounded-md bg-[color:var(--wine)] px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
            {saving ? "Menyimpan…" : "Simpan detail"}
          </button>
        </section>

        <MemoryManager memories={memories} setMemories={setMemories} passcode={passcode} />
        <ReasonsManager passcode={passcode} />
      </div>
      <Toaster richColors />
    </div>
  );
}

function MemoryManager({
  memories,
  setMemories,
  passcode,
}: {
  memories: Memory[];
  setMemories: (m: Memory[]) => void;
  passcode: string;
}) {
  const sorted = useMemo(
    () => [...memories].sort((a, b) => a.order_index - b.order_index),
    [memories],
  );

  const refresh = async () => setMemories(await fetchMemories());

  const addOne = async () => {
    const order = (sorted.at(-1)?.order_index ?? 0) + 1;
    try {
      await addMemory({ data: { passcode, order_index: order, week_label: `Minggu ${order}` } });
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menambah");
    }
  };

  const update = async (id: string, patch: Partial<Memory>) => {
    setMemories(memories.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  const saveOne = async (m: Memory) => {
    try {
      await saveMemory({
        data: {
          passcode,
          id: m.id,
          memory: {
            order_index: m.order_index,
            week_label: m.week_label,
            date_label: m.date_label,
            title: m.title,
            description: m.description,
            image_url: m.image_url,
            image_aspect: m.image_aspect || "16/9",
          },
        },
      });
      toast.success("Memori tersimpan");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus memori ini?")) return;
    try {
      await deleteMemory({ data: { passcode, id } });
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus");
    }
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = sorted.findIndex((m) => m.id === id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    const me = sorted[idx];
    try {
      await swapMemoryOrder({
        data: {
          passcode,
          a: { id: me.id, order_index: me.order_index },
          b: { id: swap.id, order_index: swap.order_index },
        },
      });
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengurutkan");
    }
  };

  const onFile = async (id: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 10MB");
      return;
    }
    try {
      const buf = await file.arrayBuffer();
      let bin = "";
      const bytes = new Uint8Array(buf);
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) {
        bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
      }
      const base64 = btoa(bin);
      await uploadMemoryImage({
        data: {
          passcode,
          id,
          filename: file.name,
          contentType: file.type || "image/jpeg",
          base64,
        },
      });
      toast.success("Foto diupload");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengupload");
    }
  };

  return (
    <section className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-xl text-[color:var(--wine)]">Memori</h2>
        <button onClick={addOne} className="rounded-md bg-[color:var(--wine)] px-3 py-1.5 text-sm text-white hover:opacity-90">
          + Tambah memori
        </button>
      </div>
      <ul className="space-y-4">
        {sorted.map((m, i) => (
          <li key={m.id} className="rounded-lg border bg-[oklch(0.98_0.012_60)] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-[color:var(--blush)]/40 px-2 py-0.5 text-xs">#{i + 1}</span>
              <button onClick={() => move(m.id, -1)} disabled={i === 0} className="rounded border px-2 py-0.5 text-xs disabled:opacity-30">↑</button>
              <button onClick={() => move(m.id, +1)} disabled={i === sorted.length - 1} className="rounded border px-2 py-0.5 text-xs disabled:opacity-30">↓</button>
              <button onClick={() => remove(m.id)} className="ml-auto rounded border border-red-300 px-2 py-0.5 text-xs text-red-700 hover:bg-red-50">Hapus</button>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Label minggu"><input className={inputCls} value={m.week_label} onChange={(e) => update(m.id, { week_label: e.target.value })}/></Field>
              <Field label="Tanggal"><input className={inputCls} value={m.date_label} onChange={(e) => update(m.id, { date_label: e.target.value })}/></Field>
              <Field label="Judul" className="sm:col-span-2"><input className={inputCls} value={m.title} onChange={(e) => update(m.id, { title: e.target.value })}/></Field>
              <Field label="Deskripsi" className="sm:col-span-2"><textarea rows={3} className={inputCls} value={m.description} onChange={(e) => update(m.id, { description: e.target.value })}/></Field>
              <Field label="Foto" className="sm:col-span-2">
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(m.id, e.target.files[0])} className="text-sm"/>
                {m.image_url && <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">Tersimpan: {m.image_url}</p>}
              </Field>
              <Field label="Rasio foto" className="sm:col-span-2">
                <AspectEditor
                  value={m.image_aspect || "16/9"}
                  imageUrl={m.image_url}
                  onChange={(v) => update(m.id, { image_aspect: v })}
                />
              </Field>
            </div>
            <button onClick={() => saveOne(m)} className="mt-3 rounded-md bg-[color:var(--wine)] px-4 py-1.5 text-sm text-white hover:opacity-90">
              Simpan memori
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

const inputCls =
  "w-full rounded-md border border-[color:var(--input)] bg-white px-3 py-2 text-sm outline-none focus:border-[color:var(--gold)]";

function AspectEditor({
  value,
  imageUrl,
  onChange,
}: {
  value: string;
  imageUrl: string | null;
  onChange: (v: string) => void;
}) {
  const parse = (s: string): [number, number] => {
    const [w, h] = s.split("/").map((n) => parseFloat(n));
    if (!w || !h) return [16, 9];
    return [w, h];
  };
  const [w, h] = parse(value);
  const ratio = w / h;

  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!imageUrl) {
      setSignedUrl(null);
      return;
    }
    supabase.storage
      .from("memories")
      .createSignedUrl(imageUrl, 3600)
      .then(({ data }) => {
        if (!cancelled) setSignedUrl(data?.signedUrl ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  const presets = ["21/9", "16/9", "3/2", "4/3", "1/1", "4/5", "3/4", "9/16"];

  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setRatio = (r: number) => {
    const clamped = Math.max(0.3, Math.min(4, r));
    // Normalize to width=100
    const newH = +(100 / clamped).toFixed(2);
    onChange(`100/${newH}`);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const px = Math.max(40, e.clientX - rect.left);
    const py = Math.max(40, e.clientY - rect.top);
    setRatio(px / py);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  // Preview sizing — cap to container, max height 220
  const maxW = 420;
  const maxH = 220;
  let pw = maxW;
  let ph = pw / ratio;
  if (ph > maxH) {
    ph = maxH;
    pw = ph * ratio;
  }

  return (
    <div>
      <div className="flex flex-wrap items-start gap-4">
        <div
          ref={boxRef}
          className="relative overflow-hidden rounded-md border border-dashed border-[color:var(--gold)] bg-[oklch(0.95_0.02_60)]"
          style={{ width: pw, height: ph, maxWidth: "100%" }}
        >
          {signedUrl ? (
            <img
              src={signedUrl}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-serif italic text-[color:var(--muted-foreground)]">
              {imageUrl ? "memuat foto…" : `preview ${ratio.toFixed(2)}:1`}
            </div>
          )}
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            className="absolute -bottom-2 -right-2 h-6 w-6 cursor-nwse-resize rounded-full border-2 border-[color:var(--wine)] bg-white shadow-md"
            title="Tarik untuk ubah rasio"
          />
        </div>
        <div className="flex-1 min-w-[180px] space-y-3">
          <div>
            <span className="mb-1 block text-xs uppercase tracking-wider text-[color:var(--muted-foreground)]">
              Rasio (lebar : tinggi) — {ratio.toFixed(2)}
            </span>
            <input
              type="range"
              min={0.3}
              max={4}
              step={0.01}
              value={ratio}
              onChange={(e) => setRatio(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs">
              <span className="mb-1 block uppercase tracking-wider text-[color:var(--muted-foreground)]">Lebar</span>
              <input
                type="number"
                min={1}
                step={0.1}
                className={inputCls}
                value={w}
                onChange={(e) => onChange(`${e.target.value || 1}/${h}`)}
              />
            </label>
            <label className="text-xs">
              <span className="mb-1 block uppercase tracking-wider text-[color:var(--muted-foreground)]">Tinggi</span>
              <input
                type="number"
                min={1}
                step={0.1}
                className={inputCls}
                value={h}
                onChange={(e) => onChange(`${w}/${e.target.value || 1}`)}
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-1">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onChange(p)}
                className={`rounded border px-2 py-0.5 text-xs ${
                  value === p
                    ? "border-[color:var(--wine)] bg-[color:var(--wine)] text-white"
                    : "hover:bg-white"
                }`}
              >
                {p.replace("/", ":")}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs uppercase tracking-wider text-[color:var(--muted-foreground)]">{label}</span>
      {children}
    </label>
  );
}