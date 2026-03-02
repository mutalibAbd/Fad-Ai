import Image from 'next/image';
import Link from 'next/link';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  image_url: string | null;
  published_at: string;
}

interface NewsSectionProps {
  articles: NewsItem[];
  title?: string;
}

export default function NewsSection({ articles, title = 'Son Xəbərlər' }: NewsSectionProps) {
  if (articles.length === 0) return null;

  const displayArticles = articles.slice(0, 3);

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">
          {title}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-12">
          FADAI-dən ən son yeniliklər və hadisələr
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayArticles.map((article) => (
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
                {article.summary && (
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                    {article.summary}
                  </p>
                )}
                <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                  Oxu →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            Bütün xəbərlər
          </Link>
        </div>
      </div>
    </section>
  );
}
