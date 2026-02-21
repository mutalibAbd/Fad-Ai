import { GlassHeader } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServiceBySlug, getAllServiceSlugs } from '@/lib/queries/services';
import Markdown from 'react-markdown';
import { parseSections } from '@/lib/utils/content-sections';

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
  const sections = parseSections(service.content);
  const hasSections = sections.length > 0;

  function sectionId(heading: string, idx: number) {
    const s = heading
      .toLowerCase()
      .replace(/[^a-z0-9əüöğışçı\s]+/gi, '')
      .replace(/\s+/g, '-')
      .replace(/(^-|-$)/g, '');
    return s || `section-${idx}`;
  }

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

        {/* Two-Column Content: Sticky ToC + Markdown Sections */}
        {hasSections && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                {/* Sticky Table of Contents */}
                <nav className="lg:w-56 flex-shrink-0">
                  <div className="lg:sticky lg:top-24 space-y-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                      Mündəricat
                    </h3>
                    {sections.map((s, i) => (
                      <a
                        key={i}
                        href={`#${sectionId(s.heading, i)}`}
                        className="block text-sm text-text-secondary hover:text-primary tracking-tight py-1.5 border-l-2 border-transparent hover:border-primary pl-3 transition-colors duration-200"
                      >
                        {s.heading}
                      </a>
                    ))}
                  </div>
                </nav>

                {/* Content Sections */}
                <div className="flex-1 min-w-0 space-y-14">
                  {sections.map((s, i) => (
                    <div key={i} id={sectionId(s.heading, i)}>
                      <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-6">
                        {s.heading}
                      </h2>
                      <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:tracking-tight prose-p:tracking-tight prose-p:leading-relaxed prose-p:text-text-secondary prose-headings:text-text-primary prose-strong:text-text-primary prose-li:text-text-secondary">
                        <Markdown>{s.body}</Markdown>
                      </div>
                    </div>
                  ))}
                </div>
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
              
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
