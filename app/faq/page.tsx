import { GlassHeader } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import FAQAccordion from './FAQAccordion';
import { getFAQItems } from '@/lib/queries/site-settings';

export const metadata = {
  title: 'Tez-tez Verilən Suallar | FADAI',
  description: 'FADAI haqqında tez-tez verilən suallar və cavablar',
};

export const revalidate = 60;

const fallbackData = [
  {
    question: 'FADAI nədir?',
    answer:
      'FADAI tibbi görüntüləmə sahəsində süni intellekt texnologiyalarını tətbiq edən innovativ bir şirkətdir. Məqsədimiz radiologiya sahəsində dəqiq və sürətli diaqnostika təmin etməkdir.',
  },
  {
    question: 'FADAI məhsulları hansı tibbi müəssisələr üçün nəzərdə tutulub?',
    answer:
      'Məhsullarımız xəstəxanalar, klinikalar, diaqnostika mərkəzləri və radioloji laboratoriyalar üçün nəzərdə tutulub. Hər ölçüdə tibbi müəssisə üçün uyğun həllər təklif edirik.',
  },
  {
    question: 'Süni intellekt diaqnostikası nə dərəcədə dəqiqdir?',
    answer:
      'Süni intellekt alqoritmlərimiz beynəlxalq klinik sınaqlardan keçmişdir və 95%-dən yuxarı dəqiqlik göstəricisi ilə fəaliyyət göstərir. Bununla belə, bütün nəticələr həkim tərəfindən təsdiqlənir.',
  },
  {
    question: 'Məlumatlarımın təhlükəsizliyi necə təmin edilir?',
    answer:
      'Bütün tibbi məlumatlar ən yüksək təhlükəsizlik standartlarına uyğun şifrələnir və qorunur. HIPAA və KVKK tələblərinə tam uyğunluq təmin edilir.',
  },
  {
    question: 'Texniki dəstək necə əldə edə bilərəm?',
    answer:
      'Bizə əlaqə səhifəsi vasitəsilə müraciət edə bilərsiniz. Texniki dəstək komandamız iş günləri ərzində 09:00-dan 18:00-dək xidmətinizdədir.',
  },
  {
    question: 'Pulsuz sınaq mövcuddurmu?',
    answer:
      'Bəli, bütün məhsullarımız üçün pulsuz demo və sınaq müddəti təklif edirik. Ətraflı məlumat üçün bizimlə əlaqə saxlayın.',
  },
];

export default async function FAQPage() {
  const dbItems = await getFAQItems();
  const faqData = dbItems.length > 0 ? dbItems : fallbackData;

  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background">
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              FAQ
            </p>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-text-primary mb-4">
              Tez-tez Verilən Suallar
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 tracking-tight max-w-2xl mx-auto">
              Ən çox soruşulan sualların cavablarını burada tapa bilərsiniz
            </p>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-3xl mx-auto px-6">
            <FAQAccordion items={faqData} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
