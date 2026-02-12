'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  slug: string;
  icon: string;
  title: string;
  description: string | null;
  image_url: string | null;
}

export default function ProductsClient({ products }: { products: Product[] }) {
  return (
    <div className="bg-background">
      {products.map((product, index) => (
        <ProductBlock
          key={product.id}
          product={product}
          isTextLeft={index % 2 === 0}
          index={index}
        />
      ))}
    </div>
  );
}

function ProductBlock({
  product,
  isTextLeft,
  index,
}: {
  product: Product;
  isTextLeft: boolean;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`py-20 ${index % 2 === 1 ? 'bg-background-light' : 'bg-background'}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <Link href={`/products/${product.slug}`} className="block group">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Side */}
            <div
              className={`${!isTextLeft ? 'lg:order-2' : ''} transition-all duration-700 ease-out ${
                visible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {product.icon && (
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <span className="text-2xl">{product.icon}</span>
                </div>
              )}

              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-6 group-hover:text-primary transition-colors">
                {product.title}
              </h3>

              {product.description && (
                <p className="text-lg text-text-secondary tracking-tight leading-relaxed">
                  {product.description}
                </p>
              )}

              <span className="inline-flex items-center gap-2 mt-6 text-primary font-medium tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Ətraflı oxu
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>

            {/* Image Side */}
            <div
              className={`${!isTextLeft ? 'lg:order-1' : ''} transition-all duration-700 ease-out ${
                visible
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-12 scale-[0.97]'
              }`}
              style={{ transitionDelay: visible ? '150ms' : '0ms' }}
            >
              {product.image_url ? (
                <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative aspect-[4/3] group-hover:shadow-md transition-shadow">
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="rounded-2xl bg-primary/5 border border-slate-100 flex items-center justify-center aspect-[4/3]">
                  {product.icon ? (
                    <span className="text-8xl opacity-30">{product.icon}</span>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-primary/10" />
                  )}
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
