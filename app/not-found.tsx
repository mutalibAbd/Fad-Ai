import { GlassHeader } from '@/components/ui';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center py-24">
          <p className="text-8xl font-semibold tracking-tight text-primary/20 mb-4">
            404
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-text-primary mb-6">
            Səhifə tapılmadı
          </h1>
          <p className="text-xl text-text-secondary tracking-tight mb-12 leading-relaxed">
            Axtardığınız səhifə mövcud deyil və ya köçürülmüşdür.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-white px-8 py-4 rounded-2xl font-medium tracking-tight hover:bg-primary-600 transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
          >
            Ana Səhifəyə Qayıt
          </Link>
        </div>
      </main>
    </>
  );
}
