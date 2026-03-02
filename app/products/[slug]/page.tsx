import { GlassHeader, SoftCard } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, TrendingUp } from 'lucide-react';
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

  // Parse specifications for structured data (stats, advantages)
  let structuredSpecs: { stats?: { value: string; label: string }[]; advantages?: string[] } = {};
  if (specs && 'stats' in specs) {
    // If specifications has been extended with structured data
    try {
      structuredSpecs = product.specifications as typeof structuredSpecs;
    } catch {
      // ignore parse errors
    }
  }

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

        {/* Stats Bar */}
        {structuredSpecs.stats && structuredSpecs.stats.length > 0 && (
          <section className="bg-blue-600 text-white py-6">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {structuredSpecs.stats.map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm opacity-80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 2-column layout: content + sidebar */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column */}
              <div className="lg:col-span-2 space-y-12">
                {/* Long Description */}
                {product.long_description && (
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
                      Məhsul haqqında
                    </h2>
                    <p className="text-lg text-text-secondary tracking-tight leading-relaxed whitespace-pre-line">
                      {product.long_description}
                    </p>
                  </div>
                )}

                {/* Content */}
                {product.content && (
                  <div className="text-lg text-text-secondary tracking-tight leading-relaxed whitespace-pre-line">
                    {product.content}
                  </div>
                )}

                {/* Features from product_features table */}
                {product.features.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-6">
                      Xüsusiyyətlər
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.features.map((feature) => (
                        <div key={feature.id} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-text-primary">{feature.title}</p>
                            {feature.description && (
                              <p className="text-sm text-text-secondary mt-1">{feature.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Advantages */}
                {structuredSpecs.advantages && structuredSpecs.advantages.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-6">
                      Üstünlüklər
                    </h2>
                    <div className="space-y-3">
                      {structuredSpecs.advantages.map((adv, i) => (
                        <div key={i} className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 flex items-center gap-3">
                          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          <span className="text-text-primary">{adv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications table */}
                {specs && !('stats' in specs) && Object.keys(specs).length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-6">
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
                )}
              </div>

              {/* Right column - Sticky Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Məhsulu sifariş edin</h3>
                    <p className="text-blue-100 text-sm mb-6">
                      Demo təqdimat və ya texniki məsləhət üçün bizimlə əlaqə saxlayın
                    </p>
                    <Link
                      href="/contact"
                      className="block w-full bg-white text-gray-900 text-center px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Əlaqə Saxlayın
                    </Link>

                    {/* Top features in sidebar */}
                    {product.features.length > 0 && (
                      <ul className="mt-6 space-y-2">
                        {product.features.slice(0, 3).map((f) => (
                          <li key={f.id} className="flex items-center gap-2 text-sm text-blue-100">
                            <Check className="w-4 h-4 flex-shrink-0" />
                            {f.title}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        {product.images.length > 0 && (
          <section className="py-16 bg-background-light">
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

        {/* Dynamic Page Blocks */}
        {blocks.map((block, index) => (
          <BlockRenderer key={block.id} block={block} index={index} />
        ))}

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Bu məhsul haqqında ətraflı məlumat almaq istəyirsiniz?
              </h2>
              <p className="text-lg text-blue-100 mb-8">
                Demo təqdimat və ya texniki məsləhət üçün bizimlə əlaqə saxlayın
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
