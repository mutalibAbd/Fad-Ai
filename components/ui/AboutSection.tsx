'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Users, Target, Globe, Award, type LucideIcon } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  icon?: string;
}

interface AboutSectionProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  stats?: StatItem[];
}

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  target: Target,
  globe: Globe,
  award: Award,
};

function getStatIcon(iconName?: string): LucideIcon {
  if (!iconName) return Target;
  return iconMap[iconName.toLowerCase()] ?? Target;
}

export default function AboutSection({
  title = 'Biz kimik?',
  description = 'FADAI tibbi görüntüləmə sahəsində süni intellekt texnologiyalarını tətbiq edən innovativ şirkətdir.',
  imageUrl = '',
  ctaText = 'Daha ətraflı',
  ctaUrl = '/about',
  stats = [],
}: AboutSectionProps) {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900">
      <div className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left column */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {title}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              {description}
            </p>

            {stats.length > 0 && (
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => {
                  const Icon = getStatIcon(stat.icon);
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-8">
              <Link
                href={ctaUrl}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors duration-200"
              >
                {ctaText}
              </Link>
            </div>
          </div>

          {/* Right column */}
          <div>
            {imageUrl ? (
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="rounded-2xl shadow-2xl object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] w-full rounded-2xl shadow-2xl bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-900" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
