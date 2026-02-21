'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';
import type {
  HeroContent,
  AboutPreviewContent,
  SectionTitles,
  FooterContent,
} from '@/lib/types';

// ─── UI Helpers (module-level to avoid re-mount on every render) ───

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

// ─── Main Component ───

interface Props {
  hero: HeroContent;
  aboutPreview: AboutPreviewContent;
  sectionTitles: SectionTitles;
  footerContent: FooterContent;
}

export default function HomepageEditorClient({
  hero,
  aboutPreview,
  sectionTitles,
  footerContent,
}: Props) {
  const router = useRouter();

  // ─── Hero State ───
  const [headline, setHeadline] = useState(hero.headline);
  const [subheadline, setSubheadline] = useState(hero.subheadline);
  const [ctaPrimaryText, setCtaPrimaryText] = useState(hero.cta_primary_text);
  const [ctaPrimaryUrl, setCtaPrimaryUrl] = useState(hero.cta_primary_url);

  // Pad to 3 slots
  const initialImages = [...hero.background_images];
  while (initialImages.length < 3) initialImages.push('');
  const [heroImages, setHeroImages] = useState<string[]>(initialImages);

  const updateHeroImage = (index: number, url: string) => {
    setHeroImages((prev) => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
  };

  // ─── Section Titles State ───
  const [stServices, setStServices] = useState(sectionTitles.services);
  const [stProducts, setStProducts] = useState(sectionTitles.products);
  const [stNews, setStNews] = useState(sectionTitles.news);
  const [stSupport, setStSupport] = useState(sectionTitles.support);

  // ─── About Preview State ───
  const [apTitle, setApTitle] = useState(aboutPreview.title);
  const [apCtaText, setApCtaText] = useState(aboutPreview.cta_text);
  const [apCtaUrl, setApCtaUrl] = useState(aboutPreview.cta_url);

  // ─── Footer State ───
  const [ftTagline, setFtTagline] = useState(footerContent.tagline);
  const [ftCopyright, setFtCopyright] = useState(footerContent.copyright);

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
      cta_secondary_text: hero.cta_secondary_text,
      cta_secondary_url: hero.cta_secondary_url,
      background_images: heroImages.filter((url) => url.trim() !== ''),
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
      description: aboutPreview.description,
      image_url: aboutPreview.image_url,
      cta_text: apCtaText,
      cta_url: apCtaUrl,
    }, 'Haqqımızda bölməsi yeniləndi');

  const handleSaveFooter = () =>
    saveSetting('footer', {
      tagline: ftTagline,
      copyright: ftCopyright,
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
          1. HERO SECTION
          ══════════════════════════════════════════════ */}
      <SectionCard title="Hero Bölməsi">
        <FormField label="Başlıq" name="headline" value={headline} onChange={setHeadline} required />
        <FormField label="Alt başlıq" name="subheadline" type="textarea" value={subheadline} onChange={setSubheadline} rows={3} />

        <div>
          <p className="text-sm font-medium text-text-primary tracking-tight mb-3">
            Arxa plan şəkilləri (boş saxlasanız gradient göstəriləcək)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <ImageUpload
                key={i}
                bucket="site"
                value={heroImages[i] || ''}
                onChange={(url) => updateHeroImage(i, url)}
                label={`Şəkil ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="CTA mətni" name="cta_primary_text" value={ctaPrimaryText} onChange={setCtaPrimaryText} />
          <FormField label="CTA linki" name="cta_primary_url" value={ctaPrimaryUrl} onChange={setCtaPrimaryUrl} />
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
        <div className="grid grid-cols-2 gap-4">
          <FormField label="CTA mətni" name="ap_cta_text" value={apCtaText} onChange={setApCtaText} />
          <FormField label="CTA linki" name="ap_cta_url" value={apCtaUrl} onChange={setApCtaUrl} />
        </div>
        <SaveButton onClick={handleSaveAboutPreview} label="Yadda saxla" loading={loading} />
      </SectionCard>

      {/* ══════════════════════════════════════════════
          4. FOOTER
          ══════════════════════════════════════════════ */}
      <SectionCard title="Footer">
        <FormField label="Teqlayn" name="ft_tagline" value={ftTagline} onChange={setFtTagline} />
        <FormField label="Müəllif hüququ mətni" name="ft_copyright" value={ftCopyright} onChange={setFtCopyright} />
        <SaveButton onClick={handleSaveFooter} label="Footer-i yadda saxla" loading={loading} />
      </SectionCard>
    </div>
  );
}
