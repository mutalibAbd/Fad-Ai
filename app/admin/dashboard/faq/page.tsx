import { getFAQItems } from '@/lib/queries/site-settings';
import FAQEditorClient from './FAQEditorClient';

export const metadata = {
  title: 'FAQ | Admin | FADAI',
};

export const dynamic = 'force-dynamic';

const fallbackItems = [
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

export default async function AdminFAQPage() {
  const items = await getFAQItems();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
        FAQ Redaktəsi
      </h1>
      <FAQEditorClient initialItems={items.length > 0 ? items : fallbackItems} />
    </div>
  );
}
