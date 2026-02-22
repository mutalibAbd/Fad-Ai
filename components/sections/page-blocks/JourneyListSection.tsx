'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { PageBlock, JourneyListContent } from '@/lib/types';

interface Props {
  block: PageBlock;
}

export default function JourneyListSection({ block }: Props) {
  const content = block.content as JourneyListContent;

  if (content.items.length === 0) return null;

  return (
    <section className="py-16 bg-background-light">
      <div className="max-w-7xl mx-auto px-6">
        {block.title && (
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-12 text-center">
            {block.title}
          </h2>
        )}
        <div className="space-y-8">
          {content.items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col md:flex-row items-center gap-8 bg-card rounded-2xl border border-card-border p-6"
            >
              {item.image_url && (
                <div className="relative w-full md:w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.subtitle}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 192px"
                  />
                </div>
              )}
              <div>
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-text-primary mb-2">
                  {item.subtitle}
                </h3>
                <p className="text-base md:text-lg text-text-secondary tracking-tight leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
