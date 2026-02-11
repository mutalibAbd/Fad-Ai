-- =====================================================
-- FADAI - Projects Sample Data
-- =====================================================
-- Description: Sample projects for testing the UI
-- Usage: Run this after running the initial migration
-- =====================================================

-- Clear existing data (if any)
TRUNCATE TABLE projects CASCADE;

-- Insert sample projects
INSERT INTO projects (title, summary, status, is_visible, image_url) VALUES
(
  'DICOM Şəkil Analizi Sistemi',
  'Tibbi görüntülərin avtomatik analizini həyata keçirən süni intellekt əsaslı sistem. Radioloji təsvirlərdə anomaliyaları aşkar etmək üçün dərin öyrənmə alqoritmləri tətbiq edilir.',
  'completed',
  true,
  null
),
(
  'MRT Görüntüləmə Platforması',
  'Maqnit-rezonans tomoqrafiya görüntülərinin emalı və vizuallaşdırılması üçün inkişaf etmiş platforma. 3D rekonstruksiya və interaktiv analiz imkanları təqdim edir.',
  'in_progress',
  true,
  null
),
(
  'CT Skan Proqramı',
  'Kompüter tomoqrafiyası skanlarının sürətli və dəqiq işlənməsi üçün proqram təminatı. Real vaxt rejimində görüntü emalı və diaqnostik təklif sistemi.',
  'in_progress',
  true,
  null
),
(
  'Rentgen Görüntü Arxivi',
  'Rentgen görüntülərinin saxlanması, indeksləşdirilməsi və sürətli axtarışı üçün bulud əsaslı arxiv sistemi. PACS standartlarına uyğun struktur.',
  'pending',
  true,
  null
),
(
  'Ultrasəs Diaqnostika Köməkçisi',
  'Ultrasəs müayinələrinin keyfiyyətini artırmaq üçün süni intellekt köməkçisi. Real vaxt rejimində görüntü analizi və tövsiyə sistemi.',
  'pending',
  true,
  null
),
(
  'Nevroloji Görüntüləmə Tətbiqi',
  'Beyin görüntülərinin analizini asanlaşdıran ixtisaslaşmış tətbiq. Alzheimer, şizofreniya və digər nevroloji xəstəliklərin erkən diaqnostikası üçün ML modellər.',
  'completed',
  true,
  null
),
(
  'Kardioloji Scan Sistemi',
  'Ürək və damar görüntülərinin kompleks analizi üçün sistem. EKQ və ekokardioqrafiya nəticələrinin inteqrasiyası ilə hərtərəfli diaqnostika.',
  'pending',
  true,
  null
),
(
  'Onkoloji Görüntü Platforması',
  'Xərçəng şişlərinin müəyyənləşdirilməsi və dinamikasının izlənilməsi üçün ixtisaslaşdırılmış platforma. Multi-modal görüntülərin birləşdirilməsi və müqayisəli analiz.',
  'in_progress',
  true,
  null
);

-- Verify insertion
SELECT 
  status,
  COUNT(*) as count
FROM projects
WHERE is_visible = true
GROUP BY status
ORDER BY status;
