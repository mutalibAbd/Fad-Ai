import { GlassHeader } from '@/components/ui';
import Footer from '@/components/ui/Footer';
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
        <section className="py-20 bg-background-light">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              Blog
            </p>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-text-primary mb-4">
              Xəbərlər
            </h1>
            <p className="text-xl text-text-secondary tracking-tight max-w-xl mx-auto">
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
        <section className="py-20 bg-background-light">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-6">
              Yeniliklərdən xəbərdar olun
            </h2>
            <p className="text-lg text-text-secondary tracking-tight mb-8">
              Tibbi texnologiya sahəsindəki ən son inkişaflar haqqında məlumat almaq üçün bizimlə əlaqə saxlayın
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
