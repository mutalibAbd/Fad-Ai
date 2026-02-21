'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useTheme } from 'next-themes';
import type { ISourceOptions } from '@tsparticles/engine';

interface AboutSectionProps {
  title?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export default function AboutSection({
  title = 'Sahəsində Ən Yaxşı Mütəxəssislər İlə Probleminizi Həll Edirik',
  ctaText = 'Biz Kimik?',
  ctaUrl = '/about',
}: AboutSectionProps) {
  const [engineReady, setEngineReady] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setEngineReady(true));
  }, []);

  const isDark = resolvedTheme === 'dark';
  const particleColor = isDark ? '#ffffff' : '#1D1D1F';
  const lineColor = isDark ? '#ffffff' : '#1D1D1F';

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: 'transparent' } },
      particles: {
        number: { value: 80, density: { enable: true } },
        color: { value: particleColor },
        links: {
          enable: true,
          color: lineColor,
          distance: 150,
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.8,
          outModes: { default: 'bounce' as const },
        },
        size: { value: { min: 1, max: 3 } },
        opacity: { value: 0.4 },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'grab' as const },
        },
        modes: {
          grab: { distance: 200, links: { opacity: 0.5 } },
        },
      },
      detectRetina: true,
    }),
    [particleColor, lineColor]
  );

  return (
    <section className="relative py-32 md:py-40 bg-background overflow-hidden min-h-[50vh] flex items-center">
      {/* Particles background */}
      {engineReady && (
        <Particles
          className="absolute inset-0"
          style={{ zIndex: 0 }}
          options={options}
        />
      )}

      {/* Content overlay */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary mb-12 leading-[1.15]"
          style={{ wordSpacing: '0.15em' }}
        >
          {title}
        </h2>
        <Link
          href={ctaUrl}
          className="inline-block bg-primary text-white px-10 py-5 rounded-xl text-lg font-semibold tracking-tight hover:bg-primary-600 hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
        >
          {ctaText}
        </Link>
      </div>
    </section>
  );
}
