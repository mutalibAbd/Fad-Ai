'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
}

export default function HeroSection({
  headline = 'Radiologiyada Rəqəmsal Simfoniya',
  subheadline = 'Tibbi görüntüləmədə dəqiqliyin orkestrləşdirilməsi — innovativ süni intellekt texnologiyası',
}: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative bg-background min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-primary/[0.06] rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-32 text-center">
        {/* Tagline Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/[0.06] border border-primary/10 mb-8 transition-all duration-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <span className="text-sm font-medium tracking-tight text-primary">
            Süni intellekt ilə gücləndirilmiş
          </span>
        </div>

        {/* Headline */}
        <h1
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-text-primary mb-8 leading-[0.95] transition-all duration-[600ms] ${
            mounted ? 'opacity-100 translate-y-0 delay-150' : 'opacity-0 translate-y-6'
          }`}
        >
          {headline}
        </h1>

        {/* Subheadline */}
        <p
          className={`text-lg sm:text-xl md:text-2xl text-text-secondary tracking-tight max-w-2xl mx-auto mb-14 leading-relaxed transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-4'
          }`}
        >
          {subheadline}
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex items-center justify-center gap-4 transition-all duration-500 ${
            mounted ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-3'
          }`}
        >
          <Link href="/contact" className="bg-primary text-white px-8 py-4 rounded-xl font-medium tracking-tight hover:bg-primary-600 transition-colors duration-200">
            Başlamaq
          </Link>
          <Link href="/about" className="bg-white text-text-primary px-8 py-4 rounded-xl font-medium tracking-tight border border-slate-200 hover:bg-slate-50 transition-colors duration-200">
            Ətraflı Məlumat
          </Link>
        </div>
      </div>
    </section>
  );
}
