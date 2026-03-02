import { GlassHeader } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { getVisibleNews } from '@/lib/queries/news';
import NewsGrid from './NewsGrid';

export const metadata = {
  title: 'Xəbərlər | FADAI',
  description: 'FADAI-nin ən son xəbərləri, yenilikləri və tibbi texnologiya sahəsindəki inkişaflar',
};

export const revalidate = 60;

export default async function NewsPage() {
  const news = await getVisibleNews();

  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#082f6b] via-[#0086a8] to-[#00d4d1]" />
          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-white mb-4">
              Xəbərlər
            </h1>
            <div className="w-10 h-0.5 bg-white mx-auto mb-6" />
            <p className="text-xl text-gray-100 tracking-tight max-w-xl mx-auto">
              Ən son yeniliklər, tibbi texnologiya trendləri və şirkət xəbərləri
            </p>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            {news.length > 0 ? (
              <NewsGrid news={news} />
            ) : (
              <div className="text-center py-20">
                <p className="text-lg text-text-secondary tracking-tight">
                  Hələlik xəbər yoxdur. Tezliklə yeni məqalələr əlavə olunacaq.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Yeniliklərdən xəbərdar olun
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Tibbi texnologiya sahəsindəki ən son inkişaflar haqqında məlumat almaq üçün bizimlə əlaqə saxlayın
              </p>
              <Link
                href="/contact"
                className="inline-block bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
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
