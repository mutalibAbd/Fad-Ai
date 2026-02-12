import { GlassHeader } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServiceBySlug, getAllServiceSlugs } from '@/lib/queries/services';

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

  const details = Array.isArray(service.details) ? service.details as string[] : [];

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

        {/* Content */}
        {service.content && (
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="text-lg text-text-secondary tracking-tight leading-relaxed whitespace-pre-line">
                {service.content}
              </div>
            </div>
          </section>
        )}

        {/* Details List */}
        {details.length > 0 && (
          <section className="py-16 bg-background-light">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
                Təfərrüatlar
              </h2>
              <ul className="space-y-4">
                {details.map((detail, i) => (
                  <li key={i} className="flex items-start text-text-secondary tracking-tight">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 mr-4 flex-shrink-0" />
                    <span className="text-lg leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

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
              <Link
                href="/services"
                className="bg-slate-50 text-text-primary px-8 py-4 rounded-xl font-medium tracking-tight border border-slate-200 hover:bg-slate-100 transition-colors duration-200"
              >
                Bütün Xidmətlər
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
