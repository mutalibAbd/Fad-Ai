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
              group rounded-xl bg-white dark:bg-slate-800 shadow-lg overflow-hidden
              hover:shadow-xl hover:-translate-y-1 transition-all duration-300
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
            style={{
              transition: 'opacity 0.5s ease-out, transform 0.5s ease-out, box-shadow 0.3s ease',
            }}
          >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900" />
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Date */}
              <time className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(item.published_at).toLocaleDateString('az-AZ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-2 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>

              {/* Summary */}
              {item.summary && (
                <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                  {item.summary}
                </p>
              )}

              {/* Read more indicator */}
              <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                Oxu →
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
