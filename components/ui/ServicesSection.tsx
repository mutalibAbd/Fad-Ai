'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { ServiceCategoryWithServices } from '@/lib/types';

const MAX_CARDS_PER_CATEGORY = 6;

interface ServicesSectionProps {
  categories: ServiceCategoryWithServices[];
  title?: string;
}

export default function ServicesSection({ categories, title = 'Xidmətlərimiz' }: ServicesSectionProps) {
  const nonEmpty = categories.filter((cat) => cat.services.length > 0);
  const [activeCategoryId, setActiveCategoryId] = useState(nonEmpty[0]?.id ?? '');
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const navRef = useRef<HTMLUListElement>(null);

  /* ── ScrollSpy: IntersectionObserver ── */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    nonEmpty.forEach((cat) => {
      const el = sectionRefs.current.get(cat.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveCategoryId(cat.id);
          }
        },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [nonEmpty]);

  /* ── Auto-scroll active nav item into view (mobile horizontal scroll) ── */
  useEffect(() => {
    if (!navRef.current) return;
    const activeItem = navRef.current.querySelector('[data-active="true"]');
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeCategoryId]);

  const scrollToCategory = (catId: string) => {
    const el = sectionRefs.current.get(catId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (nonEmpty.length === 0) return null;

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tighter text-text-primary mb-12">
          {title}
        </h2>

        {/* ===== 2-COLUMN SPLIT LAYOUT ===== */}
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 lg:gap-16">

          {/* ── LEFT SIDEBAR (Sticky Navigation) ── */}
          <aside className="w-full md:w-1/4 md:sticky md:top-24 flex-shrink-0">
            <ul
              ref={navRef}
              className="flex md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-x-visible scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0 pb-4 md:pb-0"
            >
              {nonEmpty.map((cat) => {
                const isActive = activeCategoryId === cat.id;
                return (
                  <li key={cat.id}>
                    <button
                      data-active={isActive}
                      onClick={() => scrollToCategory(cat.id)}
                      className={`
                        flex-shrink-0 md:flex-shrink md:w-full text-left
                        px-4 py-2 md:px-0 md:py-3
                        rounded-full md:rounded-none
                        text-sm md:text-lg tracking-tight
                        transition-all duration-300
                        ${isActive
                          ? 'bg-primary text-white md:bg-transparent md:text-text-primary font-bold md:border-b-2 md:border-primary'
                          : 'bg-background-light md:bg-transparent text-text-secondary hover:text-text-primary md:border-b md:border-transparent'
                        }
                      `}
                    >
                      {cat.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* ── RIGHT CONTENT (Scrollable Card Grid Area) ── */}
          <main className="w-full md:w-3/4 flex flex-col gap-16">
            {nonEmpty.map((cat) => (
              <section
                key={cat.id}
                id={cat.slug}
                className="scroll-mt-24"
                ref={(el) => {
                  if (el) sectionRefs.current.set(cat.id, el);
                }}
              >
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tighter text-text-primary mb-8">
                  {cat.title}
                </h3>

                {/* Card grid — max 3 cols, capped at MAX_CARDS_PER_CATEGORY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cat.services.slice(0, MAX_CARDS_PER_CATEGORY).map((svc) => (
                    <Link
                      key={svc.id}
                      href={svc.slug ? `/services/${svc.slug}` : '#'}
                      className={`group block ${!svc.slug ? 'pointer-events-none opacity-60' : ''}`}
                    >
                      <div className="relative bg-card rounded-2xl border border-card-border shadow-card overflow-hidden min-h-[280px] flex flex-col items-center p-6 text-center hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                        {/* Decorative blob — top-right */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#F3F1E6] dark:bg-slate-800/60 pointer-events-none" />

                        {/* Decorative blob — bottom-left */}
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[#EFF1F4] dark:bg-slate-700/40 pointer-events-none" />

                        {/* Image area */}
                        <div className="relative z-10 flex-1 flex items-center justify-center w-full py-4">
                          {svc.image_url ? (
                            <Image
                              src={svc.image_url}
                              alt={svc.title}
                              width={160}
                              height={160}
                              className="object-contain max-h-32 w-auto group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
                              <span className="text-5xl">{svc.icon || '🔧'}</span>
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="relative z-10 text-base font-semibold tracking-tight text-text-primary group-hover:text-primary transition-colors duration-200 line-clamp-2">
                          {svc.title}
                        </h4>

                        {/* Description */}
                        {svc.description && (
                          <p className="relative z-10 text-sm text-text-secondary tracking-tight mt-2 line-clamp-2 leading-relaxed">
                            {svc.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </main>

        </div>
      </div>
    </section>
  );
}
