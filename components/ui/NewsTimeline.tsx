'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import type { News } from '@/lib/types';

interface NewsTimelineProps {
  articles: News[];
  title?: string;
}

export default function NewsTimeline({ articles, title = 'Xəbərlər' }: NewsTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  if (articles.length === 0) return null;

  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tighter text-text-primary text-center mb-16">
          {title}
        </h2>

        <div ref={containerRef} className="relative">
          {/* Static background line */}
          <div className="absolute left-5 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-slate-200/50 dark:bg-slate-700/50" />

          {/* Animated glowing fill line */}
          <motion.div
            className="absolute left-5 md:left-1/2 md:-translate-x-px top-0 w-0.5 bg-primary"
            style={{
              height: lineHeight,
              boxShadow: '0 0 8px var(--primary), 0 0 20px var(--primary)',
            }}
          />

          {/* Timeline items */}
          <div className="space-y-12 md:space-y-16">
            {articles.map((article, index) => (
              <TimelineItem
                key={article.id}
                article={article}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ article, index }: { article: News; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn', 'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'];
  const d = new Date(article.published_at);
  const date = `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;

  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="relative">
      {/* Glowing dot on the timeline */}
      <div
        className={`absolute left-5 md:left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full transition-all duration-500 z-10 ${
          isInView
            ? 'bg-primary shadow-[0_0_10px_var(--primary),0_0_20px_var(--primary)]'
            : 'bg-slate-300 dark:bg-slate-600'
        }`}
        style={{ top: '4px' }}
      />

      {/* Mobile layout: always to the right of the line */}
      <div className="md:hidden pl-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <time className="text-xs font-medium uppercase tracking-widest text-text-secondary mb-2 block">
            {date}
          </time>
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded mb-3">
            Xəbər
          </span>
          <Link href={`/news/${article.slug}`} className="block group">
            <h3 className="text-lg font-semibold tracking-tight text-text-primary group-hover:text-primary transition-colors mb-2">
              {article.title}
            </h3>
            {article.summary && (
              <p className="text-sm text-text-secondary tracking-tight line-clamp-2">
                {article.summary}
              </p>
            )}
          </Link>
        </motion.div>
      </div>

      {/* Desktop layout: alternating left/right */}
      <div className="hidden md:flex items-start">
        {/* Left side */}
        <div className={`w-[calc(50%-2rem)] ${isEven ? 'pr-8' : ''}`}>
          {isEven && (
            <motion.div
              className="text-right"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <time className="text-xs font-medium uppercase tracking-widest text-text-secondary mb-2 block">
                {date}
              </time>
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded mb-3">
                Xəbər
              </span>
              <Link href={`/news/${article.slug}`} className="block group">
                <h3 className="text-lg font-semibold tracking-tight text-text-primary group-hover:text-primary transition-colors mb-2">
                  {article.title}
                </h3>
                {article.summary && (
                  <p className="text-sm text-text-secondary tracking-tight line-clamp-2">
                    {article.summary}
                  </p>
                )}
              </Link>
            </motion.div>
          )}
        </div>

        {/* Center gap for the line */}
        <div className="w-16 flex-shrink-0" />

        {/* Right side */}
        <div className={`w-[calc(50%-2rem)] ${!isEven ? 'pl-8' : ''}`}>
          {!isEven && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <time className="text-xs font-medium uppercase tracking-widest text-text-secondary mb-2 block">
                {date}
              </time>
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded mb-3">
                Xəbər
              </span>
              <Link href={`/news/${article.slug}`} className="block group">
                <h3 className="text-lg font-semibold tracking-tight text-text-primary group-hover:text-primary transition-colors mb-2">
                  {article.title}
                </h3>
                {article.summary && (
                  <p className="text-sm text-text-secondary tracking-tight line-clamp-2">
                    {article.summary}
                  </p>
                )}
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
