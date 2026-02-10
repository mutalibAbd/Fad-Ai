import { GlassHeader, SoftCard } from '@/components/ui';
import Link from 'next/link';
import { getVisibleServices } from '@/lib/queries/services';

export const metadata = {
  title: 'Xidmətlər | FAD-AI',
  description: 'Tibbi görüntüləmə sistemləri üçün peşəkar xidmətlər və konsultasiya',
};

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getVisibleServices();

  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-24 bg-background-light">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-4">
              <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-text-primary mb-6">
                Xidmətlər
              </h1>
              <p className="text-xl text-text-secondary tracking-tight max-w-2xl mx-auto">
                Tibbi görüntüləmə sistemlərinizin səmərəliliyini artırmaq üçün kompleks həllər
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const details = Array.isArray(service.details) ? service.details as string[] : [];
                return (
                  <SoftCard key={service.id} className="p-8 flex flex-col">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                      <span className="text-4xl">{service.icon}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold tracking-tight text-text-primary mb-3">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-text-secondary tracking-tight leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Details List */}
                    {details.length > 0 && (
                      <ul className="space-y-2 mt-auto">
                        {details.map((detail, index) => (
                          <li
                            key={index}
                            className="text-sm text-text-secondary tracking-tight flex items-start"
                          >
                            <span className="text-primary mr-2 flex-shrink-0">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </SoftCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-background-light">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-6">
              Xidmətlərimiz haqqında ətraflı məlumat almaq istəyirsiniz?
            </h2>
            <p className="text-lg text-text-secondary tracking-tight mb-8">
              Komandamız sizə uyğun həll təklif etməyə hazırdır
            </p>
            <Link
              href="/contact"
              className="inline-block bg-primary text-white px-8 py-4 rounded-2xl font-medium tracking-tight hover:bg-primary-600 transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
            >
              Bizimlə Əlaqə Saxlayın
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
