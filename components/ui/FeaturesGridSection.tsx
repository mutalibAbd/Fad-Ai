'use client';

import { useEffect, useState } from 'react';
import { SoftCard } from '@/components/ui';
import type { FeaturesGridContent } from '@/lib/types';

interface FeaturesGridSectionProps {
  content: FeaturesGridContent;
}

export default function FeaturesGridSection({ content }: FeaturesGridSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (content.features.length === 0) return null;

  return (
    <section className="py-24 bg-background-light">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-text-primary mb-4 leading-tight">
            {content.title}
          </h2>
          {content.subtitle && (
            <p className="text-lg text-text-secondary tracking-tight leading-relaxed">
              {content.subtitle}
            </p>
          )}
        </div>

        {/* Features Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[minmax(0,1fr)]">
          {content.features.map((feature, index) => {
            // Simple Bento Pattern Logic
            // Index 0: Large (md:col-span-4)
            // Index 1: Medium (md:col-span-2)
            // Index 2: Medium (md:col-span-3)
            // Index 3: Medium (md:col-span-3)
            // Others: Default (md:col-span-2)

            let spanClass = 'md:col-span-2';
            if (index === 0) spanClass = 'md:col-span-4'; // Hero feature
            else if (index === 1) spanClass = 'md:col-span-2';
            else if (index === 2) spanClass = 'md:col-span-3';
            else if (index === 3) spanClass = 'md:col-span-3';

            // If less than 4 items, simpler grid
            if (content.features.length <= 3) {
              spanClass = 'md:col-span-2';
              if (content.features.length === 3 && index === 0) spanClass = 'md:col-span-6'; // Full width for 1st of 3
            }

            return (
              <div
                key={index}
                className={`transition-all duration-500 ${spanClass} ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                style={{ transitionDelay: mounted ? `${index * 100}ms` : '0ms' }}
              >
                <SoftCard className="p-8 h-full flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                      <span className="text-2xl">{feature.icon || '✨'}</span>
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight text-text-primary mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary tracking-tight leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </SoftCard>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
