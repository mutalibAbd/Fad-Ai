'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { CTAContent } from '@/lib/types';

interface CTASectionProps {
  content: CTAContent;
}

export default function CTASection({ content }: CTASectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl bg-primary overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute inset-0">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/[0.06] rounded-full" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/[0.04] rounded-full" />
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-10 sm:p-14 md:p-20">
            {/* Content */}
            <div
              className={`transition-all duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-white mb-4 leading-tight">
                {content.title}
              </h2>
              <p className="text-lg text-white/80 tracking-tight leading-relaxed mb-8">
                {content.subtitle}
              </p>
              {content.cta_text && content.cta_url && (
                <Link
                  href={content.cta_url}
                  className="inline-block bg-white text-primary px-8 py-4 rounded-xl font-medium tracking-tight hover:bg-white/90 transition-colors duration-200 shadow-lg"
                >
                  {content.cta_text}
                </Link>
              )}
            </div>

            {/* Visual / Image */}
            <div
              className={`hidden lg:flex items-center justify-center transition-all duration-700 delay-200 ${
                mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              {content.image_url ? (
                <img
                  src={content.image_url}
                  alt={content.title}
                  className="max-h-72 w-auto object-contain rounded-2xl"
                />
              ) : (
                <div className="w-64 h-64 rounded-3xl bg-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/20 flex items-center justify-center">
                      <span className="text-3xl">📋</span>
                    </div>
                    <p className="text-sm text-white/60 tracking-tight">Vizual əlavə edin</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
