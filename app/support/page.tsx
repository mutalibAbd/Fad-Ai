import { GlassHeader, SoftCard } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { getVisibleSupportTypes } from '@/lib/queries/support';

export const metadata = {
  title: 'Dəstək | FADAI',
  description: 'FADAI dəstək xidmətləri - texniki yardım, təlim və məsləhət',
};

export const revalidate = 60;

export default async function SupportPage() {
  const supportTypes = await getVisibleSupportTypes();

  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-background-light">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              Yardım Mərkəzi
            </p>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-text-primary mb-4">
              Dəstək
            </h1>
            <p className="text-xl text-text-secondary tracking-tight max-w-xl mx-auto">
              Texniki yardım, təlim və məsləhət xidmətlərimiz ilə yanınızdayıq
            </p>
          </div>
        </section>

        {/* Support Types Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="space-y-10">
              {supportTypes.map((supportType, index) => (
                <Link key={supportType.id} href={`/support/${supportType.slug}`}>
                  <SoftCard className="p-0 overflow-hidden cursor-pointer">
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 items-center ${index % 2 === 1 ? 'lg:direction-rtl' : ''}`}>
                      {/* Text Content - LEFT side */}
                      <div className="p-8 lg:p-12">
                        <h3 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
                          {supportType.title}
                        </h3>
                        {supportType.description && (
                          <p className="text-text-secondary tracking-tight leading-relaxed mb-6">
                            {supportType.description}
                          </p>
                        )}
                        <span className="inline-flex items-center text-primary font-medium tracking-tight text-sm group">
                          Ətraflı oxu
                          <svg
                            className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>

                      {/* Image - RIGHT side */}
                      <div className="relative aspect-video lg:aspect-auto lg:h-full min-h-[240px] bg-gradient-to-br from-primary/10 to-primary/5">
                        {supportType.image_url ? (
                          <Image
                            src={supportType.image_url}
                            alt={supportType.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                              <svg
                                className="w-10 h-10 text-primary/40"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.5}
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </SoftCard>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background-light">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-6">
              Axtardığınız cavabı tapa bilmirsiniz?
            </h2>
            <p className="text-lg text-text-secondary tracking-tight mb-8">
              Komandamız sizə kömək etməyə hazırdır. Bizimlə əlaqə saxlayın.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-primary text-white px-8 py-4 rounded-xl font-medium tracking-tight hover:bg-primary-600 transition-colors duration-200"
            >
              Bizimlə Əlaqə
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
