'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';
import type { HeroContent, HomepageService } from '@/lib/types';

interface Props {
  hero: HeroContent;
  services: HomepageService[];
}

export default function HomepageEditorClient({ hero, services }: Props) {
  const router = useRouter();

  const [headline, setHeadline] = useState(hero.headline);
  const [subheadline, setSubheadline] = useState(hero.subheadline);
  const [ctaPrimaryText, setCtaPrimaryText] = useState(hero.cta_primary_text);
  const [ctaPrimaryUrl, setCtaPrimaryUrl] = useState(hero.cta_primary_url);
  const [ctaSecondaryText, setCtaSecondaryText] = useState(hero.cta_secondary_text);
  const [ctaSecondaryUrl, setCtaSecondaryUrl] = useState(hero.cta_secondary_url);

  const [serviceList, setServiceList] = useState<HomepageService[]>(
    services.length > 0
      ? services
      : [{ icon: '', title: '', description: '' }]
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSaveHero = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { updateSiteSetting } = await import('@/lib/actions/settings');
      const result = await updateSiteSetting('hero', {
        headline,
        subheadline,
        cta_primary_text: ctaPrimaryText,
        cta_primary_url: ctaPrimaryUrl,
        cta_secondary_text: ctaSecondaryText,
        cta_secondary_url: ctaSecondaryUrl,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Hero bölməsi yeniləndi');
        router.refresh();
      }
    } catch {
      setError('Xəta baş verdi');
    }

    setLoading(false);
  };

  const handleSaveServices = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { updateSiteSetting } = await import('@/lib/actions/settings');
      const filtered = serviceList.filter((s) => s.title.trim() !== '');
      const result = await updateSiteSetting('homepage_services', JSON.parse(JSON.stringify(filtered)));

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Xidmət kartları yeniləndi');
        router.refresh();
      }
    } catch {
      setError('Xəta baş verdi');
    }

    setLoading(false);
  };

  const updateService = (index: number, field: keyof HomepageService, value: string) => {
    setServiceList((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const addService = () => {
    setServiceList((prev) => [...prev, { icon: '', title: '', description: '' }]);
  };

  const removeService = (index: number) => {
    setServiceList((prev) => prev.filter((_, i) => i !== index));
  };

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

      {/* Hero Section */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold tracking-tight text-text-primary mb-5">
          Hero Bölməsi
        </h2>
        <div className="space-y-4">
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

          <button
            type="button"
            onClick={handleSaveHero}
            disabled={loading}
            className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium tracking-tight hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saxlanılır...' : 'Hero-nu yadda saxla'}
          </button>
        </div>
      </section>

      {/* Homepage Service Cards */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold tracking-tight text-text-primary mb-5">
          Xidmət Kartları
        </h2>
        <div className="space-y-5">
          {serviceList.map((service, index) => (
            <div key={index} className="bg-slate-50/50 rounded-xl border border-slate-100 p-4 relative">
              <button
                type="button"
                onClick={() => removeService(index)}
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
            onClick={addService}
            className="text-sm font-medium tracking-tight text-primary hover:text-primary-600 transition-colors"
          >
            + Yeni xidmət kartı əlavə et
          </button>

          <div>
            <button
              type="button"
              onClick={handleSaveServices}
              disabled={loading}
              className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium tracking-tight hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saxlanılır...' : 'Xidmət kartlarını yadda saxla'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
