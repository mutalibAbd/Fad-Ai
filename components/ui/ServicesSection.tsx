'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import type { ServiceCategoryWithServices } from '@/lib/types';

interface ServicesSectionProps {
  categories: ServiceCategoryWithServices[];
  title?: string;
}

export default function ServicesSection({ categories, title = 'Xidmətlərimiz' }: ServicesSectionProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? '');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const contentRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const toggleAccordion = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // IntersectionObserver scrollspy (desktop only)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    if (!mq.matches) return;

    const observers: IntersectionObserver[] = [];

    categories.forEach((cat) => {
      const el = sectionRefs.current.get(cat.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveCategoryId(cat.id);
          }
        },
        {
          rootMargin: '-30% 0px -60% 0px',
          threshold: 0,
        }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [categories]);

  if (categories.length === 0) return null;

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">

        {/* ===== MOBILE: Accordion layout (< 768px) ===== */}
        <div className="md:hidden">
          <h2 className="text-3xl font-semibold tracking-tighter text-text-primary mb-8">
            {title}
          </h2>

          <div className="space-y-3">
            {categories.map((cat) => {
              const isOpen = openIds.has(cat.id);
              const contentEl = contentRefs.current.get(cat.id);
              const scrollHeight = contentEl?.scrollHeight ?? 0;

              return (
                <div
                  key={cat.id}
                  className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-card overflow-hidden"
                >
                  {/* Accordion header */}
                  <button
                    onClick={() => toggleAccordion(cat.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-lg font-semibold tracking-tight text-text-primary">
                      {cat.title}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Accordion body */}
                  <div
                    ref={(el) => {
                      if (el) contentRefs.current.set(cat.id, el);
                    }}
                    className="transition-[max-height] duration-300 ease-in-out overflow-hidden"
                    style={{ maxHeight: isOpen ? `${scrollHeight}px` : '0px' }}
                  >
                    <div className="px-3 pb-3 space-y-1">
                      {cat.services.map((svc) => (
                        <Link
                          key={svc.id}
                          href={svc.slug ? `/services/${svc.slug}` : '#'}
                          className="group flex gap-4 p-3 rounded-xl hover:bg-background-light transition-colors duration-200"
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-primary/5 flex-shrink-0">
                            {svc.image_url ? (
                              <Image
                                src={svc.image_url}
                                alt={svc.title}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl">
                                {svc.icon || '🔧'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold tracking-tight text-text-primary group-hover:text-primary transition-colors">
                              {svc.title}
                            </h4>
                            {svc.description && (
                              <p className="text-sm text-text-secondary tracking-tight mt-1 line-clamp-2 leading-relaxed">
                                {svc.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== DESKTOP: Sticky nav + scrollable content (>= 768px) ===== */}
        <div className="hidden md:grid md:grid-cols-2 gap-16">
          {/* LEFT: Sticky category list */}
          <div>
            <div className="sticky top-32">
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tighter text-text-primary mb-10">
                {title}
              </h2>
              <nav className="space-y-5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      const el = sectionRefs.current.get(cat.id);
                      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className={`block text-left text-2xl tracking-tight transition-all duration-300 relative pb-1 ${
                      activeCategoryId === cat.id
                        ? 'text-text-primary font-bold'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {cat.title}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-0.5 bg-primary transition-all duration-300 ${
                        activeCategoryId === cat.id ? 'w-full' : 'w-0'
                      }`}
                    />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* RIGHT: Scrollable sub-services */}
          <div className="space-y-16">
            {categories.map((cat) => (
              <div
                key={cat.id}
                ref={(el) => {
                  if (el) sectionRefs.current.set(cat.id, el);
                }}
              >
                <div className="space-y-6">
                  {cat.services.map((svc) => (
                    <Link
                      key={svc.id}
                      href={svc.slug ? `/services/${svc.slug}` : '#'}
                      className="group flex gap-5 p-5 rounded-2xl hover:bg-background-light transition-colors duration-200"
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-primary/5 flex-shrink-0">
                        {svc.image_url ? (
                          <Image
                            src={svc.image_url}
                            alt={svc.title}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            {svc.icon || '🔧'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold tracking-tight text-text-primary group-hover:text-primary transition-colors">
                          {svc.title}
                        </h4>
                        {svc.description && (
                          <p className="text-base text-text-secondary tracking-tight mt-1.5 line-clamp-2 leading-relaxed">
                            {svc.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
