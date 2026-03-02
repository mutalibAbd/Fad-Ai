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

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  teal: 'bg-teal-500',
};

interface SupportSectionProps {
  supportTypes: SupportType[];
  title?: string;
}

export default function SupportSection({ supportTypes, title = 'D\u0259st\u0259k' }: SupportSectionProps) {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredTypes.map((type) => {
            const Icon = iconMap[type.icon] ?? Headset;
            const bgColor = colorMap[type.color ?? ''] ?? 'bg-blue-500';
            return (
              <Link
                key={type.id}
                href={`/support/${type.slug}`}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 text-center"
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${bgColor}`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {type.title}
                </h3>
                {type.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {type.description}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
