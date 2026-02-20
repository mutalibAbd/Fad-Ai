'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';
import type {
  HeroContent,
  HomepageService,
  SocialProofContent,
  TrustLogo,
  AboutPreviewContent,
  FeaturesGridContent,
  FeatureItem,
  StatsContent,
  StatItem,
  CTAContent,
} from '@/lib/types';

interface Props {
  hero: HeroContent;
  services: HomepageService[];
  socialProof: SocialProofContent;
  aboutPreview: AboutPreviewContent;
  featuresGrid: FeaturesGridContent;
  stats: StatsContent;
  cta: CTAContent;
}

export default function HomepageEditorClient({
  hero,
  services,
  socialProof,
  aboutPreview,
  featuresGrid,
  stats,
  cta,
}: Props) {
  const router = useRouter();

  // ─── Hero State ───
  const [headline, setHeadline] = useState(hero.headline);
  const [subheadline, setSubheadline] = useState(hero.subheadline);
  const [ctaPrimaryText, setCtaPrimaryText] = useState(hero.cta_primary_text);
  const [ctaPrimaryUrl, setCtaPrimaryUrl] = useState(hero.cta_primary_url);
  const [ctaSecondaryText, setCtaSecondaryText] = useState(hero.cta_secondary_text);
  const [ctaSecondaryUrl, setCtaSecondaryUrl] = useState(hero.cta_secondary_url);

  // ─── Services State ───
  const [serviceList, setServiceList] = useState<HomepageService[]>(
    services.length > 0 ? services : [{ icon: '', title: '', description: '' }]
  );

  // ─── Social Proof State ───
  const [spTitle, setSpTitle] = useState(socialProof.title);
  const [logoList, setLogoList] = useState<TrustLogo[]>(
    socialProof.logos.length > 0 ? socialProof.logos : []
  );

  // ─── Stats State ───
  const [statList, setStatList] = useState<StatItem[]>(
    stats.stats.length > 0 ? stats.stats : []
  );

  // ─── About Preview State ───
  const [apTitle, setApTitle] = useState(aboutPreview.title);
  const [apDescription, setApDescription] = useState(aboutPreview.description);
  const [apImageUrl, setApImageUrl] = useState(aboutPreview.image_url);
  const [apCtaText, setApCtaText] = useState(aboutPreview.cta_text);
  const [apCtaUrl, setApCtaUrl] = useState(aboutPreview.cta_url);

  // ─── Features Grid State ───
  const [fgTitle, setFgTitle] = useState(featuresGrid.title);
  const [fgSubtitle, setFgSubtitle] = useState(featuresGrid.subtitle);
  const [featureList, setFeatureList] = useState<FeatureItem[]>(
    featuresGrid.features.length > 0 ? featuresGrid.features : []
  );

  // ─── CTA State ───
  const [ctaTitle, setCtaTitle] = useState(cta.title);
  const [ctaSubtitle, setCtaSubtitle] = useState(cta.subtitle);
  const [ctaButtonText, setCtaButtonText] = useState(cta.cta_text);
  const [ctaButtonUrl, setCtaButtonUrl] = useState(cta.cta_url);
  const [ctaImageUrl, setCtaImageUrl] = useState(cta.image_url);

  // ─── Global State ───
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // ─── Save Helper ───
  async function saveSetting(key: string, value: unknown, successMsg: string) {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { updateSiteSetting } = await import('@/lib/actions/settings');
      const result = await updateSiteSetting(key, JSON.parse(JSON.stringify(value)));

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(successMsg);
        router.refresh();
      }
    } catch {
      setError('Xəta baş verdi');
    }

    setLoading(false);
  }

  // ─── Section Handlers ───
  const handleSaveHero = () =>
    saveSetting('hero', {
      headline,
      subheadline,
      cta_primary_text: ctaPrimaryText,
      cta_primary_url: ctaPrimaryUrl,
      cta_secondary_text: ctaSecondaryText,
      cta_secondary_url: ctaSecondaryUrl,
    }, 'Hero bölməsi yeniləndi');

  const handleSaveServices = () => {
    const filtered = serviceList.filter((s) => s.title.trim() !== '');
    saveSetting('homepage_services', filtered, 'Xidmət kartları yeniləndi');
  };

  const updateService = (index: number, field: keyof HomepageService, value: string) => {
    setServiceList((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const handleSaveSocialProof = () =>
    saveSetting('social_proof', { title: spTitle, logos: logoList }, 'Sosial sübut bölməsi yeniləndi');

  const updateLogo = (index: number, field: keyof TrustLogo, value: string) => {
    setLogoList((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  };

  const handleSaveStats = () =>
    saveSetting('homepage_stats', { stats: statList }, 'Statistikalar yeniləndi');

  const updateStat = (index: number, field: keyof StatItem, value: string) => {
    setStatList((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const handleSaveAboutPreview = () =>
    saveSetting('about_preview', {
      title: apTitle,
      description: apDescription,
      image_url: apImageUrl,
      cta_text: apCtaText,
      cta_url: apCtaUrl,
    }, 'Haqqımızda bölməsi yeniləndi');

  const handleSaveFeaturesGrid = () => {
    const filtered = featureList.filter((f) => f.title.trim() !== '');
    saveSetting('features_grid', { title: fgTitle, subtitle: fgSubtitle, features: filtered }, 'Üstünlüklər yeniləndi');
  };

  const updateFeature = (index: number, field: keyof FeatureItem, value: string) => {
    setFeatureList((prev) => prev.map((f, i) => (i === index ? { ...f, [field]: value } : f)));
  };

  const handleSaveCTA = () =>
    saveSetting('homepage_cta', {
      title: ctaTitle,
      subtitle: ctaSubtitle,
      cta_text: ctaButtonText,
      cta_url: ctaButtonUrl,
      image_url: ctaImageUrl,
    }, 'CTA bölməsi yeniləndi');

  // ─── UI Helpers ───
  function SaveButton({ onClick, label }: { onClick: () => void; label: string }) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium tracking-tight hover:bg-primary-600 transition-colors disabled:opacity-50"
      >
        {loading ? 'Saxlanılır...' : label}
      </button>
    );
  }

  function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold tracking-tight text-text-primary mb-5">{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  }

  return (
    <div className="space-y-10 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-red-800 tracking-tight text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <p className="text-green-800 tracking-tight text-sm">{success}</p>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          1. HERO SECTION
          ══════════════════════════════════════════════ */}
      <SectionCard title="🎯 Hero Bölməsi">
        <FormField label="Başlıq" name="headline" value={headline} onChange={setHeadline} required />
        <FormField label="Alt başlıq" name="subheadline" type="textarea" value={subheadline} onChange={setSubheadline} rows={3} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Əsas CTA mətni" name="cta_primary_text" value={ctaPrimaryText} onChange={setCtaPrimaryText} />
          <FormField label="Əsas CTA linki" name="cta_primary_url" value={ctaPrimaryUrl} onChange={setCtaPrimaryUrl} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="İkinci CTA mətni" name="cta_secondary_text" value={ctaSecondaryText} onChange={setCtaSecondaryText} />
          <FormField label="İkinci CTA linki" name="cta_secondary_url" value={ctaSecondaryUrl} onChange={setCtaSecondaryUrl} />
        </div>
        <SaveButton onClick={handleSaveHero} label="Hero-nu yadda saxla" />
      </SectionCard>

      {/* ══════════════════════════════════════════════
          2. SOCIAL PROOF / STATS
          ══════════════════════════════════════════════ */}
      <SectionCard title="⭐ Sosial Sübut & Statistikalar">
        <FormField label="Bölmə başlığı" name="sp_title" value={spTitle} onChange={setSpTitle} />

        {/* Stats */}
        <div className="pt-2">
          <p className="text-sm font-medium text-text-primary tracking-tight mb-3">Statistikalar</p>
          {statList.map((stat, index) => (
            <div key={index} className="bg-slate-50/50 rounded-xl border border-slate-100 p-3 mb-3 relative">
              <button
                type="button"
                onClick={() => setStatList((prev) => prev.filter((_, i) => i !== index))}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-medium tracking-tight"
              >
                Sil
              </button>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Dəyər" name={`stat_val_${index}`} value={stat.value} onChange={(v) => updateStat(index, 'value', v)} placeholder="100+" />
                <FormField label="Etiket" name={`stat_lbl_${index}`} value={stat.label} onChange={(v) => updateStat(index, 'label', v)} placeholder="Müştəri" />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setStatList((prev) => [...prev, { value: '', label: '' }])}
            className="text-sm font-medium tracking-tight text-primary hover:text-primary-600 transition-colors"
          >
            + Statistika əlavə et
          </button>
        </div>

        {/* Logos */}
        <div className="pt-2">
          <p className="text-sm font-medium text-text-primary tracking-tight mb-3">Tərəfdaş Logoları</p>
          {logoList.map((logo, index) => (
            <div key={index} className="bg-slate-50/50 rounded-xl border border-slate-100 p-3 mb-3 relative">
              <button
                type="button"
                onClick={() => setLogoList((prev) => prev.filter((_, i) => i !== index))}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-medium tracking-tight"
              >
                Sil
              </button>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Ad" name={`logo_name_${index}`} value={logo.name} onChange={(v) => updateLogo(index, 'name', v)} placeholder="Şirkət adı" />
                <FormField label="Logo URL" name={`logo_url_${index}`} type="url" value={logo.image_url} onChange={(v) => updateLogo(index, 'image_url', v)} placeholder="https://..." />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setLogoList((prev) => [...prev, { name: '', image_url: '' }])}
            className="text-sm font-medium tracking-tight text-primary hover:text-primary-600 transition-colors"
          >
            + Logo əlavə et
          </button>
        </div>

        <div className="flex gap-3 pt-2">
          <SaveButton onClick={handleSaveSocialProof} label="Logoları yadda saxla" />
          <SaveButton onClick={handleSaveStats} label="Statistikaları yadda saxla" />
        </div>
      </SectionCard>

      {/* ══════════════════════════════════════════════
          3. ABOUT PREVIEW
          ══════════════════════════════════════════════ */}
      <SectionCard title="👥 Haqqımızda (Ön baxış)">
        <FormField label="Başlıq" name="ap_title" value={apTitle} onChange={setApTitle} required />
        <FormField label="Təsvir" name="ap_description" type="textarea" value={apDescription} onChange={setApDescription} rows={4} />
        <FormField label="Şəkil URL" name="ap_image_url" type="url" value={apImageUrl} onChange={setApImageUrl} placeholder="https://..." />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="CTA mətni" name="ap_cta_text" value={apCtaText} onChange={setApCtaText} />
          <FormField label="CTA linki" name="ap_cta_url" value={apCtaUrl} onChange={setApCtaUrl} />
        </div>
        <SaveButton onClick={handleSaveAboutPreview} label="Yadda saxla" />
      </SectionCard>

      {/* ══════════════════════════════════════════════
          4. SERVICES CARDS
          ══════════════════════════════════════════════ */}
      <SectionCard title="⚙️ Xidmət Kartları">
        {serviceList.map((service, index) => (
          <div key={index} className="bg-slate-50/50 rounded-xl border border-slate-100 p-4 relative">
            <button
              type="button"
              onClick={() => setServiceList((prev) => prev.filter((_, i) => i !== index))}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-sm font-medium tracking-tight"
            >
              Sil
            </button>
            <div className="grid grid-cols-[80px_1fr] gap-4 mb-3">
              <FormField label="Icon" name={`service_icon_${index}`} value={service.icon} onChange={(v) => updateService(index, 'icon', v)} placeholder="🔬" />
              <FormField label="Başlıq" name={`service_title_${index}`} value={service.title} onChange={(v) => updateService(index, 'title', v)} />
            </div>
            <FormField label="Təsvir" name={`service_desc_${index}`} type="textarea" value={service.description} onChange={(v) => updateService(index, 'description', v)} rows={2} />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setServiceList((prev) => [...prev, { icon: '', title: '', description: '' }])}
          className="text-sm font-medium tracking-tight text-primary hover:text-primary-600 transition-colors"
        >
          + Yeni xidmət kartı əlavə et
        </button>
        <div>
          <SaveButton onClick={handleSaveServices} label="Xidmət kartlarını yadda saxla" />
        </div>
      </SectionCard>

      {/* ══════════════════════════════════════════════
          5. FEATURES GRID
          ══════════════════════════════════════════════ */}
      <SectionCard title="✨ Əsas Üstünlüklər">
        <FormField label="Başlıq" name="fg_title" value={fgTitle} onChange={setFgTitle} required />
        <FormField label="Alt başlıq" name="fg_subtitle" type="textarea" value={fgSubtitle} onChange={setFgSubtitle} rows={2} />

        {featureList.map((feature, index) => (
          <div key={index} className="bg-slate-50/50 rounded-xl border border-slate-100 p-4 relative">
            <button
              type="button"
              onClick={() => setFeatureList((prev) => prev.filter((_, i) => i !== index))}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-sm font-medium tracking-tight"
            >
              Sil
            </button>
            <div className="grid grid-cols-[80px_1fr] gap-4 mb-3">
              <FormField label="Icon" name={`feat_icon_${index}`} value={feature.icon} onChange={(v) => updateFeature(index, 'icon', v)} placeholder="🔬" />
              <FormField label="Başlıq" name={`feat_title_${index}`} value={feature.title} onChange={(v) => updateFeature(index, 'title', v)} />
            </div>
            <FormField label="Təsvir" name={`feat_desc_${index}`} type="textarea" value={feature.description} onChange={(v) => updateFeature(index, 'description', v)} rows={2} />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFeatureList((prev) => [...prev, { icon: '', title: '', description: '' }])}
          className="text-sm font-medium tracking-tight text-primary hover:text-primary-600 transition-colors"
        >
          + Üstünlük əlavə et
        </button>
        <div>
          <SaveButton onClick={handleSaveFeaturesGrid} label="Üstünlükləri yadda saxla" />
        </div>
      </SectionCard>

      {/* ══════════════════════════════════════════════
          6. CTA / LEAD MAGNET
          ══════════════════════════════════════════════ */}
      <SectionCard title="📢 CTA / Təklif Bölməsi">
        <FormField label="Başlıq" name="cta_title" value={ctaTitle} onChange={setCtaTitle} required />
        <FormField label="Alt başlıq" name="cta_subtitle" type="textarea" value={ctaSubtitle} onChange={setCtaSubtitle} rows={2} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Düymə mətni" name="cta_btn_text" value={ctaButtonText} onChange={setCtaButtonText} />
          <FormField label="Düymə linki" name="cta_btn_url" value={ctaButtonUrl} onChange={setCtaButtonUrl} />
        </div>
        <FormField label="Şəkil URL" name="cta_img_url" type="url" value={ctaImageUrl} onChange={setCtaImageUrl} placeholder="https://..." />
        <SaveButton onClick={handleSaveCTA} label="CTA-nı yadda saxla" />
      </SectionCard>
    </div>
  );
}
