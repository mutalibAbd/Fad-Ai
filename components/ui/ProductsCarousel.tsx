'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@/lib/types';

interface ProductsCarouselProps {
  products: Product[];
  title?: string;
}

const GAP = 24;

export default function ProductsCarousel({ products, title = 'Məhsullarımız' }: ProductsCarouselProps) {
  const n = products.length;

  /* Clone first & last items for seamless infinite loop */
  const extended = useMemo(() => {
    if (n === 0) return [];
    return [products[n - 1], ...products, products[0]];
  }, [products, n]);

  /*
   * slideIndex mapping (inside `extended`):
   *   0       → clone of last real item
   *   1 … n  → real items
   *   n + 1  → clone of first real item
   */
  const [slideIndex, setSlideIndex] = useState(1);
  const [transition, setTransition] = useState(true);
  const [dragDelta, setDragDelta] = useState(0);
  const [cardW, setCardW] = useState(600);

  const wrapRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const moved = useRef(false);

  /* ---- Card width: exactly half | full | half visible ---- */
  const measure = useCallback(() => {
    if (!wrapRef.current) return 600;
    const w = wrapRef.current.clientWidth;
    // Desktop / tablet: half of adjacent cards visible on each side
    if (w >= 768) return (w - 2 * GAP) / 2;
    // Mobile: 80 % width with peek on sides
    return w * 0.8;
  }, []);

  useEffect(() => {
    const sync = () => setCardW(measure());
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [measure]);

  /* ---- Translate X to center the active slide ---- */
  const tx = useCallback(
    (idx: number, drag = 0) => {
      if (!wrapRef.current) return 0;
      const cw = wrapRef.current.clientWidth;
      return -(idx * (cardW + GAP)) + (cw - cardW) / 2 + drag;
    },
    [cardW],
  );

  /* ---- Navigation ---- */
  const goTo = useCallback((i: number) => {
    // Clamp to valid range: never go beyond clone positions
    if (i < 0 || i > n + 1) return;
    setTransition(true);
    setSlideIndex(i);
  }, [n]);

  const next = useCallback(() => goTo(slideIndex + 1), [slideIndex, goTo]);
  const prev = useCallback(() => goTo(slideIndex - 1), [slideIndex, goTo]);

  /* ---- Infinite-loop: instant reposition after CSS transition ---- */
  const onTransEnd = useCallback((e: React.TransitionEvent) => {
    // Ignore bubbled events from child card transitions
    if (e.target !== e.currentTarget) return;
    if (slideIndex === 0) {
      setTransition(false);
      setSlideIndex(n);
    } else if (slideIndex === n + 1) {
      setTransition(false);
      setSlideIndex(1);
    }
  }, [slideIndex, n]);

  /* ---- Pointer drag / swipe ---- */
  const pDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    moved.current = false;
    startX.current = e.clientX;
    /* No setPointerCapture — it intercepts clicks on child <Link> elements.
       No state updates here either, to avoid re-renders on simple clicks. */
  }, []);

  const pMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const d = e.clientX - startX.current;
    if (Math.abs(d) > 10) {
      if (!moved.current) {
        moved.current = true;
        setTransition(false);
      }
    }
    if (moved.current) {
      setDragDelta(d);
    }
  }, []);

  const pUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;

    /* Simple click — no drag occurred. Skip all state updates so React
       doesn't re-render before the click event reaches the <Link>. */
    if (!moved.current) return;

    const thresh = cardW * 0.15;
    let dest = slideIndex;
    if (dragDelta > thresh) dest--;
    else if (dragDelta < -thresh) dest++;
    setDragDelta(0);
    goTo(dest);
  }, [dragDelta, slideIndex, cardW, goTo]);

  /* Block <Link> click when the user dragged */
  const guard = useCallback((e: React.MouseEvent) => {
    if (moved.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  if (n === 0) return null;

  const realIdx =
    slideIndex === 0 ? n - 1 : slideIndex === n + 1 ? 0 : slideIndex - 1;

  return (
    <section className="py-24 bg-background-light overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tighter text-text-primary">
            {title}
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-text-primary transition-colors"
              aria-label="Sola sürüşdür"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-text-primary transition-colors"
              aria-label="Sağa sürüşdür"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel track */}
      <div
        ref={wrapRef}
        className="relative w-full select-none cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={pDown}
        onPointerMove={pMove}
        onPointerUp={pUp}
        onPointerCancel={pUp}
        onClickCapture={guard}
      >
        <div
          className="flex will-change-transform"
          style={{
            gap: `${GAP}px`,
            transform: `translateX(${tx(slideIndex, dragDelta)}px)`,
            transition: transition
              ? 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)'
              : 'none',
          }}
          onTransitionEnd={onTransEnd}
        >
          {extended.map((product, i) => {
            const isActive =
              i === slideIndex ||
              (slideIndex === 0 && i === n) ||
              (slideIndex === n + 1 && i === 1);

            return (
              <div
                key={`${product.id}-${i}`}
                className="flex-shrink-0 transition-all duration-300"
                style={{
                  width: `${cardW}px`,
                  opacity: isActive ? 1 : 0.6,
                  transform: isActive ? 'scale(1)' : 'scale(0.95)',
                }}
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="block group"
                  draggable={false}
                >
                  <div className="bg-card rounded-2xl border border-card-border overflow-hidden shadow-card h-[420px] md:h-[540px] grid grid-rows-[2fr_1fr]">
                    {/* Image — 2/3 of card height */}
                    <div className="relative overflow-hidden bg-primary/5 min-h-0">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 80vw, 50vw"
                          draggable={false}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                          <span className="text-6xl opacity-30">
                            {product.icon || '📦'}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Text — 1/3 of card height */}
                    <div className="p-8 flex flex-col justify-center min-h-0">
                      <h3 className="text-xl font-bold tracking-tight text-text-primary mb-3 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-base text-text-secondary tracking-tight line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i + 1)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === realIdx
                ? 'bg-primary w-6'
                : 'bg-slate-300 dark:bg-slate-600 w-2'
            }`}
            aria-label={`Məhsul ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
