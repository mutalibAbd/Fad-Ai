import { GlassHeader, HeroSection, SoftCard } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import { getHeroContent, getHomepageServices } from '@/lib/queries/site-settings';

export const revalidate = 60;

export default async function HomePage() {
  const [hero, services] = await Promise.all([
    getHeroContent(),
    getHomepageServices(),
  ]);

  return (
    <>
      <GlassHeader />

      <HeroSection
        headline={hero.headline}
        subheadline={hero.subheadline}
      />

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
                      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                      </svg>
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
                      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
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
                      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
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

      <Footer />
    </>
  );
}
