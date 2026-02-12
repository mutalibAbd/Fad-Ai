import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import NewsForm from '@/components/admin/NewsForm';

export const metadata = {
  title: 'Xəbəri Redaktə Et | Admin | FADAI',
};

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: newsItem } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single() as { data: Database['public']['Tables']['news']['Row'] | null };

  if (!newsItem) notFound();

  return (
    <div>
      <AdminPageHeader title="Xəbəri Redaktə Et" />
      <NewsForm
        initialData={{
          id: newsItem.id,
          title: newsItem.title ?? '',
          slug: newsItem.slug ?? '',
          summary: newsItem.summary ?? '',
          content: newsItem.content ?? '',
          image_url: newsItem.image_url ?? '',
          published_at: newsItem.published_at ?? new Date().toISOString().slice(0, 16),
          is_visible: newsItem.is_visible ?? true,
        }}
      />
    </div>
  );
}
