-- =====================================================
-- FADAI - Projects Table Migration
-- =====================================================
-- Description: Creates the projects table for managing
--              medical imaging projects (Layihələr)
-- Security: Implements Row Level Security (RLS)
--           - Public: READ access for visible projects
--           - Admin: FULL access to all projects
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUM: Project Status
-- =====================================================
-- Maps to Azerbaijani UI:
-- • pending      -> Gözləmədə olanlar
-- • in_progress  -> İcrada olanlar  
-- • completed    -> Tamamlanmış
-- =====================================================

CREATE TYPE project_status AS ENUM (
  'pending',
  'in_progress',
  'completed'
);

-- =====================================================
-- TABLE: projects
-- =====================================================

CREATE TABLE IF NOT EXISTS projects (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Content (Azerbaijani)
  title TEXT NOT NULL,
  summary TEXT,
  
  -- Status
  status project_status NOT NULL DEFAULT 'pending',
  
  -- Visibility Control
  is_visible BOOLEAN NOT NULL DEFAULT true,
  
  -- Media
  image_url TEXT,
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INDEXES: Performance Optimization
-- =====================================================

-- Optimize public queries (is_visible = true)
CREATE INDEX idx_projects_visible ON projects (is_visible) 
WHERE is_visible = true;

-- Optimize status filtering
CREATE INDEX idx_projects_status ON projects (status);

-- Optimize chronological queries
CREATE INDEX idx_projects_created_at ON projects (created_at DESC);

-- =====================================================
-- TRIGGER: Auto-update updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICY 1: Public Read Access
-- =====================================================
-- Description: Allow anonymous and authenticated users
--              to view only visible projects
-- =====================================================

CREATE POLICY "Public users can view visible projects"
  ON projects
  FOR SELECT
  USING (is_visible = true);

-- =====================================================
-- POLICY 2: Admin Full Access
-- =====================================================
-- Description: Service role has complete access
--              for all CRUD operations
-- =====================================================

CREATE POLICY "Service role has full access"
  ON projects
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- POLICY 3: Authenticated Admin Users Full Access
-- =====================================================
-- Description: Authenticated users with admin role
--              have full CRUD access
-- Note: Requires auth.users table with custom claims
-- =====================================================

CREATE POLICY "Authenticated admins have full access"
  ON projects
  FOR ALL
  USING (
    auth.role() = 'authenticated' AND
    auth.jwt() ->> 'role' = 'admin'
  )
  WITH CHECK (
    auth.role() = 'authenticated' AND
    auth.jwt() ->> 'role' = 'admin'
  );

-- =====================================================
-- STORAGE: Project Images Bucket
-- =====================================================
-- Description: Create storage bucket for project images
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE POLICY: Public Read Access
-- =====================================================

CREATE POLICY "Public users can view project images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'projects');

-- =====================================================
-- STORAGE POLICY: Admin Upload Access
-- =====================================================

CREATE POLICY "Admins can upload project images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'projects' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
    )
  );

-- =====================================================
-- STORAGE POLICY: Admin Update/Delete Access
-- =====================================================

CREATE POLICY "Admins can update project images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'projects' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
    )
  );

CREATE POLICY "Admins can delete project images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'projects' AND
    (
      auth.role() = 'service_role' OR
      (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
    )
  );

-- =====================================================
-- SAMPLE DATA: For Development Only
-- =====================================================
-- Uncomment to seed with test data
-- =====================================================

/*
INSERT INTO projects (title, status, summary, is_visible) VALUES
  ('Nəzərət Protokolları', 'completed', 'Tibbi görüntüləmə üçün standart nəzərət protokolları', true),
  ('Şüa Təhlükəsizliyi Sistemi', 'in_progress', 'Xəstə və personal üçün şüa təhlükəsizliyi monitorinqi', true),
  ('AI Diaqnostika Platforması', 'pending', 'Süni intellekt əsaslı tibbi diaqnostika alətləri', false);
*/

-- =====================================================
-- END OF MIGRATION
-- =====================================================
