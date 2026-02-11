-- =====================================================
-- FADAI - CMS Seed Data
-- =====================================================
-- Migrates all hardcoded content from pages into DB
-- =====================================================

-- =====================================================
-- PRODUCTS
-- =====================================================

INSERT INTO products (slug, icon, title, description, long_description, sort_order) VALUES
  ('radvision', '🔬', 'RadVision', 'Tibbi goruntuleme ve radioloji diaqnostika sistemi',
   'RadVision tibbi goruntuleme ve radioloji diaqnostika ucun hazirlanmis innovativ platformadir. Fetal, ginekologiya ve abdominal sahelerinde deqiq diaqnostika imkani yaradir.',
   1),
  ('biotronics', '🧠', 'Biotronics', 'Suni intellekt esasli tibbi goruntu analizi sistemleri',
   'Biotronics suni intellekt texnologiyalari ile tibbi goruntulerin avtomatik analizini heyata kecirir. MRT, CT, X-rey ve monoqrafiya sahelerinde AI destekli diaqnostika teqdim edir.',
   2),
  ('labarotoria-ai', '🔎', 'Labarotoria AI', 'Laboratoriya analizi ucun suni intellekt helleri',
   'Labarotoria AI laboratoriya neticelerinin suni intellekt vasitesile analiz edilmesini temin edir. Mikroskop oxuma ve neticelerin avtomatik tehlili imkanlari yaradir.',
   3);

-- =====================================================
-- PRODUCT FEATURES
-- =====================================================

-- RadVision features
INSERT INTO product_features (product_id, title, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 'radvision'), 'Fetal', 1),
  ((SELECT id FROM products WHERE slug = 'radvision'), 'Ginokologiya', 2),
  ((SELECT id FROM products WHERE slug = 'radvision'), 'Abdomonologiya', 3);

-- Biotronics features
INSERT INTO product_features (product_id, title, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 'biotronics'), 'MRT AI', 1),
  ((SELECT id FROM products WHERE slug = 'biotronics'), 'CT AI', 2),
  ((SELECT id FROM products WHERE slug = 'biotronics'), 'X rey AI', 3),
  ((SELECT id FROM products WHERE slug = 'biotronics'), 'Monoqrafiya AI', 4);

-- Labarotoria AI features
INSERT INTO product_features (product_id, title, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 'labarotoria-ai'), 'Mikroskop oxuma', 1),
  ((SELECT id FROM products WHERE slug = 'labarotoria-ai'), 'Neticelerin tehlili', 2);

-- =====================================================
-- SERVICES
-- =====================================================

INSERT INTO services (icon, title, description, details, sort_order) VALUES
  ('🎯', 'Kouçluq ve sistem konsultasiyasi',
   'Rehberliyin ve sistemin tekmilesdirilmesi.',
   '["Sistemin cari veziyyetinin analizi", "Is proseslerinin optimallasdirmasi", "Komanda semereli̇li̇yi̇ni̇n artirilmasi", "Strateji planlasdirma desteyi"]',
   1),
  ('⚙️', 'Sistem hedeflerinin kalibrasiyasi',
   'Meqsedlerin deqiqlesdirilmesi ve uygunlasdirilmasi.',
   '["Sistem meqsedlerinin mueyyenlesdirilmesi", "KPI gostericilerinin tenzimlenmesi", "Performans metrikalarinin izlenmesi", "Netice esasli yanasma"]',
   2),
  ('🎓', 'Hedeflerin kalibrasiyasi',
   'Ferdi ve komanda hedeflerin tenzimlenmesi.',
   '["Ferdi inkisaf planlari", "Komanda hedeflerinin uygunlasdirilmasi", "Bacariq seviyyesinin qiymetlendirilmesi", "Telim proqramlarinin hazirlanmasi"]',
   3),
  ('📊', 'Avtomatlasdirilmis Monitoring Sistemi',
   'Real-vaxt rejiminde izleme ve xeberdarliq icrasi.',
   '["Sistem performansinin izlenmesi", "Avtomatik xeberdarliq mexanizmi", "Hesabat ve analitika", "Proaktiv problem helli"]',
   4),
  ('🔬', 'Protokol Telim̈leri',
   'ISUOG standartlarina uygun peskar telimlər.',
   '["Beynelxalq standartlar uzre telim", "Praktik mesgeleler", "Sertifikasiya desteyi", "Davamli tehsil proqramlari"]',
   5),
  ('🛡️', 'Texniki Destek',
   'Fasilesiz texniki dəstək ve sistem inteqrasiyasi.',
   '["24/7 texniki destek xidmeti", "Sistem yeniləmələri", "Melumat tehlukesizliyi", "Uzaqdan mudaxile imkani"]',
   6);

-- =====================================================
-- STANDARDS - Main (ISUOG, DICOM, HL7)
-- =====================================================

