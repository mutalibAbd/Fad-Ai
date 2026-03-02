import {
  getHeroContent,
  getAboutPreviewContent,
  getAboutStats,
  getSectionTitles,
  getFooterContent,
  getContactCTAContent,
} from '@/lib/queries/site-settings';
import HomepageEditorClient from './HomepageEditorClient';

export const metadata = {
  title: 'Ana Səhifə | Admin | FADAI',
};

export const dynamic = 'force-dynamic';

export default async function AdminHomepagePage() {
  const [hero, aboutPreview, aboutStats, sectionTitles, footerContent, contactCTA] = await Promise.all([
    getHeroContent(),
    getAboutPreviewContent(),
    getAboutStats(),
    getSectionTitles(),
    getFooterContent(),
    getContactCTAContent(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
        Ana Səhifə Redaktəsi
      </h1>
      <HomepageEditorClient
        hero={hero}
        aboutPreview={aboutPreview}
        aboutStats={aboutStats}
        sectionTitles={sectionTitles}
        footerContent={footerContent}
        contactCTA={contactCTA}
      />
    </div>
  );
}
