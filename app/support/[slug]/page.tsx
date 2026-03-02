import { GlassHeader } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSupportBySlug, getAllSupportSlugs } from '@/lib/queries/support';
import { getContactInfo } from '@/lib/queries/site-settings';
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
import type { LucideIcon } from 'lucide-react';
import SupportContactForm from './SupportContactForm';

export const revalidate = 60;

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

const bgColorMap: Record<string, string> = {
  blue: 'from-blue-600 to-blue-800',
  purple: 'from-purple-600 to-purple-800',
  green: 'from-green-600 to-green-800',
  orange: 'from-orange-500 to-orange-700',
  red: 'from-red-600 to-red-800',
  teal: 'from-teal-600 to-teal-800',
};

interface SupportDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSupportSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: SupportDetailPageProps) {
  const { slug } = await params;
  const supportType = await getSupportBySlug(slug);

  if (!supportType) {
    return { title: 'Dəstək tapılmadı | FADAI' };
  }

  return {
    title: `${supportType.title} | Dəstək | FADAI`,
    description: supportType.description || 'FADAI dəstək xidməti',
  };
}

export default async function SupportDetailPage({ params }: SupportDetailPageProps) {
  const { slug } = await params;
  const [supportType, contactInfo] = await Promise.all([
    getSupportBySlug(slug),
    getContactInfo(),
  ]);

  if (!supportType) {
    notFound();
  }

  const Icon = iconMap[supportType.icon] ?? Headset;
  const gradientClasses = bgColorMap[supportType.color ?? ''] ?? bgColorMap.blue;

  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className={`py-20 bg-gradient-to-br ${gradientClasses}`}>
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-white mb-4">
              {supportType.title}
            </h1>
            {supportType.description && (
              <p className="text-xl text-white/80 tracking-tight max-w-2xl mx-auto">
                {supportType.description}
              </p>
            )}
          </div>
        </section>

        {/* 2-Column Layout */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Content & Form */}
            <div className="lg:col-span-2 space-y-12">
              {/* Content Section */}
              {supportType.content && (
                <div className="prose prose-lg prose-slate max-w-none text-text-secondary tracking-tight leading-relaxed whitespace-pre-line">
                  {supportType.content}
                </div>
              )}

              {/* Contact Form */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8 lg:p-12">
                <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-2">
                  Dəstək Sorğusu Göndərin
                </h2>
                <p className="text-text-secondary tracking-tight mb-8">
                  Aşağıdakı formu doldurun, komandamız ən qısa zamanda sizə cavab verəcək.
                </p>
                <SupportContactForm />
              </div>
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                  <h3 className="text-xl font-semibold tracking-tight mb-6">
                    Bizimlə əlaqə
                  </h3>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-white/80 shrink-0" />
                      <span className="text-white/90 tracking-tight">
                        {contactInfo.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-white/80 shrink-0" />
                      <span className="text-white/90 tracking-tight">
                        {contactInfo.email}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="block w-full text-center bg-white text-gray-900 font-medium px-6 py-3 rounded-xl hover:bg-white/90 transition-colors duration-200 tracking-tight"
                  >
                    Əlaqə Səhifəsi
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
