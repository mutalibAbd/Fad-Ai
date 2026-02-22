'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { PageBlock, ZigzagHeroContent } from '@/lib/types';

interface Props {
  block: PageBlock;
  reverse?: boolean;
}

export default function ZigzagHeroSection({ block, reverse = false }: Props) {
  const content = block.content as ZigzagHeroContent;
  const hasImages = content.images.filter(Boolean).length > 0;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`grid grid-cols-1 ${hasImages ? 'md:grid-cols-2' : ''} gap-12 items-center`}
        >
          {/* Text column */}
          <div className={reverse && hasImages ? 'md:order-2' : ''}>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-6">
              {block.title}
            </h2>
            <p className="text-lg md:text-xl text-text-secondary tracking-tight leading-relaxed">
              {content.text}
            </p>
          </div>

          {/* Images column */}
          {hasImages && (
            <div className={`flex flex-col gap-4 ${reverse ? 'md:order-1' : ''}`}>
              {content.images.filter(Boolean).map((url, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src={url}
                    alt={`${block.title} ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
