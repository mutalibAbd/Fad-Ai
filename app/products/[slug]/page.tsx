import { GlassHeader, SoftCard } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProductSlugs } from '@/lib/queries/products';
import { getVisiblePageBlocks } from '@/lib/queries/page-blocks';
import { BlockRenderer } from '@/components/sections/page-blocks';

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Məhsul tapılmadı | FADAI' };
  }

  return {
    title: `${product.title} | FADAI`,
    description: product.description || 'FADAI məhsulu',
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const specs = product.specifications && typeof product.specifications === 'object' && !Array.isArray(product.specifications)
    ? product.specifications as Record<string, string>
    : null;

  const blocks = await getVisiblePageBlocks(`products/${slug}`);

  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-background-light">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                {product.icon && (
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <span className="text-4xl">{product.icon}</span>
                  </div>
                )}
                <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-text-primary mb-6">
                  {product.title}
                </h1>
                <p className="text-xl text-text-secondary tracking-tight leading-relaxed mb-8">
                  {product.description}
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-primary text-white px-8 py-4 rounded-xl font-medium tracking-tight hover:bg-primary-600 transition-colors duration-200"
                >
                  Əlaqə saxlayın
                </Link>
              </div>

              {/* Product Image */}
              <div className="rounded-2xl bg-white shadow-card border border-slate-100 overflow-hidden aspect-video relative">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    {product.icon ? (
                      <span className="text-8xl opacity-30">{product.icon}</span>
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-primary/10" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Long Description — intro paragraph */}
        {product.long_description && (
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-6">
              <p className="text-lg text-text-secondary tracking-tight leading-relaxed">
                {product.long_description}
              </p>
            </div>
          </section>
        )}

        {/* Features */}
        {product.features.length > 0 && (
          <section className="py-20 bg-background-light">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-semibold tracking-tight text-text-primary mb-12 text-center">
                Xüsusiyyətlər
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {product.features.map((feature) => (
                  <SoftCard key={feature.id} className="p-8" hover={false}>
                    <h3 className="text-lg font-semibold tracking-tight text-text-primary mb-3">
                      {feature.title}
                    </h3>
                    {feature.description && (
                      <p className="text-text-secondary tracking-tight leading-relaxed">
                        {feature.description}
                      </p>
                    )}
                  </SoftCard>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Gallery */}
        {product.images.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-semibold tracking-tight text-text-primary mb-12 text-center">
                Qalereya
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {product.images.map((image) => (
                  <div key={image.id} className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative aspect-video">
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Specifications */}
        {specs && Object.keys(specs).length > 0 && (
          <section className="py-14 bg-background-light">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-semibold tracking-tight text-text-primary mb-12 text-center">
                Spesifikasiyalar
              </h2>
              <SoftCard className="overflow-hidden" hover={false}>
                <table className="w-full">
                  <tbody className="divide-y divide-slate-100">
                    {Object.entries(specs).map(([key, value]) => (
                      <tr key={key} className="hover:bg-background transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-text-primary tracking-tight">
                          {key}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary tracking-tight">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </SoftCard>
            </div>
          </section>
        )}

        {/* Dynamic Page Blocks */}
        {blocks.map((block, index) => (
          <BlockRenderer key={block.id} block={block} index={index} />
        ))}

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-6">
              Bu məhsul haqqında ətraflı məlumat almaq istəyirsiniz?
            </h2>
            <p className="text-lg text-text-secondary tracking-tight mb-8">
              Demo təqdimat və ya texniki məsləhət üçün bizimlə əlaqə saxlayın
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
