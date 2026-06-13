
-- Site content (single row)
CREATE TABLE public.site_content (
  id INT PRIMARY KEY DEFAULT 1,
  partner1_name TEXT NOT NULL DEFAULT 'Kamu',
  partner2_name TEXT NOT NULL DEFAULT 'Dia',
  relationship_start_date DATE NOT NULL DEFAULT '2025-09-13',
  occasion_title TEXT NOT NULL DEFAULT 'Selamat Monthsversary',
  hero_tagline TEXT NOT NULL DEFAULT 'Setiap detik bersamamu adalah halaman terindah dalam cerita kita.',
  letter_text TEXT NOT NULL DEFAULT $$Untuk kamu, yang selalu punya tempat paling hangat di hati aku,

Makasih ya, sayang, karena udah mau jadi pacar aku, dan karena selalu ada — di hari-hari biasa yang penuh tawa, sampai di hari-hari berat waktu aku lagi nggak baik-baik aja. Kamu nggak pernah pergi. Kamu selalu di sana, menggenggam tanganku, dan bikin semuanya terasa baik lagi.

Aku bersyukur banget bisa punya kamu di hidup aku. Dan jadi bagian dari hidup kamu juga — itu salah satu hal paling berharga yang pernah terjadi sama aku. Cinta aku ke kamu nggak pernah berhenti tumbuh; setiap hari rasanya makin dalam, makin yakin.

Jadi, ayo terus jalan bareng-bareng ya, sayang. Bulan ketiga ini baru permulaan — nanti ada bulan keempat, bulan kelima, berbulan-bulan, bertahun-tahun, sampai selamanya. Aku mau setiap bab dari cerita aku, ditulis berdua sama kamu.

I love you, always and forever. My only one, my love — from the bottom of my heart. 🤍$$,
  reaffirmation_message TEXT NOT NULL DEFAULT 'Aku juga, sayang. Selalu, selamanya. 🤍',
  closing_note TEXT NOT NULL DEFAULT 'Ditulis dengan seluruh hati, untuk kamu seorang.',
  CONSTRAINT site_content_singleton CHECK (id = 1)
);

GRANT SELECT, INSERT, UPDATE ON public.site_content TO anon, authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read site_content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "anyone can update site_content" ON public.site_content FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "anyone can insert site_content" ON public.site_content FOR INSERT WITH CHECK (true);

INSERT INTO public.site_content (id) VALUES (1);

-- Memories timeline
CREATE TABLE public.memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_index INT NOT NULL DEFAULT 0,
  week_label TEXT NOT NULL DEFAULT '',
  date_label TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.memories TO anon, authenticated;
GRANT ALL ON public.memories TO service_role;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read memories" ON public.memories FOR SELECT USING (true);
CREATE POLICY "anyone can insert memories" ON public.memories FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone can update memories" ON public.memories FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "anyone can delete memories" ON public.memories FOR DELETE USING (true);

-- Seed 12 placeholder memories
INSERT INTO public.memories (order_index, week_label, date_label, title, description)
SELECT i, 'Minggu ' || i, '—', 'Momen di minggu ke-' || i, 'Tulis cerita kecil kalian di minggu ini.'
FROM generate_series(1, 12) AS s(i);
