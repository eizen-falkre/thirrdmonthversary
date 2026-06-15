-- Restrict writes on public tables to service_role only.
DROP POLICY IF EXISTS "anyone can insert site_content" ON public.site_content;
DROP POLICY IF EXISTS "anyone can update site_content" ON public.site_content;
DROP POLICY IF EXISTS "anyone can insert memories" ON public.memories;
DROP POLICY IF EXISTS "anyone can update memories" ON public.memories;
DROP POLICY IF EXISTS "anyone can delete memories" ON public.memories;

-- Revoke anon/authenticated write grants so only service_role can mutate.
REVOKE INSERT, UPDATE, DELETE ON public.site_content FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.memories FROM anon, authenticated;
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT SELECT ON public.memories TO anon, authenticated;
GRANT ALL ON public.site_content TO service_role;
GRANT ALL ON public.memories TO service_role;

-- Restrict storage writes on the memories bucket to service_role only.
DROP POLICY IF EXISTS "memories insert" ON storage.objects;
DROP POLICY IF EXISTS "memories update" ON storage.objects;
DROP POLICY IF EXISTS "memories delete" ON storage.objects;
-- Keep "memories read" for signed-url generation.
