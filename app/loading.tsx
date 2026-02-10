export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="h-8 w-24 bg-slate-200 rounded-lg animate-pulse" />
          <div className="hidden md:flex items-center gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-5 w-20 bg-slate-200 rounded animate-pulse" />
            ))}
          </div>
          <div className="h-10 w-20 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Hero Skeleton */}
      <section className="py-24 bg-background-light">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="h-12 w-64 bg-slate-200 rounded-xl animate-pulse mx-auto mb-6" />
          <div className="h-6 w-96 bg-slate-200 rounded animate-pulse mx-auto" />
        </div>
      </section>

      {/* Content Grid Skeleton */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-slate-100 shadow-sm p-8"
              >
                <div className="w-16 h-16 bg-slate-200 rounded-2xl animate-pulse mb-6" />
                <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-3" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
