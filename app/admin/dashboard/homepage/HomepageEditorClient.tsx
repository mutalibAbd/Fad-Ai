'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';
import type {
  HeroContent,
  HeroSlide,
  AboutPreviewContent,
  AboutStat,
  SectionTitles,
  FooterContent,
  FooterLink,
  ContactCTAContent,
} from '@/lib/types';

// ─── UI Helpers ───

function SaveButton({ onClick, label, loading }: { onClick: () => void; label: string; loading: boolean }) {
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

function SmallButton({ onClick, label, variant = 'default' }: { onClick: () => void; label: string; variant?: 'default' | 'danger' }) {
  const cls = variant === 'danger'
    ? 'text-red-600 hover:text-red-800 border-red-200 hover:border-red-300'
    : 'text-text-secondary hover:text-text-primary border-slate-200 hover:border-slate-300';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg border text-xs font-medium tracking-tight transition-colors ${cls}`}
    >
      {label}
    </button>
  );
}

// ─── Main Component ───

interface Props {
  hero: HeroContent;
  aboutPreview: AboutPreviewContent;
  aboutStats: AboutStat[];
  sectionTitles: SectionTitles;
  footerContent: FooterContent;
  contactCTA: ContactCTAContent;
}

export default function HomepageEditorClient({
  hero,
  aboutPreview,
  aboutStats: initialStats,
  sectionTitles,
  footerContent,
  contactCTA: initialContactCTA,
}: Props) {
  const router = useRouter();

  // ─── Hero State (slide-based) ───
  const [slides, setSlides] = useState<HeroSlide[]>(hero.slides);
  const [ctaPrimaryText, setCtaPrimaryText] = useState(hero.cta_primary_text);
  const [ctaPrimaryUrl, setCtaPrimaryUrl] = useState(hero.cta_primary_url);
  const [ctaSecondaryText, setCtaSecondaryText] = useState(hero.cta_secondary_text);
  const [ctaSecondaryUrl, setCtaSecondaryUrl] = useState(hero.cta_secondary_url);

  const updateSlide = (index: number, field: keyof HeroSlide, value: string) => {
    setSlides((prev) => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const addSlide = () => {
    if (slides.length >= 5) return;
    setSlides((prev) => [...prev, { subtitle: '', title: '', description: '', background_image: '' }]);
  };

  const removeSlide = (index: number) => {
    if (slides.length <= 1) return;
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── Section Titles State ───
  const [stServices, setStServices] = useState(sectionTitles.services);
  const [stProducts, setStProducts] = useState(sectionTitles.products);
  const [stNews, setStNews] = useState(sectionTitles.news);
  const [stSupport, setStSupport] = useState(sectionTitles.support);

  // ─── About Preview State ───
  const [apTitle, setApTitle] = useState(aboutPreview.title);
  const [apDescription, setApDescription] = useState(aboutPreview.description);
  const [apImageUrl, setApImageUrl] = useState(aboutPreview.image_url);
  const [apCtaText, setApCtaText] = useState(aboutPreview.cta_text);
  const [apCtaUrl, setApCtaUrl] = useState(aboutPreview.cta_url);

  // ─── About Stats State ───
  const [stats, setStats] = useState<AboutStat[]>(initialStats);

  const updateStat = (index: number, field: keyof AboutStat, value: string) => {
    setStats((prev) => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const addStat = () => {
    setStats((prev) => [...prev, { label: '', value: '', icon: '' }]);
  };

  const removeStat = (index: number) => {
    setStats((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── Contact CTA State ───
  const [ctaTitle, setCtaTitle] = useState(initialContactCTA.title);
  const [ctaSubtitle, setCtaSubtitle] = useState(initialContactCTA.subtitle);
  const [ctaCtaText, setCtaCtaText] = useState(initialContactCTA.cta_text);
  const [ctaPhoneText, setCtaPhoneText] = useState(initialContactCTA.phone_text);

  // ─── Footer State ───
  const [ftTagline, setFtTagline] = useState(footerContent.tagline);
  const [ftCopyright, setFtCopyright] = useState(footerContent.copyright);
  const [ftQuickLinks, setFtQuickLinks] = useState<FooterLink[]>(footerContent.quick_links);

  const updateQuickLink = (index: number, field: keyof FooterLink, value: string) => {
    setFtQuickLinks((prev) => prev.map((l, i) => i === index ? { ...l, [field]: value } : l));
  };

  const addQuickLink = () => {
    setFtQuickLinks((prev) => [...prev, { label: '', url: '' }]);
  };

  const removeQuickLink = (index: number) => {
    setFtQuickLinks((prev) => prev.filter((_, i) => i !== index));
  };

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
      slides,
      cta_primary_text: ctaPrimaryText,
      cta_primary_url: ctaPrimaryUrl,
      cta_secondary_text: ctaSecondaryText,
      cta_secondary_url: ctaSecondaryUrl,
      background_images: slides.map((s) => s.background_image).filter(Boolean),
    }, 'Hero bölməsi yeniləndi');

  const handleSaveSectionTitles = () =>
    saveSetting('section_titles', {
      services: stServices,
      products: stProducts,
      news: stNews,
      support: stSupport,
    }, 'Bölmə başlıqları yeniləndi');

  const handleSaveAboutPreview = () =>
    saveSetting('about_preview', {
      title: apTitle,
      description: apDescription,
      image_url: apImageUrl,
      cta_text: apCtaText,
      cta_url: apCtaUrl,
    }, 'Haqqımızda bölməsi yeniləndi');

  const handleSaveAboutStats = () =>
    saveSetting('about_stats', stats.filter((s) => s.value.trim() || s.label.trim()), 'Statistikalar yeniləndi');

  const handleSaveContactCTA = () =>
    saveSetting('homepage_contact_cta', {
      title: ctaTitle,
      subtitle: ctaSubtitle,
      cta_text: ctaCtaText,
      phone_text: ctaPhoneText,
    }, 'Əlaqə bölməsi yeniləndi');

  const handleSaveFooter = () =>
    saveSetting('footer', {
      tagline: ftTagline,
      copyright: ftCopyright,
      quick_links: ftQuickLinks.filter((l) => l.label.trim() || l.url.trim()),
    }, 'Footer yeniləndi');

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
          1. HERO SECTION (Slides)
          ══════════════════════════════════════════════ */}
      <SectionCard title="Hero Bölməsi">
        {slides.map((slide, i) => (
          <div key={i} className="border border-slate-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-secondary">Slayd {i + 1}</span>
              {slides.length > 1 && (
                <SmallButton onClick={() => removeSlide(i)} label="Sil" variant="danger" />
              )}
            </div>
            <FormField label="Alt yazı" name={`slide_subtitle_${i}`} value={slide.subtitle} onChange={(v) => updateSlide(i, 'subtitle', v)} />
            <FormField label="Başlıq" name={`slide_title_${i}`} value={slide.title} onChange={(v) => updateSlide(i, 'title', v)} required />
            <FormField label="Təsvir" name={`slide_desc_${i}`} type="textarea" rows={2} value={slide.description} onChange={(v) => updateSlide(i, 'description', v)} />
            <ImageUpload
              bucket="site"
              value={slide.background_image}
              onChange={(url) => updateSlide(i, 'background_image', url)}
              label="Arxa plan şəkili"
            />
          </div>
        ))}

        {slides.length < 5 && (
          <SmallButton onClick={addSlide} label="+ Slayd əlavə et" />
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Əsas CTA mətni" name="cta_primary_text" value={ctaPrimaryText} onChange={setCtaPrimaryText} />
          <FormField label="Əsas CTA linki" name="cta_primary_url" value={ctaPrimaryUrl} onChange={setCtaPrimaryUrl} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="İkinci CTA mətni" name="cta_secondary_text" value={ctaSecondaryText} onChange={setCtaSecondaryText} />
          <FormField label="İkinci CTA linki" name="cta_secondary_url" value={ctaSecondaryUrl} onChange={setCtaSecondaryUrl} />
        </div>
        <SaveButton onClick={handleSaveHero} label="Hero-nu yadda saxla" loading={loading} />
      </SectionCard>

      {/* ══════════════════════════════════════════════
          2. SECTION TITLES
          ══════════════════════════════════════════════ */}
      <SectionCard title="Bölmə Başlıqları">
        <FormField label="Xidmətlər bölməsi" name="st_services" value={stServices} onChange={setStServices} />
        <FormField label="Məhsullar bölməsi" name="st_products" value={stProducts} onChange={setStProducts} />
        <FormField label="Xəbərlər bölməsi" name="st_news" value={stNews} onChange={setStNews} />
        <FormField label="Dəstək bölməsi" name="st_support" value={stSupport} onChange={setStSupport} />
        <SaveButton onClick={handleSaveSectionTitles} label="Başlıqları yadda saxla" loading={loading} />
      </SectionCard>

      {/* ══════════════════════════════════════════════
          3. ABOUT PREVIEW
          ══════════════════════════════════════════════ */}
      <SectionCard title="Haqqımızda Bölməsi">
        <FormField label="Başlıq" name="ap_title" value={apTitle} onChange={setApTitle} required />
        <FormField label="Təsvir" name="ap_description" type="textarea" rows={3} value={apDescription} onChange={setApDescription} />
        <ImageUpload bucket="site" value={apImageUrl} onChange={setApImageUrl} label="Bölmə şəkili" />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="CTA mətni" name="ap_cta_text" value={apCtaText} onChange={setApCtaText} />
          <FormField label="CTA linki" name="ap_cta_url" value={apCtaUrl} onChange={setApCtaUrl} />
        </div>
        <SaveButton onClick={handleSaveAboutPreview} label="Yadda saxla" loading={loading} />
      </SectionCard>

      {/* ══════════════════════════════════════════════
          4. ABOUT STATS
          ══════════════════════════════════════════════ */}
      <SectionCard title="Statistikalar">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-end gap-3">
            <div className="flex-1">
              <FormField label="Dəyər" name={`stat_value_${i}`} value={stat.value} onChange={(v) => updateStat(i, 'value', v)} />
            </div>
            <div className="flex-1">
              <FormField label="Etiket" name={`stat_label_${i}`} value={stat.label} onChange={(v) => updateStat(i, 'label', v)} />
            </div>
            <div className="w-28">
              <FormField
                label="Simvol"
                name={`stat_icon_${i}`}
                type="select"
                value={stat.icon || ''}
                onChange={(v) => updateStat(i, 'icon', v)}
                options={[
                  { value: '', label: 'Seçin' },
                  { value: 'users', label: 'Users' },
                  { value: 'target', label: 'Target' },
                  { value: 'globe', label: 'Globe' },
                  { value: 'award', label: 'Award' },
                ]}
              />
            </div>
            <SmallButton onClick={() => removeStat(i)} label="Sil" variant="danger" />
          </div>
        ))}
        <SmallButton onClick={addStat} label="+ Statistika əlavə et" />
        <SaveButton onClick={handleSaveAboutStats} label="Statistikaları yadda saxla" loading={loading} />
      </SectionCard>

      {/* ══════════════════════════════════════════════
          5. CONTACT CTA
          ══════════════════════════════════════════════ */}
      <SectionCard title="Əlaqə Bölməsi">
        <FormField label="Başlıq" name="cta_title" value={ctaTitle} onChange={setCtaTitle} />
        <FormField label="Alt yazı" name="cta_subtitle" type="textarea" rows={2} value={ctaSubtitle} onChange={setCtaSubtitle} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Düymə mətni" name="cta_cta_text" value={ctaCtaText} onChange={setCtaCtaText} />
          <FormField label="Telefon düyməsi mətni" name="cta_phone_text" value={ctaPhoneText} onChange={setCtaPhoneText} />
        </div>
        <SaveButton onClick={handleSaveContactCTA} label="Əlaqə bölməsini yadda saxla" loading={loading} />
      </SectionCard>

      {/* ══════════════════════════════════════════════
          6. FOOTER
          ══════════════════════════════════════════════ */}
      <SectionCard title="Footer">
        <FormField label="Teqlayn" name="ft_tagline" value={ftTagline} onChange={setFtTagline} />
        <FormField label="Müəllif hüququ mətni" name="ft_copyright" value={ftCopyright} onChange={setFtCopyright} />

        <div>
          <p className="text-sm font-medium text-text-primary tracking-tight mb-3">
            Sürətli keçidlər
          </p>
          {ftQuickLinks.map((link, i) => (
            <div key={i} className="flex items-end gap-3 mb-2">
              <div className="flex-1">
                <FormField label="Ad" name={`ql_label_${i}`} value={link.label} onChange={(v) => updateQuickLink(i, 'label', v)} />
              </div>
              <div className="flex-1">
                <FormField label="Link" name={`ql_url_${i}`} value={link.url} onChange={(v) => updateQuickLink(i, 'url', v)} />
              </div>
              <SmallButton onClick={() => removeQuickLink(i)} label="Sil" variant="danger" />
            </div>
          ))}
          <SmallButton onClick={addQuickLink} label="+ Keçid əlavə et" />
        </div>

        <SaveButton onClick={handleSaveFooter} label="Footer-i yadda saxla" loading={loading} />
      </SectionCard>
    </div>
  );
}
