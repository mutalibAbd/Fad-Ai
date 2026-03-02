'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { HeroSlide } from '@/lib/types';

const gradients = [
  'linear-gradient(135deg, #1e3a5f 0%, #2B59FF 50%, #4a90d9 100%)',
  'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  'linear-gradient(135deg, #141e30 0%, #243b55 50%, #2B59FF 100%)',
];

interface HeroSectionProps {
  slides?: HeroSlide[];
  ctaPrimaryText?: string;
  ctaPrimaryUrl?: string;
  ctaSecondaryText?: string;
  ctaSecondaryUrl?: string;
}

export default function HeroSection({
  slides = [],
  ctaPrimaryText = 'Başlamaq',
  ctaPrimaryUrl = '/contact',
  ctaSecondaryText = 'Ətraflı Məlumat',
  ctaSecondaryUrl = '/about',
}: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  const displaySlides = useMemo(() => {
    if (slides.length === 0) {
      return [
        {
          subtitle: 'Süni İntellekt ilə',
          title: 'Tibbi Görüntüləmə',
          description: 'Tibbi görüntüləmədə dəqiqliyin orkestrləşdirilməsi - innovativ süni intellekt texnologiyası',
          background_image: '',
        },
      ];
    }
    return slides;
  }, [slides]);

  const slideCount = displaySlides.length;

  const next = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (slideCount <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slideCount]);

  const currentSlideData = displaySlides[currentSlide];
  const hasImage = currentSlideData?.background_image?.trim();

  return (
    <section className="relative h-[600px] md:h-[700px] flex items-center overflow-hidden">
      {/* Background: per-slide image or gradient */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={
            hasImage
              ? { backgroundImage: `url(${currentSlideData.background_image})` }
              : { background: gradients[currentSlide % gradients.length] }
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 -z-[5] bg-gradient-to-r from-black/70 to-black/40" />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              {/* Subtitle */}
              {currentSlideData.subtitle && (
                <p
                  className={`text-blue-400 text-lg md:text-xl font-medium mb-4 transition-all duration-700 ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                >
                  {currentSlideData.subtitle}
                </p>
              )}

              {/* Title */}
              <h1
                className={`text-4xl md:text-6xl font-bold text-white mb-6 leading-tight transition-all duration-700 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                {currentSlideData.title}
              </h1>

              {/* Description */}
              <p
                className={`text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed transition-all duration-700 delay-200 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {currentSlideData.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-[400ms] ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <Link
              href={ctaPrimaryUrl}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold tracking-tight transition-all duration-200 shadow-lg text-base"
            >
              {ctaPrimaryText}
            </Link>
            <Link
              href={ctaSecondaryUrl}
              className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold tracking-tight border border-white/30 hover:bg-white/30 transition-all duration-200 text-base"
            >
              {ctaSecondaryText}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {slideCount > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Əvvəlki slayd"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Növbəti slayd"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Slide indicators */}
      {slideCount > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {displaySlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'bg-blue-600 w-8' : 'bg-white/50 w-2 hover:bg-white/70'
              }`}
              aria-label={`Slayd ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
