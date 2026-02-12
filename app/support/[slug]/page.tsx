import { GlassHeader, SoftCard } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import { notFound } from 'next/navigation';
import { getSupportBySlug, getAllSupportSlugs } from '@/lib/queries/support';
import SupportContactForm from './SupportContactForm';

export const revalidate = 60;

interface SupportDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSupportSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: SupportDetailPageProps) {
  const { slug } = await params;
  const supportType = await getSupportBySlug(slug);

  if (!supportType) {
    return { title: 'Dəstək tapılmadı | FADAI' };
  }

  return {
    title: `${supportType.title} | Dəstək | FADAI`,
    description: supportType.description || 'FADAI dəstək xidməti',
  };
}

export default async function SupportDetailPage({ params }: SupportDetailPageProps) {
  const { slug } = await params;
  const supportType = await getSupportBySlug(slug);

  if (!supportType) {
    notFound();
  }

  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-background-light">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              Dəstək
            </p>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-text-primary mb-4">
              {supportType.title}
            </h1>
            {supportType.description && (
              <p className="text-xl text-text-secondary tracking-tight max-w-2xl mx-auto">
                {supportType.description}
              </p>
            )}
          </div>
        </section>

        {/* Content Section */}
        {supportType.content && (
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="prose prose-lg prose-slate max-w-none text-text-secondary tracking-tight leading-relaxed whitespace-pre-line">
                {supportType.content}
              </div>
            </div>
          </section>
        )}

        {/* Contact Form Section */}
        <section className="py-20 bg-background-light">
          <div className="max-w-2xl mx-auto px-6">
            <SoftCard className="p-8 lg:p-12" hover={false}>
              <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-2">
                Dəstək Sorğusu Göndərin
              </h2>
              <p className="text-text-secondary tracking-tight mb-8">
                Aşağıdakı formu doldurun, komandamız ən qısa zamanda sizə cavab verəcək.
              </p>
              <SupportContactForm />
            </SoftCard>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
