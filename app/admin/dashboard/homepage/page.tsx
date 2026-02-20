import { createAdminClient } from '@/lib/supabase/server';
import {
  getHeroContent,
  getHomepageServices,
  getSocialProofContent,
  getAboutPreviewContent,
  getFeaturesGridContent,
  getStatsContent,
  getCTAContent,
} from '@/lib/queries/site-settings';
import HomepageEditorClient from './HomepageEditorClient';

export const metadata = {
  title: 'Ana Səhifə | Admin | FADAI',
};

export default async function AdminHomepagePage() {
  const [hero, services, socialProof, aboutPreview, featuresGrid, stats, cta] = await Promise.all([
    getHeroContent(),
    getHomepageServices(),
    getSocialProofContent(),
    getAboutPreviewContent(),
    getFeaturesGridContent(),
    getStatsContent(),
    getCTAContent(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
        Ana Səhifə Redaktəsi
      </h1>
      <HomepageEditorClient
        hero={hero}
        services={services}
        socialProof={socialProof}
        aboutPreview={aboutPreview}
        featuresGrid={featuresGrid}
        stats={stats}
        cta={cta}
      />
    </div>
  );
}
