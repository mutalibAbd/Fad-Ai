'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ServiceCategory {
  id: string;
  title: string;
  slug: string;
}

interface SubService {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  icon: string;
  image_url: string | null;
  category_id: string | null;
}

interface ServicesClientProps {
  categories: ServiceCategory[];
  services: SubService[];
}

export default function ServicesClient({ categories, services }: ServicesClientProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? '');
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const navRef = useRef<HTMLDivElement>(null);
  const isClickScrolling = useRef(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    categories.forEach((cat) => {
      const el = sectionRefs.current.get(cat.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isClickScrolling.current) {
            setActiveCategory(cat.id);
          }
        },
        { rootMargin: '-120px 0px -60% 0px', threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [categories]);

  const scrollToCategory = (categoryId: string) => {
    const el = sectionRefs.current.get(categoryId);
    if (!el) return;

    isClickScrolling.current = true;
    setActiveCategory(categoryId);

    const navHeight = navRef.current?.offsetHeight ?? 60;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 80;

    window.scrollTo({ top, behavior: 'smooth' });

    setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000);
  };

  let globalIndex = 0;

  return (
    <>
      {/* Sticky Category Navigation */}
      <div
        ref={navRef}
        className="sticky top-[73px] z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium tracking-tight whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:bg-slate-50 hover:text-text-primary'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Continuous Scroll Layout - Sub-Services Grouped by Category */}
      <div className="bg-background">
        {categories.map((cat) => {
          const catServices = services.filter((s) => s.category_id === cat.id);

          return (
            <div
              key={cat.id}
              ref={(el) => {
                if (el) sectionRefs.current.set(cat.id, el);
              }}
            >
              {catServices.map((service) => {
                const isEven = globalIndex % 2 === 0;
                const currentIndex = globalIndex;
                globalIndex++;

                return (
                  <ServiceBlock
                    key={service.id}
                    service={service}
                    isTextLeft={isEven}
                    index={currentIndex}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

function ServiceBlock({
  service,
  isTextLeft,
  index,
}: {
  service: SubService;
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

  const href = service.slug ? `/services/${service.slug}` : '#';

  return (
    <section
      ref={ref}
      className={`py-20 ${index % 2 === 1 ? 'bg-background-light' : 'bg-background'}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <Link href={href} className="block group">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Side */}
            <div
              className={`${!isTextLeft ? 'lg:order-2' : ''} transition-all duration-700 ease-out ${
                visible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {service.icon && (
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <span className="text-2xl">{service.icon}</span>
                </div>
              )}

              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-6 group-hover:text-primary transition-colors">
                {service.title}
              </h3>

              {service.description && (
                <p className="text-lg text-text-secondary tracking-tight leading-relaxed">
                  {service.description}
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
              {service.image_url ? (
                <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative aspect-[4/3] group-hover:shadow-md transition-shadow">
                  <Image
                    src={service.image_url}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="rounded-2xl bg-primary/5 border border-slate-100 flex items-center justify-center aspect-[4/3]">
                  {service.icon ? (
                    <span className="text-8xl opacity-30">{service.icon}</span>
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
