'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const gradients = [
  'linear-gradient(135deg, #1e3a5f 0%, #2B59FF 50%, #4a90d9 100%)',
  'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  'linear-gradient(135deg, #141e30 0%, #243b55 50%, #2B59FF 100%)',
];

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaUrl?: string;
  backgroundImages?: string[];
}

export default function HeroSection({
  headline = 'Radiologiyada Rəqəmsal Simfoniya',
  subheadline = 'Tibbi görüntüləmədə dəqiqliyin orkestrləşdirilməsi — innovativ süni intellekt texnologiyası ilə diaqnostikanın gələcəyini formalaşdırırıq.',
  ctaText = 'Ödənişsiz konsultasiyadan keç',
  ctaUrl = '/contact',
  backgroundImages,
}: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  const images = useMemo(
    () => (backgroundImages ?? []).filter((url) => url.trim() !== ''),
    [backgroundImages],
  );
  const hasImages = images.length > 0;
  const slides = hasImages ? images : gradients;
  const slideCount = slides.length;

  const next = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (slideCount <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slideCount]);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background: uploaded images or gradient crossfade */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={
            hasImages
              ? { backgroundImage: `url(${images[currentSlide]})` }
              : { background: gradients[currentSlide] }
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      {/* Left-to-right dark gradient overlay for text readability */}
      <div
        className="absolute inset-0 -z-[5]"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.2) 100%)',
        }}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 w-full">
        <div className="max-w-2xl text-center md:text-left">
          {/* H1 — Large, bold, impactful */}
          <h1
            className={`text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[4rem] font-extrabold text-white mb-6 leading-[1.1] tracking-tight transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {headline}
          </h1>

          {/* Description — wider leading, silver tone */}
          <p
            className={`text-base sm:text-lg md:text-xl text-gray-200 max-w-xl leading-[1.6] mb-8 transition-all duration-700 delay-200 mx-auto md:mx-0 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {subheadline}
          </p>

          {/* CTA Button — directly below paragraph */}
          <div
            className={`flex justify-center md:justify-start transition-all duration-700 delay-[400ms] ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <Link
              href={ctaUrl}
              className="group inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold tracking-tight hover:bg-gray-100 hover:-translate-y-0.5 transition-all duration-200 shadow-lg text-base"
            >
              {ctaText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>

      {/* Manual slide controls */}
      {slideCount > 1 && (
      <div className="absolute bottom-8 left-6 flex items-center gap-3">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          aria-label="Əvvəlki slayd"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          aria-label="Növbəti slayd"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        {/* Slide indicators */}
        <div className="flex gap-2 ml-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'bg-white w-6' : 'bg-white/40 w-2'
              }`}
              aria-label={`Slayd ${i + 1}`}
            />
          ))}
        </div>
      </div>
      )}
    </section>
  );
}
