import {
  getHeroContent,
  getAboutPreviewContent,
  getSectionTitles,
  getFooterContent,
} from '@/lib/queries/site-settings';
import HomepageEditorClient from './HomepageEditorClient';

export const metadata = {
  title: 'Ana Səhifə | Admin | FADAI',
};

export const dynamic = 'force-dynamic';

export default async function AdminHomepagePage() {
  const [hero, aboutPreview, sectionTitles, footerContent] = await Promise.all([
    getHeroContent(),
    getAboutPreviewContent(),
    getSectionTitles(),
    getFooterContent(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
        Ana Səhifə Redaktəsi
      </h1>
      <HomepageEditorClient
        hero={hero}
        aboutPreview={aboutPreview}
        sectionTitles={sectionTitles}
        footerContent={footerContent}
      />
    </div>
  );
}
