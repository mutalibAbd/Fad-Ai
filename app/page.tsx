import {
  GlassHeader,
  HeroSection,
  SoftCard,
  SocialProofSection,
  AboutPreviewSection,
  FeaturesGridSection,
  CTASection,
} from '@/components/ui';
import Footer from '@/components/ui/Footer';
import { SearchPlusIcon, ShieldIcon, TeamIcon } from '@/components/icons';
import {
  getHeroContent,
  getHomepageServices,
  getSocialProofContent,
  getAboutPreviewContent,
  getFeaturesGridContent,
  getStatsContent,
  getCTAContent,
} from '@/lib/queries/site-settings';

export const metadata = {
  title: 'FADAI | Tibbi Görüntüləmədə Süni İntellekt',
  description: 'Tibbi görüntüləmədə dəqiqliyin orkestrləşdirilməsi - innovativ süni intellekt texnologiyası',
};

export const revalidate = 60;

export default async function HomePage() {
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
    <>
      <GlassHeader />

      <HeroSection
        headline={hero.headline}
        subheadline={hero.subheadline}
      />

      {/* Social Proof: Trust Logos + Stats */}
      <SocialProofSection content={socialProof} stats={stats.stats} />

      {/* Services Preview Section */}
      <section className="py-20 bg-background-light">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-semibold tracking-tight text-text-primary text-center mb-16">
            Xidmətlərimiz
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.length > 0 ? (
              services.map((service, index) => (
                <SoftCard key={index} className="p-8">
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <span className="text-2xl">{service.icon}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-text-primary mb-3">
                    {service.title}
                  </h3>
                  <p className="text-text-secondary tracking-tight leading-relaxed">
                    {service.description}
                  </p>
                </SoftCard>
              ))
            ) : (
              <>
                <SoftCard className="p-8">
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <SearchPlusIcon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-text-primary mb-3">
                    Tibbi Görüntüləmə
                  </h3>
                  <p className="text-text-secondary tracking-tight leading-relaxed">
                    Dəqiq diaqnostika və analiz üçün süni intellekt əsaslı tibbi görüntüləmə həlləri.
                  </p>
                </SoftCard>
                <SoftCard className="p-8">
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <ShieldIcon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-text-primary mb-3">
                    Protokol Standartları
                  </h3>
                  <p className="text-text-secondary tracking-tight leading-relaxed">
                    Tibbi görüntüləmə iş prosesləri üçün qabaqcıl protokollar və standartlar.
                  </p>
                </SoftCard>
                <SoftCard className="p-8">
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <TeamIcon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-text-primary mb-3">
                    Ekspert Dəstək
                  </h3>
                  <p className="text-text-secondary tracking-tight leading-relaxed">
                    Fasiləsiz inteqrasiya və əməliyyat üçün 24/7 texniki dəstək və təlim.
                  </p>
                </SoftCard>
              </>
            )}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <AboutPreviewSection content={aboutPreview} />

      {/* Key Features / Offers Grid */}
      <FeaturesGridSection content={featuresGrid} />

      {/* CTA / Lead Magnet Section */}
      <CTASection content={cta} />

      <Footer />
    </>
  );
}
