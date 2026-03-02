import { GlassHeader } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServiceBySlug, getAllServiceSlugs } from '@/lib/queries/services';
import { getVisiblePageBlocks } from '@/lib/queries/page-blocks';
import { BlockRenderer } from '@/components/sections/page-blocks';
import { TrendingUp, Check } from 'lucide-react';

export const revalidate = 60;

interface ServiceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return { title: 'Xidmət tapılmadı | FADAI' };
  }

  return {
    title: `${service.title} | FADAI`,
    description: service.description || 'FADAI xidməti',
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // Parse details JSON — structured object or legacy string array
  let detailsData: {
    stats?: { value: string; label: string }[];
    features?: string[];
    advantages?: string[];
    details_list?: string[];
  } = {};
  let legacyDetails: string[] = [];

  if (service.details && typeof service.details === 'object' && !Array.isArray(service.details)) {
    detailsData = service.details as typeof detailsData;
  } else if (Array.isArray(service.details)) {
    legacyDetails = service.details as string[];
  }

  const blocks = await getVisiblePageBlocks(`services/${slug}`);

  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-background-light">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                {service.icon && (
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <span className="text-4xl">{service.icon}</span>
                  </div>
                )}
                <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-text-primary mb-6">
                  {service.title}
                </h1>
                {service.description && (
                  <p className="text-xl text-text-secondary tracking-tight leading-relaxed mb-8">
                    {service.description}
                  </p>
                )}
                <Link
                  href="/contact"
                  className="inline-block bg-primary text-white px-8 py-4 rounded-xl font-medium tracking-tight hover:bg-primary-600 transition-colors duration-200"
                >
                  Əlaqə saxlayın
                </Link>
              </div>

              {/* Service Image */}
              <div className="rounded-2xl bg-white shadow-card border border-slate-100 overflow-hidden aspect-video relative">
                {(service.detail_image_url || service.image_url) ? (
                  <Image
                    src={service.detail_image_url || service.image_url!}
                    alt={service.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <span className="text-8xl opacity-30">{service.icon}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        {detailsData.stats && detailsData.stats.length > 0 && (
          <section className="bg-blue-600 text-white py-6">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {detailsData.stats.map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm opacity-80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Content: 2-column layout */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-12">
                {/* About the service */}
                {service.content && (
                  <div>
                    <h2 className="text-3xl font-semibold tracking-tight text-text-primary mb-6">
                      Xidmət haqqında
                    </h2>
                    <p className="text-lg text-text-secondary leading-relaxed whitespace-pre-line">
                      {service.content}
                    </p>
                  </div>
                )}

                {/* Features checkmark grid */}
                {detailsData.features && detailsData.features.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-text-primary mb-6">
                      Xüsusiyyətlər
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {detailsData.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-text-secondary tracking-tight">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Advantages list */}
                {detailsData.advantages && detailsData.advantages.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-text-primary mb-6">
                      Üstünlüklər
                    </h3>
                    <div className="space-y-4">
                      {detailsData.advantages.map((advantage, i) => (
                        <div
                          key={i}
                          className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 flex items-start gap-4"
                        >
                          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <span className="text-text-secondary tracking-tight">{advantage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legacy details list (old string[] format) */}
                {legacyDetails.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
                      Təfərrüatlar
                    </h2>
                    <ul className="space-y-4">
                      {legacyDetails.map((detail, i) => (
                        <li key={i} className="flex items-start text-text-secondary tracking-tight">
                          <span className="w-2 h-2 rounded-full bg-primary mt-2 mr-4 flex-shrink-0" />
                          <span className="text-lg leading-relaxed">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column — Sticky Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                    <h3 className="text-xl font-semibold mb-3">Xidməti sınayın</h3>
                    <p className="text-sm text-white/80 mb-6 leading-relaxed">
                      {service.description || 'Bu xidmət haqqında ətraflı məlumat almaq və sınaqdan keçirmək üçün bizimlə əlaqə saxlayın.'}
                    </p>
                    <Link
                      href="/contact"
                      className="block w-full text-center bg-white text-gray-900 font-medium px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    >
                      Əlaqə saxlayın
                    </Link>

                    {/* Top 3 features in sidebar */}
                    {detailsData.features && detailsData.features.length > 0 && (
                      <ul className="mt-6 space-y-3">
                        {detailsData.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/90">
                            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Page Blocks */}
        {blocks.map((block, index) => (
          <BlockRenderer key={block.id} block={block} index={index} />
        ))}

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-6">
              Bu xidmət haqqında ətraflı məlumat almaq istəyirsiniz?
            </h2>
            <p className="text-lg text-text-secondary tracking-tight mb-8">
              Komandamız sizə kömək etməyə hazırdır
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="bg-primary text-white px-8 py-4 rounded-xl font-medium tracking-tight hover:bg-primary-600 transition-colors duration-200"
              >
                Əlaqə Saxlayın
              </Link>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
