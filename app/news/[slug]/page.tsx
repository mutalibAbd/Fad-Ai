import { GlassHeader } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNewsBySlug, getAllNewsSlugs } from '@/lib/queries/news';

export const revalidate = 60;

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return { title: 'Xəbər tapılmadı | FADAI' };
  }

  return {
    title: `${news.title} | FADAI`,
    description: news.summary || 'FADAI xəbərləri',
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  const publishedDate = new Date(news.published_at).toLocaleDateString('az-AZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-background-light">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <time className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">
              {publishedDate}
            </time>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-text-primary mb-6">
              {news.title}
            </h1>
            {news.summary && (
              <p className="text-xl text-text-secondary tracking-tight max-w-2xl mx-auto">
                {news.summary}
              </p>
            )}
          </div>
        </section>

        {/* Featured Image */}
        {news.image_url && (
          <section className="pb-8">
            <div className="max-w-5xl mx-auto px-6">
              <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative aspect-video">
                <Image
                  src={news.image_url}
                  alt={news.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </div>
            </div>
          </section>
        )}

        {/* Content */}
        {news.content && (
          <section className="py-16">
            <div className="max-w-3xl mx-auto px-6">
              <div className="text-lg text-text-secondary tracking-tight leading-relaxed whitespace-pre-line">
                {news.content}
              </div>
            </div>
          </section>
        )}

        {/* Back to News */}
        <section className="pb-16">
          <div className="max-w-3xl mx-auto px-6">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-primary font-medium tracking-tight hover:underline transition-colors duration-200"
            >
              &larr; Bütün Xəbərlər
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background-light">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-6">
              Əlavə məlumat almaq istəyirsiniz?
            </h2>
            <p className="text-lg text-text-secondary tracking-tight mb-8">
              Tibbi texnologiya həllərimiz haqqında ətraflı məlumat üçün bizimlə əlaqə saxlayın
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="bg-primary text-white px-8 py-4 rounded-xl font-medium tracking-tight hover:bg-primary-600 transition-colors duration-200"
              >
                Əlaqə Saxlayın
              </Link>
              <Link
                href="/news"
                className="bg-slate-50 text-text-primary px-8 py-4 rounded-xl font-medium tracking-tight border border-slate-200 hover:bg-slate-100 transition-colors duration-200"
              >
                Bütün Xəbərlər
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
