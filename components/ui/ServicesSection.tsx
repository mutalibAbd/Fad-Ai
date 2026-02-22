'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { ServiceCategoryWithServices } from '@/lib/types';

const CARDS_PER_PAGE = 6;
const ANIMATION_DURATION = 500; // ms debounce

interface ServicesSectionProps {
  categories: ServiceCategoryWithServices[];
  title?: string;
}

/* ── Shared card component ── */

function ServiceCard({ svc, index }: { svc: ServiceCategoryWithServices['services'][number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Link
        href={svc.slug ? `/services/${svc.slug}` : '#'}
        className={`group block h-full ${!svc.slug ? 'pointer-events-none opacity-60' : ''}`}
      >
        <div className="relative bg-card rounded-2xl border border-card-border shadow-card overflow-hidden min-h-[280px] h-full flex flex-col items-center p-6 text-center hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
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
    </motion.div>
  );
}

/* ── Main component ── */

export default function ServicesSection({ categories, title = 'Xidmətlərimiz' }: ServicesSectionProps) {
  const nonEmpty = categories.filter((cat) => cat.services.length > 0);

  /* ── Desktop state ── */
  const [activeCatIdx, setActiveCatIdx] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const isAnimating = useRef(false);
  const mainRef = useRef<HTMLDivElement>(null);

  /* ── Mobile state ── */
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [showAllIds, setShowAllIds] = useState<Set<string>>(new Set());

  const activeCat = nonEmpty[activeCatIdx];
  const totalPages = activeCat ? Math.ceil(activeCat.services.length / CARDS_PER_PAGE) : 0;
  const currentCards = activeCat
    ? activeCat.services.slice(currentPage * CARDS_PER_PAGE, (currentPage + 1) * CARDS_PER_PAGE)
    : [];

  /* ── Navigation helpers ── */
  const goNext = useCallback(() => {
    if (isAnimating.current) return false;

    // Last page of last category → release scroll
    if (activeCatIdx === nonEmpty.length - 1 && currentPage >= totalPages - 1) {
      return false;
    }

    isAnimating.current = true;
    setTimeout(() => { isAnimating.current = false; }, ANIMATION_DURATION);

    if (currentPage < totalPages - 1) {
      setCurrentPage((p) => p + 1);
    } else {
      // Move to next category
      setActiveCatIdx((i) => i + 1);
      setCurrentPage(0);
    }
    return true;
  }, [activeCatIdx, currentPage, totalPages, nonEmpty.length]);

  const goPrev = useCallback(() => {
    if (isAnimating.current) return false;

    // First page of first category → release scroll
    if (activeCatIdx === 0 && currentPage === 0) {
      return false;
    }

    isAnimating.current = true;
    setTimeout(() => { isAnimating.current = false; }, ANIMATION_DURATION);

    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
    } else {
      // Move to previous category, last page
      const prevCat = nonEmpty[activeCatIdx - 1];
      const prevTotalPages = Math.ceil(prevCat.services.length / CARDS_PER_PAGE);
      setActiveCatIdx((i) => i - 1);
      setCurrentPage(prevTotalPages - 1);
    }
    return true;
  }, [activeCatIdx, currentPage, nonEmpty]);

  /* ── Wheel interception (non-passive listener) ── */
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    let hovering = isHovering;

    const handleWheel = (e: WheelEvent) => {
      if (!hovering) return;
      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      const handled = e.deltaY > 0 ? goNext() : goPrev();
      if (handled) {
        e.preventDefault();
      }
      // If not handled (boundary), let normal scroll happen
    };

    const enter = () => { hovering = true; };
    const leave = () => { hovering = false; };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
    };
  }, [isHovering, goNext, goPrev]);

  /* ── Keep isHovering in sync for the ref closure ── */
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const enter = () => setIsHovering(true);
    const leave = () => setIsHovering(false);
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
    };
  }, []);

  /* ── Sidebar click ── */
  const handleSidebarClick = (idx: number) => {
    setActiveCatIdx(idx);
    setCurrentPage(0);
  };

  /* ── Mobile toggles ── */
  const toggleCategory = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleShowAll = (id: string) => {
    setShowAllIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  if (nonEmpty.length === 0) return null;

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tighter text-text-primary mb-12">
          {title}
        </h2>

        {/* ===== MOBILE: Accordion layout (< md) ===== */}
        <div className="md:hidden space-y-3">
          {nonEmpty.map((cat) => {
            const isOpen = openIds.has(cat.id);
            const showAll = showAllIds.has(cat.id);
            const visibleServices = showAll ? cat.services : cat.services.slice(0, 3);

            return (
              <div
                key={cat.id}
                className="rounded-2xl border border-card-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-lg font-semibold tracking-tight text-text-primary">
                    {cat.title}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {visibleServices.map((svc, i) => (
                        <ServiceCard key={svc.id} svc={svc} index={i} />
                      ))}
                    </div>

                    {cat.services.length > 3 && !showAll && (
                      <button
                        onClick={() => toggleShowAll(cat.id)}
                        className="mt-4 w-full py-2.5 text-sm font-medium tracking-tight text-primary hover:text-primary-600 transition-colors rounded-xl border border-card-border hover:bg-background-light"
                      >
                        Hamısını gör ({cat.services.length})
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ===== DESKTOP: 2-Column split layout (>= md) ===== */}
        <div className="hidden md:flex md:flex-row items-start gap-12 lg:gap-16">

          {/* ── LEFT SIDEBAR (Sticky Navigation) ── */}
          <aside className="w-1/4 sticky top-24 flex-shrink-0">
            <ul className="flex flex-col gap-1">
              {nonEmpty.map((cat, idx) => {
                const isActive = idx === activeCatIdx;
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleSidebarClick(idx)}
                      className={`w-full text-left py-3 text-lg tracking-tight transition-all duration-300 ${
                        isActive
                          ? 'text-text-primary font-bold border-b-2 border-primary'
                          : 'text-text-secondary hover:text-text-primary border-b border-transparent'
                      }`}
                    >
                      {cat.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* ── RIGHT CONTENT (Paginated Card Grid) ── */}
          <div ref={mainRef} className="w-3/4 min-h-[620px]">
            {/* Category heading */}
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tighter text-text-primary mb-8">
              {activeCat?.title}
            </h3>

            {/* Animated card grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCat?.id}-${currentPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-3 gap-6"
              >
                {currentCards.map((svc, i) => (
                  <ServiceCard key={svc.id} svc={svc} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Page indicator dots */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (!isAnimating.current) {
                        isAnimating.current = true;
                        setTimeout(() => { isAnimating.current = false; }, ANIMATION_DURATION);
                        setCurrentPage(i);
                      }
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === currentPage
                        ? 'bg-primary w-6'
                        : 'bg-text-secondary/30 hover:bg-text-secondary/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