INSERT INTO standards (icon, acronym, full_name, title, description, features, category, sort_order) VALUES
  ('🏥', 'ISUOG', 'International Society of Ultrasound in Obstetrics and Gynecology',
   'Muayine protokollarinin standartlasdirilmasi',
   'ISUOG teleblerine tam uygunluq.',
   '["Beynelxalq qebul edilmis telimatlar", "Keyfiyyet standartlari uzre uygunluq", "Sistemli muayine metodologiyasi", "Davamli yenileme ve tekmilesdi̇rme"]',
   'main', 1),
  ('📡', 'DICOM', 'Digital Imaging and Communications in Medicine',
   'Melumat bazasinin standartlasdirilmasi',
   'Strukturlu ve elaqeli melumat arxivi.',
   '["Tibbi goruntulerin vahid formati", "Sistemler arasi uygunluq", "Arxivlesdirme ve sebeke oturulmesi", "Metadata idareetmesi"]',
   'main', 2),
  ('🔗', 'HL7', 'Health Level Seven International',
   'Proseslerin standartlasdirilmasi',
   'Is axininin optimallasdirmasi ve izlenmesi.',
   '["Tibbi melumat mubadilesi standarti", "Sistemlerin inteqrasiyasi", "Elektron tibbi qeydler", "Emeliyyat proseslerinin avtomatlasdirilmasi"]',
   'main', 3);

-- =====================================================
-- STANDARDS - Additional
-- =====================================================

INSERT INTO standards (icon, title, description, category, sort_order) VALUES
  ('🤖', 'Avtomatlasdi̇rma proseslerinin standartlasdirilmasi',
   'Tekrarlanan tapsiriqlarin avtomatik icrasi.',
   'additional', 4),
  ('🛡️', 'Tehlukesizlik standartlari',
   'Melumatlarin qorunmasi ve mexfiliyin teminati.',
   'additional', 5);

-- =====================================================
-- STANDARDS - Biometric Indicators
-- =====================================================

INSERT INTO standards (icon, acronym, full_name, title, description, category, az_name, normal_range, measurement, sort_order) VALUES
  ('📏', 'BPD', 'Biparietal Diameter',
   'Biaparital diametr',
   'Fetal basin eni, hamiləlik heftesinin mueyyen edilmesi ucun',
   'biometric', 'Biaparital diametr', '20-95 mm', 'Parietal sumukler arasi mesafe', 1),
  ('📏', 'HC', 'Head Circumference',
   'Bas dairesi',
   'Fetal basin etrafi, beyin inkisafinin qiymetlendirilmesi',
   'biometric', 'Bas dairesi', '75-350 mm', 'Basin xarici konturunun perimetri', 2),
  ('📏', 'AC', 'Abdominal Circumference',
   'Qarin dairesi',
   'Fetal qarin etrafi, ceki artiminin mueyyen edilmesi',
   'biometric', 'Qarin dairesi', '60-380 mm', 'Qarin boslugunun perimetri', 3),
  ('📏', 'FL', 'Femur Length',
   'Bud sumuyu uzunlugu',
   'Fetal bud sumuyunun uzunlugu, skelet inkisafi',
   'biometric', 'Bud sumuyu uzunlugu', '10-85 mm', 'Femur diafizinin uzunlugu', 4);

-- =====================================================
-- SITE SETTINGS
-- =====================================================

INSERT INTO site_settings (key, value) VALUES
  ('hero', '{
    "headline": "Radiologiyada Rəqəmsal Simfoniya",
    "subheadline": "Tibbi goruntuleme de deqiqliyin orkestrlesdiri̇lmesi - innovativ suni intellekt texnologiyasi",
    "cta_primary_text": "Baslamaq",
    "cta_primary_url": "/products",
    "cta_secondary_text": "Etrafli Melumat",
    "cta_secondary_url": "/about"
  }'),
  ('about', '{
    "story_title": "FADAI haqqinda",
    "story_text": "FADAI tibbi goruntuleme sahesinde suni intellekt texnologiyalarini tetbiq eden innovativ sirketdir. Missiyamiz tibbi diaqnostikanin deqiqliyini ve semereli̇li̇yi̇ni̇ artirmaqdır.",
    "mission_text": "Tibbi goruntuleme sahesinde en son texnologiyalarin tetbiqi ile sehiyye sektoruna tohe vermek."
  }'),
  ('about_stats', '[
    {"label": "Il tecrube", "value": "5+"},
    {"label": "Layihe", "value": "50+"},
    {"label": "Musteri", "value": "20+"},
    {"label": "Komanda uzvu", "value": "15+"}
  ]'),
  ('contact_info', '{
    "email": "info@fadai.com",
    "phone": "+994 XX XXX XX XX",
    "address": "Baki, Azerbaycan"
  }'),
  ('social_links', '{
    "facebook": "",
    "instagram": "",
    "linkedin": "",
    "youtube": ""
  }'),
  ('homepage_services', '[
    {"icon": "🔬", "title": "Tibbi Goruntuleme", "description": "Deqiq diaqnostika ve analiz ucun suni intellekt esasli tibbi goruntuleme helleri."},
    {"icon": "⚡", "title": "Protokol Standartlari", "description": "Tibbi goruntuleme is prosesleri ucun qabaqcil protokollar ve standartlar."},
    {"icon": "🎯", "title": "Ekspert Destek", "description": "Fasilesiz inteqrasiya ve emeliyyat ucun 24/7 texniki destek ve telim."}
  ]');

-- =====================================================
-- TEAM MEMBERS (placeholder data)
-- =====================================================

INSERT INTO team_members (name, role, bio, sort_order) VALUES
  ('FADAI Komandasi', 'Umumi Rehber', 'Tibbi goruntuleme sahesinde tecrubeli mutexessisler komandasi.', 1);

-- =====================================================
-- END OF SEED DATA
-- =====================================================
