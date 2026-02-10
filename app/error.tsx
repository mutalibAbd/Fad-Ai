'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center py-24">
        <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-8">
          <span className="text-4xl">⚠️</span>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-text-primary mb-6">
          Xəta baş verdi
        </h1>
        <p className="text-lg text-text-secondary tracking-tight mb-8 leading-relaxed">
          Gözlənilməz xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.
        </p>
        <button
          onClick={() => reset()}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-medium tracking-tight hover:bg-primary-600 transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
        >
          Yenidən cəhd et
        </button>
      </div>
    </main>
  );
}
