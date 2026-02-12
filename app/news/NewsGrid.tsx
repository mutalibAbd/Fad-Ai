'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  image_url: string | null;
  published_at: string;
}

interface NewsGridProps {
  news: NewsItem[];
}

export default function NewsGrid({ news }: NewsGridProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= news.length) return;

    const timer = setTimeout(() => {
      setVisibleCount((prev) => prev + 1);
    }, 150);

    return () => clearTimeout(timer);
  }, [visibleCount, news.length]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {news.map((item, index) => {
        const isVisible = index < visibleCount;

        return (
          <Link
            key={item.id}
            href={`/news/${item.slug}`}
            className={`
              rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden
              hover:shadow-md hover:-translate-y-1 transition-all duration-300
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
            style={{
              transition: 'opacity 0.5s ease-out, transform 0.5s ease-out, box-shadow 0.3s ease',
            }}
          >
            {/* Image */}
            <div className="relative aspect-[4/3]">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5" />
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Date */}
              <time className="text-xs font-medium text-text-secondary tracking-wide uppercase">
                {new Date(item.published_at).toLocaleDateString('az-AZ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>

              {/* Title */}
              <h3 className="text-lg font-semibold tracking-tight text-text-primary mt-2 mb-2 line-clamp-2">
                {item.title}
              </h3>

              {/* Summary */}
              {item.summary && (
                <p className="text-sm text-text-secondary tracking-tight leading-relaxed line-clamp-3">
                  {item.summary}
                </p>
              )}

              {/* Read more indicator */}
              <span className="inline-block mt-4 text-sm font-medium text-primary tracking-tight">
                Davamını oxu &rarr;
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
