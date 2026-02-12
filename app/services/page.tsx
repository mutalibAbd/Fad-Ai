import { GlassHeader } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { getServiceCategoriesWithServices } from '@/lib/queries/service-categories';
import ServicesClient from './ServicesClient';

export const metadata = {
  title: 'Xidmətlər | FADAI',
  description: 'Tibbi görüntüləmə sistemləri üçün peşəkar xidmətlər və konsultasiya',
};

export const revalidate = 300;

export default async function ServicesPage() {
  const categoriesWithServices = await getServiceCategoriesWithServices();

  const categories = categoriesWithServices.map((cat) => ({
    id: cat.id,
    title: cat.title,
    slug: cat.slug,
  }));

  const services = categoriesWithServices.flatMap((cat) =>
    cat.services.map((svc) => ({
      id: svc.id,
      title: svc.title,
      slug: svc.slug,
      description: svc.description,
      icon: svc.icon,
      image_url: svc.image_url,
      category_id: svc.category_id,
    }))
  );

  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-background-light border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-4">
              <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-text-primary mb-6">
                Xidmətlər
              </h1>
              <p className="text-xl text-text-secondary tracking-tight max-w-2xl mx-auto">
                Tibbi görüntüləmə sistemlərinizin səmərəliliyini artırmaq üçün kompleks həllər
              </p>
            </div>
          </div>
        </section>

        {/* Scroll Spy Services */}
        <ServicesClient categories={categories} services={services} />

        {/* CTA Section */}
        <section className="py-16 bg-background-light">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-6">
              Xidmətlərimiz haqqında ətraflı məlumat almaq istəyirsiniz?
            </h2>
            <p className="text-lg text-text-secondary tracking-tight mb-8">
              Komandamız sizə uyğun həll təklif etməyə hazırdır
            </p>
            <Link
              href="/contact"
              className="inline-block border-2 border-primary text-primary px-8 py-4 rounded-xl font-medium tracking-tight hover:bg-primary hover:text-white transition-colors duration-200"
            >
              Bizimlə Əlaqə Saxlayın
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
