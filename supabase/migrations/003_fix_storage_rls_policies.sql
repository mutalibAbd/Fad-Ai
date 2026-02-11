-- =====================================================
-- FADAI - Fix Storage RLS Policies (JWT claim path)
-- =====================================================
-- Problem: auth.jwt() ->> 'role' returns the Postgres role
--          ('authenticated'), NOT the custom app_metadata role.
-- Fix:     Use auth.jwt() -> 'app_metadata' ->> 'role' to
--          access the custom admin claim.
-- =====================================================

-- =====================================================
-- DROP existing storage policies (all three buckets)
-- =====================================================

-- Projects bucket
DROP POLICY IF EXISTS "Admins can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete project images" ON storage.objects;

-- Team bucket
DROP POLICY IF EXISTS "Admins can upload team images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update team images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete team images" ON storage.objects;

-- Site bucket
DROP POLICY IF EXISTS "Admins can upload site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete site images" ON storage.objects;

-- =====================================================
-- RECREATE with correct JWT path
-- =====================================================

-- Projects bucket
CREATE POLICY "Admins can upload project images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'projects' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

CREATE POLICY "Admins can update project images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'projects' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

CREATE POLICY "Admins can delete project images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'projects' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

-- Team bucket
CREATE POLICY "Admins can upload team images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'team' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

CREATE POLICY "Admins can update team images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'team' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

CREATE POLICY "Admins can delete team images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'team' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

-- Site bucket
CREATE POLICY "Admins can upload site images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'site' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

CREATE POLICY "Admins can update site images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'site' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

CREATE POLICY "Admins can delete site images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'site' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );
