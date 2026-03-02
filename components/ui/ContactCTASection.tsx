import Link from 'next/link';
import { Phone } from 'lucide-react';

interface ContactCTASectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  phoneText?: string;
  phone?: string;
}

export default function ContactCTASection({
  title = 'Bizimlə əlaqə saxlayın',
  subtitle = 'Komandamız sizə kömək etməyə hazırdır. Pulsuz konsultasiya alın.',
  ctaText = 'Əlaqə Formu',
  phoneText = 'Zəng edin',
  phone = '',
}: ContactCTASectionProps) {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              {ctaText}
            </Link>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-900 transition-colors flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                {phoneText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
