import { GlassHeader } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNewsBySlug, getAllNewsSlugs, getRelatedNews } from '@/lib/queries/news';
import { getVisiblePageBlocks } from '@/lib/queries/page-blocks';
import { BlockRenderer } from '@/components/sections/page-blocks';

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

  const [blocks, relatedNews] = await Promise.all([
    getVisiblePageBlocks(`news/${slug}`),
    getRelatedNews(slug, 3),
  ]);

  const pageUrl = `https://fadai.az/news/${slug}`;
  const shareText = encodeURIComponent(news.title);
  const shareUrl = encodeURIComponent(pageUrl);

  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background">
        {/* Hero Image Section */}
        <section className="relative h-[500px] w-full">
          {news.image_url ? (
            <Image
              src={news.image_url}
              alt={news.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </section>

        {/* Article Card (overlapping hero) */}
        <div className="max-w-4xl mx-auto px-6">
          <article className="-mt-32 relative z-10 rounded-2xl shadow-2xl p-8 md:p-12 bg-white dark:bg-slate-900">
            {/* Back Link */}
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors duration-200 mb-6"
            >
              &larr; Xəbərlərə qayıt
            </Link>

            {/* Date */}
            <time className="block text-sm font-medium text-primary mb-4">
              {publishedDate}
            </time>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
              {news.title}
            </h1>

            {/* Body Content */}
            {news.content && (
              <div className="text-lg leading-[1.8] text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {news.content}
              </div>
            )}

            {/* Share Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Paylaş:
                </span>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-colors duration-200"
                  aria-label="Facebook-da paylaş"
                >
                  F
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-colors duration-200"
                  aria-label="X-də paylaş"
                >
                  X
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm font-medium transition-colors duration-200"
                  aria-label="LinkedIn-də paylaş"
                >
                  in
                </a>
              </div>
            </div>
          </article>
        </div>

        {/* Related News Section */}
        {relatedNews.length > 0 && (
          <section className="py-20 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
                Oxşar Xəbərlər
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedNews.map((article) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      {article.image_url ? (
                        <Image
                          src={article.image_url}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <time className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {new Date(article.published_at).toLocaleDateString('az-AZ', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h3>
                      <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                        Oxu →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Dynamic Page Blocks */}
        {blocks.map((block, index) => (
          <BlockRenderer key={block.id} block={block} index={index} />
        ))}

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
