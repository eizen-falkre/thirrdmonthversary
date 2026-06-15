import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function verify(passcode: string) {
  const expected = process.env.EDITOR_PASSCODE;
  if (!expected) throw new Error("Editor belum dikonfigurasi");
  if (passcode !== expected) throw new Error("Kode salah");
}

const passcodeField = z.string().min(1).max(200);

export const verifyEditorPasscode = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ passcode: passcodeField }).parse(d))
  .handler(async ({ data }) => {
    verify(data.passcode);
    return { ok: true };
  });

const siteSchema = z.object({
  passcode: passcodeField,
  site: z.object({
    partner1_name: z.string().max(200),
    partner2_name: z.string().max(200),
    relationship_start_date: z.string().max(50),
    occasion_title: z.string().max(200),
    hero_tagline: z.string().max(500),
    letter_text: z.string().max(10000),
    reaffirmation_message: z.string().max(500),
    closing_note: z.string().max(500),
    closing_headline: z.string().max(200),
    closing_subtitle: z.string().max(500),
    next_label: z.string().max(200),
  }),
});

export const updateSite = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => siteSchema.parse(d))
  .handler(async ({ data }) => {
    verify(data.passcode);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_content")
      .update(data.site)
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const memoryFields = z.object({
  order_index: z.number().int(),
  week_label: z.string().max(100),
  date_label: z.string().max(100),
  title: z.string().max(200),
  description: z.string().max(5000),
  image_url: z.string().max(500).nullable(),
  image_aspect: z.string().max(20),
});

export const saveMemory = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ passcode: passcodeField, id: z.string().uuid(), memory: memoryFields }).parse(d),
  )
  .handler(async ({ data }) => {
    verify(data.passcode);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("memories")
      .update(data.memory)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const addMemory = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({
      passcode: passcodeField,
      order_index: z.number().int(),
      week_label: z.string().max(100),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    verify(data.passcode);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("memories")
      .insert({
        order_index: data.order_index,
        week_label: data.week_label,
        title: "",
        description: "",
      });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteMemory = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ passcode: passcodeField, id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    verify(data.passcode);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("memories")
      .select("image_url")
      .eq("id", data.id)
      .maybeSingle();
    if (row?.image_url) {
      await supabaseAdmin.storage.from("memories").remove([row.image_url]);
    }
    const { error } = await supabaseAdmin.from("memories").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const swapMemoryOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({
      passcode: passcodeField,
      a: z.object({ id: z.string().uuid(), order_index: z.number().int() }),
      b: z.object({ id: z.string().uuid(), order_index: z.number().int() }),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    verify(data.passcode);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("memories")
      .update({ order_index: data.b.order_index })
      .eq("id", data.a.id);
    await supabaseAdmin
      .from("memories")
      .update({ order_index: data.a.order_index })
      .eq("id", data.b.id);
    return { ok: true };
  });

export const uploadMemoryImage = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({
      passcode: passcodeField,
      id: z.string().uuid(),
      filename: z.string().min(1).max(200),
      contentType: z.string().min(1).max(100),
      base64: z.string().min(1).max(15_000_000),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    verify(data.passcode);
    if (!/^image\//.test(data.contentType)) throw new Error("File harus berupa gambar");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const extRaw = (data.filename.split(".").pop() ?? "jpg").toLowerCase();
    const ext = extRaw.replace(/[^a-z0-9]/g, "").slice(0, 5) || "jpg";
    const path = `${data.id}-${Date.now()}.${ext}`;
    const bin = atob(data.base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const { error: upErr } = await supabaseAdmin.storage
      .from("memories")
      .upload(path, bytes, {
        cacheControl: "3600",
        upsert: true,
        contentType: data.contentType,
      });
    if (upErr) throw new Error(upErr.message);
    const { error: dbErr } = await supabaseAdmin
      .from("memories")
      .update({ image_url: path })
      .eq("id", data.id);
    if (dbErr) throw new Error(dbErr.message);
    return { image_url: path };
  });