'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface ServiceSectionProps {
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  details: string[];
  index: number;
}

export default function ServiceSection({
  title,
  description,
  icon,
  imageUrl,
  details,
  index,
}: ServiceSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const isEven = index % 2 === 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`py-24 ${isEven ? 'bg-background-light' : 'bg-background'}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Side */}
          <div
            className={`${isEven ? 'lg:order-2' : ''} transition-all duration-700 ease-out ${
              visible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            {icon && (
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-2xl">{icon}</span>
              </div>
            )}

            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-6">
              {title}
            </h2>

            <p className="text-lg text-text-secondary tracking-tight leading-relaxed mb-8">
              {description}
            </p>

            {details.length > 0 && (
              <ul className="space-y-3">
                {details.map((detail, i) => (
                  <li
                    key={i}
                    className="text-text-secondary tracking-tight flex items-start transition-all duration-500 ease-out"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'translateX(0)' : 'translateX(-12px)',
                      transitionDelay: visible ? `${300 + i * 80}ms` : '0ms',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Image Side */}
          <div
            className={`${isEven ? 'lg:order-1' : ''} transition-all duration-700 ease-out ${
              visible
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-12 scale-[0.97]'
            }`}
            style={{ transitionDelay: visible ? '150ms' : '0ms' }}
          >
            {imageUrl ? (
              <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative aspect-[4/3]">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="rounded-2xl bg-primary/5 border border-slate-100 flex items-center justify-center aspect-[4/3]">
                {icon ? (
                  <span className="text-8xl opacity-30">{icon}</span>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-primary/10" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
