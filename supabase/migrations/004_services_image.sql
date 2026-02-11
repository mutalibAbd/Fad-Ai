-- =====================================================
-- FADAI - Add image_url to Services + Storage Bucket
-- =====================================================

-- Add image_url column to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url TEXT;

-- =====================================================
-- STORAGE BUCKET for services
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('services', 'services', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
CREATE POLICY "Public users can view service images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'services');

-- Admin upload
CREATE POLICY "Admins can upload service images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'services' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

-- Admin update
CREATE POLICY "Admins can update service images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'services' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

-- Admin delete
CREATE POLICY "Admins can delete service images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'services' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );
