-- =====================================================
-- FADAI - Homepage Sections Seed Data
-- =====================================================
-- Seeds all new homepage section content into site_settings
-- =====================================================

-- Social Proof
INSERT INTO site_settings (key, value) VALUES
  ('social_proof', '{
    "title": "Etibarlı tərəfdaşlar",
    "logos": []
  }'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Homepage Stats
INSERT INTO site_settings (key, value) VALUES
  ('homepage_stats', '{
    "stats": [
      { "value": "50+", "label": "Tibbi müəssisə" },
      { "value": "10K+", "label": "Analiz edilmiş görüntü" },
      { "value": "99.2%", "label": "Dəqiqlik dərəcəsi" },
      { "value": "24/7", "label": "Texniki dəstək" }
    ]
  }'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- About Preview
INSERT INTO site_settings (key, value) VALUES
  ('about_preview', '{
    "title": "Biz kimik?",
    "description": "FADAI tibbi görüntüləmə sahəsində süni intellekt texnologiyalarını tətbiq edən innovativ şirkətdir. Missiyamız — dəqiq diaqnostika ilə həyatları dəyişmək. Müasir texnologiyalar və peşəkar komandamızla səhiyyə sektorunda yeni standartlar qoyuruq.",
    "image_url": "",
    "cta_text": "Ətraflı",
    "cta_url": "/about"
  }'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Features Grid
INSERT INTO site_settings (key, value) VALUES
  ('features_grid', '{
    "title": "Əsas Üstünlüklərimiz",
    "subtitle": "Müasir tibbi görüntüləmə texnologiyaları ilə gələcəyə addım",
    "features": [
      { "icon": "🔬", "title": "Dəqiq Diaqnostika", "description": "Süni intellekt alqoritmləri ilə tibbi görüntülərin yüksək dəqiqliklə analizi." },
      { "icon": "⚡", "title": "Sürətli Nəticə", "description": "Real vaxt rejimində görüntü analizi və saniyələr ərzində nəticə." },
      { "icon": "🔒", "title": "Məlumat Təhlükəsizliyi", "description": "HIPAA uyğun, şifrələnmiş məlumat saxlama və ötürmə." },
      { "icon": "🔗", "title": "Asan İnteqrasiya", "description": "Mövcud PACS/RIS sistemləri ilə problemsiz inteqrasiya." },
      { "icon": "📊", "title": "Ətraflı Hesabatlar", "description": "Avtomatik hesabat yaratma və statistik analiz imkanları." },
      { "icon": "🎓", "title": "Peşəkar Təlim", "description": "Hər müəssisə üçün fərdiləşdirilmiş təlim və dəstək proqramları." }
    ]
  }'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- CTA / Lead Magnet
INSERT INTO site_settings (key, value) VALUES
  ('homepage_cta', '{
    "title": "Layihənizi bizimlə başlayın",
    "subtitle": "Pulsuz konsultasiya alın və tibbi görüntüləmə həllərimizi kəşf edin. Komandamız sizə ən uyğun həlli tapmaqda kömək edəcək.",
    "cta_text": "Pulsuz Konsultasiya",
    "cta_url": "/contact",
    "image_url": ""
  }'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
