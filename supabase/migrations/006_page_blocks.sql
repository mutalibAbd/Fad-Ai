-- =====================================================
-- FADAI - Page Blocks Migration
-- =====================================================
-- Description:
--   1. Creates page_blocks table for dynamic page builder
--   2. RLS policies
--   3. Storage bucket for page block images
--   4. Migrates existing about content into page_blocks rows
-- =====================================================

-- =====================================================
-- TABLE: page_blocks
-- =====================================================

CREATE TABLE IF NOT EXISTS page_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_slug TEXT NOT NULL,
  block_type TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  content JSONB NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_page_blocks_page_slug_sort ON page_blocks (page_slug, sort_order);
CREATE INDEX idx_page_blocks_visible ON page_blocks (is_visible) WHERE is_visible = true;

CREATE TRIGGER trigger_page_blocks_updated_at
  BEFORE UPDATE ON page_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY: page_blocks
-- =====================================================

ALTER TABLE page_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users can view visible page blocks"
  ON page_blocks FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Service role has full access to page blocks"
  ON page_blocks FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated admins have full access to page blocks"
  ON page_blocks FOR ALL
  USING (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =====================================================
-- STORAGE BUCKET: pages
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('pages', 'pages', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public users can view pages images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pages');

CREATE POLICY "Admins can upload pages images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pages' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

CREATE POLICY "Admins can update pages images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'pages' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

CREATE POLICY "Admins can delete pages images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'pages' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

-- =====================================================
-- MIGRATION: Convert existing about content to page_blocks
-- =====================================================

-- Block 1: Company Story (zigzag_hero type)
INSERT INTO page_blocks (page_slug, block_type, title, content, sort_order)
SELECT
  'about',
  'zigzag_hero',
  COALESCE(value->>'story_title', 'FADAI haqqinda'),
  jsonb_build_object(
    'text', COALESCE(value->>'story_text', ''),
    'images', '[]'::jsonb
  ),
  0
FROM site_settings
WHERE key = 'about'
  AND value IS NOT NULL
  AND jsonb_typeof(value) = 'object';

-- Block 2: Mission (zigzag_hero type)
INSERT INTO page_blocks (page_slug, block_type, title, content, sort_order)
SELECT
  'about',
  'zigzag_hero',
  'Missiyamiz',
  jsonb_build_object(
    'text', COALESCE(value->>'mission_text', ''),
    'images', '[]'::jsonb
  ),
  1
FROM site_settings
WHERE key = 'about'
  AND value IS NOT NULL
  AND jsonb_typeof(value) = 'object';

-- Block 3: Stats (values_grid type)
INSERT INTO page_blocks (page_slug, block_type, title, content, sort_order)
SELECT
  'about',
  'values_grid',
  'Statistikalar',
  jsonb_build_object(
    'items', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'icon', '',
          'title', elem->>'value',
          'description', elem->>'label'
        )
      )
      FROM jsonb_array_elements(value) AS elem),
      '[]'::jsonb
    )
  ),
  2
FROM site_settings
WHERE key = 'about_stats'
  AND value IS NOT NULL
  AND jsonb_typeof(value) = 'array';

-- =====================================================
-- END OF MIGRATION
-- =====================================================
