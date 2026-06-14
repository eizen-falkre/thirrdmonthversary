
ALTER TABLE public.site_content
  ADD COLUMN IF NOT EXISTS closing_headline text NOT NULL DEFAULT 'Ini baru permulaan, sayang.',
  ADD COLUMN IF NOT EXISTS closing_subtitle text NOT NULL DEFAULT 'Masih ada banyak bab cerita yang menunggu kita tulis bersama.',
  ADD COLUMN IF NOT EXISTS next_label text NOT NULL DEFAULT 'Monthsversary berikutnya';
