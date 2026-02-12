-- =====================================================
-- FADAI - Overhaul Migration
-- =====================================================
-- Description:
--   1. Creates service_categories table (main services)
--   2. Adds category_id, slug, content, detail_image_url to services
--   3. Adds content column to products
--   4. Creates support_types table
--   5. Creates news table
--   6. RLS policies + storage buckets
--   7. Seeds placeholder data
-- =====================================================

-- =====================================================
-- TABLE: service_categories (Main Services)
-- =====================================================

CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT '',
  description TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_service_categories_visible ON service_categories (is_visible) WHERE is_visible = true;
CREATE INDEX idx_service_categories_sort_order ON service_categories (sort_order);

CREATE TRIGGER trigger_service_categories_updated_at
  BEFORE UPDATE ON service_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ALTER: services table (add hierarchy + detail fields)
-- =====================================================

ALTER TABLE services ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL;
ALTER TABLE services ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE services ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS detail_image_url TEXT;

CREATE INDEX IF NOT EXISTS idx_services_category_id ON services (category_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services (slug) WHERE slug IS NOT NULL;

-- =====================================================
-- ALTER: products table (add rich text content)
-- =====================================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS content TEXT;

-- =====================================================
-- TABLE: support_types
-- =====================================================

CREATE TABLE IF NOT EXISTS support_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_support_types_visible ON support_types (is_visible) WHERE is_visible = true;
CREATE INDEX idx_support_types_sort_order ON support_types (sort_order);
CREATE INDEX idx_support_types_slug ON support_types (slug);

CREATE TRIGGER trigger_support_types_updated_at
  BEFORE UPDATE ON support_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: news
-- =====================================================

CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT,
  image_url TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_news_visible ON news (is_visible) WHERE is_visible = true;
CREATE INDEX idx_news_published_at ON news (published_at DESC);
CREATE INDEX idx_news_slug ON news (slug);

CREATE TRIGGER trigger_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY: service_categories
-- =====================================================

ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users can view visible service categories"
  ON service_categories FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Service role has full access to service categories"
  ON service_categories FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated admins have full access to service categories"
  ON service_categories FOR ALL
  USING (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =====================================================
-- ROW LEVEL SECURITY: support_types
-- =====================================================

ALTER TABLE support_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users can view visible support types"
  ON support_types FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Service role has full access to support types"
  ON support_types FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated admins have full access to support types"
  ON support_types FOR ALL
  USING (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =====================================================
-- ROW LEVEL SECURITY: news
-- =====================================================

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users can view visible news"
  ON news FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Service role has full access to news"
  ON news FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated admins have full access to news"
  ON news FOR ALL
  USING (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('support', 'support', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('news', 'news', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for 'support' bucket
CREATE POLICY "Public users can view support images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'support');

CREATE POLICY "Admins can upload support images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'support' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

CREATE POLICY "Admins can update support images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'support' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

CREATE POLICY "Admins can delete support images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'support' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

-- Storage policies for 'news' bucket
CREATE POLICY "Public users can view news images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news');

CREATE POLICY "Admins can upload news images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'news' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

CREATE POLICY "Admins can update news images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'news' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

CREATE POLICY "Admins can delete news images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'news' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

-- =====================================================
-- SEED: Placeholder data for service categories
-- =====================================================

INSERT INTO service_categories (title, slug, icon, description, sort_order) VALUES
  ('Coaching', 'coaching', '🎯', 'Peşəkar coaching xidmətləri ilə komandanızın potensialını artırın', 1),
  ('Consulting', 'consulting', '💼', 'Ekspert konsaltinq xidmətləri ilə biznesinizi inkişaf etdirin', 2)
ON CONFLICT (slug) DO NOTHING;

-- Seed placeholder sub-services for Coaching
INSERT INTO services (title, slug, icon, description, content, category_id, sort_order, is_visible, image_url)
SELECT
  'Fərdi Coaching', 'ferdi-coaching', '👤',
  'Fərdi inkişaf üçün xüsusi coaching proqramları',
  'Fərdi coaching proqramlarımız sizin peşəkar inkişafınızı dəstəkləyir. Hər bir sessiya sizin ehtiyaclarınıza uyğun hazırlanır.',
  sc.id, 1, true, NULL
FROM service_categories sc WHERE sc.slug = 'coaching'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (title, slug, icon, description, content, category_id, sort_order, is_visible, image_url)
SELECT
  'Komanda Coaching', 'komanda-coaching', '👥',
  'Komanda dinamikasını gücləndiən coaching sessiyaları',
  'Komanda coaching xidmətlərimiz kollektiv performansı artırmaq üçün nəzərdə tutulub.',
  sc.id, 2, true, NULL
FROM service_categories sc WHERE sc.slug = 'coaching'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (title, slug, icon, description, content, category_id, sort_order, is_visible, image_url)
SELECT
  'Liderlik Coaching', 'liderlik-coaching', '🏆',
  'Liderlik bacarıqlarını inkişaf etdirmək üçün coaching',
  'Liderlik coaching proqramımız rəhbərlər üçün xüsusi olaraq hazırlanmışdır.',
  sc.id, 3, true, NULL
FROM service_categories sc WHERE sc.slug = 'coaching'
ON CONFLICT (slug) DO NOTHING;

-- Seed placeholder sub-services for Consulting
INSERT INTO services (title, slug, icon, description, content, category_id, sort_order, is_visible, image_url)
SELECT
  'Strateji Konsaltinq', 'strateji-konsaltinq', '📊',
  'Biznes strategiyasının hazırlanması və tətbiqi',
  'Strateji konsaltinq xidmətlərimiz şirkətinizin uzunmüddətli uğurunu təmin etmək üçün nəzərdə tutulub.',
  sc.id, 1, true, NULL
FROM service_categories sc WHERE sc.slug = 'consulting'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (title, slug, icon, description, content, category_id, sort_order, is_visible, image_url)
SELECT
  'Operativ Konsaltinq', 'operativ-konsaltinq', '⚙️',
  'Əməliyyat proseslərinin optimallaşdırılması',
  'Operativ konsaltinq xidmətimiz iş proseslərinin səmərəliliyini artırır.',
  sc.id, 2, true, NULL
FROM service_categories sc WHERE sc.slug = 'consulting'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (title, slug, icon, description, content, category_id, sort_order, is_visible, image_url)
SELECT
  'Texnoloji Konsaltinq', 'texnoloji-konsaltinq', '💻',
  'Texnoloji transformasiya və rəqəmsal həllər',
  'Texnoloji konsaltinq xidmətimiz müasir həllərlə biznesinizi irəli aparır.',
  sc.id, 3, true, NULL
FROM service_categories sc WHERE sc.slug = 'consulting'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
