'use client';

import Link from 'next/link';
import {
  Headset,
  FileText,
  ShieldCheck,
  Wrench,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Settings,
  Phone,
  Mail,
  Monitor,
  Heart,
  Stethoscope,
  Clock,
  Users,
} from 'lucide-react';
import type { SupportType } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Headset,
  FileText,
  ShieldCheck,
  Wrench,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Settings,
  Phone,
  Mail,
  Monitor,
  Heart,
  Stethoscope,
  Clock,
  Users,
};

interface SupportSectionProps {
  supportTypes: SupportType[];
  title?: string;
}

export default function SupportSection({ supportTypes, title = 'Dəstək' }: SupportSectionProps) {
  // Filter out any DB-driven FAQ entry to avoid duplicates with the hardcoded one
  const filteredTypes = supportTypes.filter(
    (type) => type.slug !== 'tez-tez-verilen-suallar',
  );

  return (
    <section className="py-28 md:py-32 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter text-text-primary text-center mb-20">
          {title}
        </h2>

        <div className="flex flex-wrap justify-center gap-12 lg:gap-16">
          {filteredTypes.map((type) => {
            const Icon = iconMap[type.icon] ?? Headset;
            return (
              <Link
                key={type.id}
                href="/contact"
                className="text-center space-y-5 w-64 group"
              >
                <div className="flex justify-center">
                  <Icon className="w-14 h-14 text-text-primary dark:text-slate-300 group-hover:text-primary transition-colors duration-200" strokeWidth={1.8} />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-text-primary group-hover:text-primary transition-colors duration-200">
                  {type.title}
                </h3>
                {type.description && (
                  <p className="text-base text-slate-600 dark:text-slate-400 tracking-tight leading-relaxed max-w-xs mx-auto">
                    {type.description}
                  </p>
                )}
              </Link>
            );
          })}

          {/* FAQ card — always visible, not admin-controlled
          <Link
            href="/faq"
            className="text-center space-y-5 w-64 group"
          >
            <div className="flex justify-center">
              <HelpCircle className="w-14 h-14 text-text-primary dark:text-slate-300 group-hover:text-primary transition-colors duration-200" strokeWidth={1.8} />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-text-primary group-hover:text-primary transition-colors duration-200">
              Tez-tez Verilən Suallar
            </h3>
            <p className="text-base text-slate-600 dark:text-slate-400 tracking-tight leading-relaxed max-w-xs mx-auto">
              Ən çox soruşulan suallar vəcavabları
            </p>
          </Link> */}
        </div>
      </div>
    </section>
  );
}
