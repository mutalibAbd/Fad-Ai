'use client';

import { motion } from 'framer-motion';
import SoftCard from '@/components/ui/SoftCard';
import type { PageBlock, ValuesGridContent } from '@/lib/types';

interface Props {
  block: PageBlock;
}

export default function ValuesGridSection({ block }: Props) {
  const content = block.content as ValuesGridContent;

  if (content.items.length === 0) return null;

  return (
    <section className="py-16 bg-background-light">
      <div className="max-w-7xl mx-auto px-6">
        {block.title && (
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-12 text-center">
            {block.title}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <SoftCard className="p-8 text-center h-full">
                {item.icon && (
                  <div className="text-4xl mb-4">{item.icon}</div>
                )}
                <h3 className="text-lg md:text-xl font-semibold tracking-tight text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-text-secondary tracking-tight leading-relaxed">
                  {item.description}
                </p>
              </SoftCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
