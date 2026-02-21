import { getFAQItems } from '@/lib/queries/site-settings';
import FAQEditorClient from './FAQEditorClient';

export const metadata = {
  title: 'FAQ | Admin | FADAI',
};

export const dynamic = 'force-dynamic';

export default async function AdminFAQPage() {
  const items = await getFAQItems();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
        FAQ Redaktəsi
      </h1>
      <FAQEditorClient initialItems={items} />
    </div>
  );
}
