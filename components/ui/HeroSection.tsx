'use client';

import Image from 'next/image';

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function HeroSection({
  headline = 'Radiologiyada Rəqəmsal Simfoniya',
  subheadline = 'Tibbi görüntüləmədə dəqiqliyin orkestrləşdirilməsi - innovativ süni intellekt texnologiyası',
  imageSrc = '/hero-placeholder.png',
  imageAlt = 'FAD-AI Platform',
}: HeroSectionProps) {
  return (
    <section className="relative bg-background min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        {/* Headline */}
        <h1 className="text-6xl md:text-7xl font-semibold tracking-tight text-text-primary mb-6">
          {headline}
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-text-secondary tracking-tight max-w-3xl mx-auto mb-12">
          {subheadline}
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <button className="bg-primary text-white px-8 py-4 rounded-2xl font-medium tracking-tight hover:bg-primary-600 transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md">
            Başlamaq
          </button>
          <button className="bg-white text-text-primary px-8 py-4 rounded-2xl font-medium tracking-tight border border-slate-100 hover:border-slate-200 transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md">
            Ətraflı Məlumat
          </button>
        </div>

        {/* Floating Image Placeholder */}
        <div className="relative mx-auto max-w-5xl animate-float">
          <div className="rounded-2xl bg-white shadow-card-hover border border-slate-100 overflow-hidden aspect-video flex items-center justify-center">
            {/* Placeholder for floating UI mockup */}
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <div className="text-text-secondary text-lg font-medium tracking-tight">
                Platformanın Görünüşü
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Gradient Decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
    </section>
  );
}
