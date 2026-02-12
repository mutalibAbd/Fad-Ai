import { GlassHeader } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { getVisibleProducts } from '@/lib/queries/products';
import ProductsClient from './ProductsClient';

export const metadata = {
  title: 'Məhsullar | FADAI',
  description: 'Tibbi görüntüləmə və süni intellekt əsaslı diaqnostika məhsulları',
};

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getVisibleProducts();

  const productData = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    icon: p.icon,
    title: p.title,
    description: p.description,
    image_url: p.image_url,
  }));

  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-background-light border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              Kataloq
            </p>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-text-primary mb-4">
              Məhsullar
            </h1>
            <p className="text-xl text-text-secondary tracking-tight max-w-xl mx-auto">
              Tibbi görüntüləmə və süni intellekt əsaslı diaqnostika həlləri
            </p>
          </div>
        </section>

        {/* Zig-Zag Products */}
        <ProductsClient products={productData} />

        {/* CTA Section */}
        <section className="py-20 bg-background-light">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-6">
              Məhsullarımız haqqında ətraflı məlumat almaq istəyirsiniz?
            </h2>
            <p className="text-lg text-text-secondary tracking-tight mb-8">
              Demo təqdimat və ya texniki məsləhət üçün bizimlə əlaqə saxlayın
            </p>
            <Link
              href="/contact"
              className="inline-block bg-primary text-white px-8 py-4 rounded-xl font-medium tracking-tight hover:bg-primary-600 transition-colors duration-200"
            >
              Demo Tələb Et
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
