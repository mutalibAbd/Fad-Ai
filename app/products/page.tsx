import { GlassHeader, SoftCard } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { getVisibleProducts } from '@/lib/queries/products';

export const metadata = {
  title: 'Məhsullar | FADAI',
  description: 'Tibbi görüntüləmə və süni intellekt əsaslı diaqnostika məhsulları',
};

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getVisibleProducts();

  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-background-light">
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

        {/* Products Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <SoftCard className="p-8 flex flex-col h-full cursor-pointer">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                      <span className="text-4xl">{product.icon}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold tracking-tight text-text-primary mb-3">
                      {product.title}
                    </h3>

                    {/* Description */}
                    <p className="text-text-secondary tracking-tight leading-relaxed mb-6">
                      {product.description}
                    </p>
                  </SoftCard>
                </Link>
              ))}
            </div>
          </div>
        </section>

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
