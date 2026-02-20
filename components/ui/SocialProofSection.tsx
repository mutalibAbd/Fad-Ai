'use client';

import { useEffect, useState } from 'react';
import type { SocialProofContent, StatItem } from '@/lib/types';

interface SocialProofSectionProps {
  content: SocialProofContent;
  stats: StatItem[];
}

export default function SocialProofSection({ content, stats }: SocialProofSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render if there's nothing to show
  if (content.logos.length === 0 && stats.length === 0) return null;

  return (
    <section className="py-16 bg-background border-y border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        {content.title && (
          <p
            className={`text-sm font-medium text-text-secondary tracking-tight text-center mb-10 uppercase transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
          >
            {content.title}
          </p>
        )}

        {/* Stats Row */}
        {stats.length > 0 && (
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-semibold tracking-tighter text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary tracking-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Logo Strip */}
        {content.logos.length > 0 && (
          <div
            className={`flex flex-wrap items-center justify-center gap-8 md:gap-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            {content.logos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-10 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 dark:invert dark:opacity-70 dark:hover:invert-0 dark:hover:opacity-100 transition-all duration-300"
              >
                {logo.image_url ? (
                  <img
                    src={logo.image_url}
                    alt={logo.name}
                    className="h-full w-auto object-contain"
                  />
                ) : (
                  <span className="text-sm font-medium text-text-secondary tracking-tight px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 dark:text-slate-300">
                    {logo.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
