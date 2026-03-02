import GlassHeader from '@/components/ui/GlassHeader';
import HeroSection from '@/components/ui/HeroSection';
import ServicesSection from '@/components/ui/ServicesSection';
import ProductsCarousel from '@/components/ui/ProductsCarousel';
import AboutSection from '@/components/ui/AboutSection';
import NewsSection from '@/components/ui/NewsSection';
import SupportSection from '@/components/ui/SupportSection';
import ContactCTASection from '@/components/ui/ContactCTASection';
import Footer from '@/components/ui/Footer';
import {
  getHeroContent,
  getAboutPreviewContent,
  getAboutStats,
  getSectionTitles,
  getContactCTAContent,
  getContactInfo,
} from '@/lib/queries/site-settings';
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
  const [hero, categories, products, news, supportTypes, aboutPreview, aboutStats, sectionTitles, contactCTA, contactInfo] = await Promise.all([
    getHeroContent(),
    getServiceCategoriesWithServices(),
    getVisibleProducts(),
    getVisibleNews(),
    getVisibleSupportTypes(),
    getAboutPreviewContent(),
    getAboutStats(),
    getSectionTitles(),
    getContactCTAContent(),
    getContactInfo(),
  ]);

  return (
    <>
      <GlassHeader />
      <HeroSection
        slides={hero.slides}
        ctaPrimaryText={hero.cta_primary_text}
        ctaPrimaryUrl={hero.cta_primary_url}
        ctaSecondaryText={hero.cta_secondary_text}
        ctaSecondaryUrl={hero.cta_secondary_url}
      />
      <ServicesSection categories={categories} title={sectionTitles.services} />
      <ProductsCarousel products={products} title={sectionTitles.products} />
      <AboutSection
        title={aboutPreview.title}
        description={aboutPreview.description}
        imageUrl={aboutPreview.image_url}
        ctaText={aboutPreview.cta_text}
        ctaUrl={aboutPreview.cta_url}
        stats={aboutStats}
      />
      <NewsSection articles={news} title={sectionTitles.news} />
      <SupportSection supportTypes={supportTypes} title={sectionTitles.support} />
      <ContactCTASection
        title={contactCTA.title}
        subtitle={contactCTA.subtitle}
        ctaText={contactCTA.cta_text}
        phoneText={contactCTA.phone_text}
        phone={contactInfo.phone}
      />
      <Footer />
    </>
  );
}
