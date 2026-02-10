-- =====================================================
-- FAD-AI - Full CMS Tables Migration
-- =====================================================
-- Description: Creates all tables needed for the CMS:
--   products, product_features, product_images,
--   services, standards, team_members,
--   contact_submissions, site_settings, admin_users
-- Security: Implements Row Level Security (RLS)
-- =====================================================

-- =====================================================
-- TABLE: products
-- =====================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  specifications JSONB DEFAULT '{}',
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_visible ON products (is_visible) WHERE is_visible = true;
CREATE INDEX idx_products_sort_order ON products (sort_order);

CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: product_features
-- =====================================================

CREATE TABLE IF NOT EXISTS product_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_features_product_id ON product_features (product_id);

-- =====================================================
-- TABLE: product_images
-- =====================================================

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_images_product_id ON product_images (product_id);

-- =====================================================
-- TABLE: services
-- =====================================================

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  description TEXT,
  details JSONB DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_visible ON services (is_visible) WHERE is_visible = true;
CREATE INDEX idx_services_sort_order ON services (sort_order);

CREATE TRIGGER trigger_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: standards
-- =====================================================

CREATE TABLE IF NOT EXISTS standards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon TEXT NOT NULL DEFAULT '',
  acronym TEXT,
  full_name TEXT,
  title TEXT NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]',
  category TEXT NOT NULL DEFAULT 'main',
  az_name TEXT,
  normal_range TEXT,
  measurement TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_standards_category ON standards (category);
CREATE INDEX idx_standards_visible ON standards (is_visible) WHERE is_visible = true;

CREATE TRIGGER trigger_standards_updated_at
  BEFORE UPDATE ON standards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: team_members
-- =====================================================

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  linkedin_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trigger_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: contact_submissions
-- =====================================================

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_submissions_is_read ON contact_submissions (is_read);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions (created_at DESC);

-- =====================================================
-- TABLE: site_settings (key-value CMS store)
-- =====================================================

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trigger_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: admin_users
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY: products
-- =====================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users can view visible products"
  ON products FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Service role has full access to products"
  ON products FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated admins have full access to products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- =====================================================
-- ROW LEVEL SECURITY: product_features
-- =====================================================

ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users can view product features"
  ON product_features FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = product_features.product_id AND products.is_visible = true
    )
  );

CREATE POLICY "Service role has full access to product features"
  ON product_features FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated admins have full access to product features"
  ON product_features FOR ALL
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- =====================================================
-- ROW LEVEL SECURITY: product_images
-- =====================================================

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users can view product images"
  ON product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.is_visible = true
    )
  );

CREATE POLICY "Service role has full access to product images"
  ON product_images FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated admins have full access to product images"
  ON product_images FOR ALL
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- =====================================================
-- ROW LEVEL SECURITY: services
-- =====================================================

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users can view visible services"
  ON services FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Service role has full access to services"
  ON services FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated admins have full access to services"
  ON services FOR ALL
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- =====================================================
-- ROW LEVEL SECURITY: standards
-- =====================================================

ALTER TABLE standards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users can view visible standards"
  ON standards FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Service role has full access to standards"
  ON standards FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated admins have full access to standards"
  ON standards FOR ALL
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- =====================================================
-- ROW LEVEL SECURITY: team_members
-- =====================================================

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users can view visible team members"
  ON team_members FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Service role has full access to team members"
  ON team_members FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated admins have full access to team members"
  ON team_members FOR ALL
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- =====================================================
-- ROW LEVEL SECURITY: contact_submissions
-- =====================================================

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can read contact submissions"
  ON contact_submissions FOR SELECT
  USING (
    auth.role() = 'service_role' OR
    (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
  );

CREATE POLICY "Only admins can update contact submissions"
  ON contact_submissions FOR UPDATE
  USING (
    auth.role() = 'service_role' OR
    (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
  );

CREATE POLICY "Only admins can delete contact submissions"
  ON contact_submissions FOR DELETE
  USING (
    auth.role() = 'service_role' OR
    (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
  );

-- =====================================================
-- ROW LEVEL SECURITY: site_settings
-- =====================================================

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users can read site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Service role has full access to site settings"
  ON site_settings FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated admins have full access to site settings"
  ON site_settings FOR ALL
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- =====================================================
-- ROW LEVEL SECURITY: admin_users
-- =====================================================

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages admin_users"
  ON admin_users FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can read admin_users"
  ON admin_users FOR SELECT
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('team', 'team', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('site', 'site', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for 'team' bucket
CREATE POLICY "Public users can view team images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'team');

CREATE POLICY "Admins can upload team images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'team' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
    )
  );

CREATE POLICY "Admins can update team images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'team' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
    )
  );

CREATE POLICY "Admins can delete team images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'team' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
    )
  );

-- Storage policies for 'site' bucket
CREATE POLICY "Public users can view site images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site');

CREATE POLICY "Admins can upload site images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'site' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
    )
  );

CREATE POLICY "Admins can update site images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'site' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
    )
  );

CREATE POLICY "Admins can delete site images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'site' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
    )
  );

-- =====================================================
-- CUSTOM ACCESS TOKEN HOOK (for admin role in JWT)
-- =====================================================

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event JSONB)
RETURNS JSONB LANGUAGE plpgsql STABLE AS $$
DECLARE
  claims JSONB;
  is_admin BOOLEAN;
BEGIN
  claims := event->'claims';

  SELECT EXISTS(
    SELECT 1 FROM public.admin_users WHERE id = (event->>'user_id')::UUID
  ) INTO is_admin;

  IF is_admin THEN
    claims := jsonb_set(claims, '{role}', '"admin"');
  ELSE
    claims := jsonb_set(claims, '{role}', '"user"');
  END IF;

  event := jsonb_set(event, '{claims}', claims);
  RETURN event;
END;
$$;

GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM authenticated, anon, public;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
