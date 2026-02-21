import GlassHeader from '@/components/ui/GlassHeader';
import HeroSection from '@/components/ui/HeroSection';
import ServicesSection from '@/components/ui/ServicesSection';
import ProductsCarousel from '@/components/ui/ProductsCarousel';
import AboutSection from '@/components/ui/AboutSection';
import NewsTimeline from '@/components/ui/NewsTimeline';
import SupportSection from '@/components/ui/SupportSection';
import Footer from '@/components/ui/Footer';
import { getHeroContent, getAboutPreviewContent, getSectionTitles } from '@/lib/queries/site-settings';
import { getServiceCategoriesWithServices } from '@/lib/queries/service-categories';
import { getVisibleProducts } from '@/lib/queries/products';
import { getVisibleNews } from '@/lib/queries/news';
import { getVisibleSupportTypes } from '@/lib/queries/support';

export const metadata = {
  title: 'FADAI | Tibbi Görüntüləmədə Süni İntellekt',
  description: 'Tibbi görüntüləmədə dəqiqliyin orkestrləşdirilməsi - innovativ süni intellekt texnologiyası',
};

export const revalidate = 60;

export default async function HomePage() {
  const [hero, categories, products, news, supportTypes, aboutPreview, sectionTitles] = await Promise.all([
    getHeroContent(),
    getServiceCategoriesWithServices(),
    getVisibleProducts(),
    getVisibleNews(),
    getVisibleSupportTypes(),
    getAboutPreviewContent(),
    getSectionTitles(),
  ]);

  return (
    <>
      <GlassHeader />
      <HeroSection
        headline={hero.headline}
        subheadline={hero.subheadline}
        ctaText={hero.cta_primary_text}
        ctaUrl={hero.cta_primary_url}
        backgroundImages={hero.background_images}
      />
      <ServicesSection categories={categories} title={sectionTitles.services} />
      <ProductsCarousel products={products} title={sectionTitles.products} />
      <AboutSection
        title={aboutPreview.title}
        ctaText={aboutPreview.cta_text}
        ctaUrl={aboutPreview.cta_url}
      />
      <NewsTimeline articles={news} title={sectionTitles.news} />
      <SupportSection supportTypes={supportTypes} title={sectionTitles.support} />
      <Footer />
    </>
  );
}
