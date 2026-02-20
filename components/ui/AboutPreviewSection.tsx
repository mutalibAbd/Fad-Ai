'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { AboutPreviewContent } from '@/lib/types';

interface AboutPreviewSectionProps {
  content: AboutPreviewContent;
}

export default function AboutPreviewSection({ content }: AboutPreviewSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div
            className={`relative transition-all duration-700 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              {content.image_url ? (
                <img
                  src={content.image_url}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <span className="text-3xl">🏥</span>
                    </div>
                    <p className="text-sm text-text-secondary tracking-tight">FADAI Komandası</p>
                  </div>
                </div>
              )}
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/[0.06] dark:bg-primary/[0.1] rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div
            className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-text-primary mb-6 leading-tight">
              {content.title}
            </h2>
            <p className="text-lg text-text-secondary tracking-tight leading-relaxed mb-8">
              {content.description}
            </p>
            {content.cta_text && content.cta_url && (
              <Link
                href={content.cta_url}
                className="inline-flex items-center gap-2 text-primary font-medium tracking-tight hover:gap-3 transition-all duration-200"
              >
                {content.cta_text}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
