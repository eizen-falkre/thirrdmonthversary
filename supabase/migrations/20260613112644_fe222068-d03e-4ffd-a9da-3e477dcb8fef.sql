
CREATE POLICY "memories read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'memories');
CREATE POLICY "memories insert" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'memories');
CREATE POLICY "memories update" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'memories') WITH CHECK (bucket_id = 'memories');
CREATE POLICY "memories delete" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'memories');
