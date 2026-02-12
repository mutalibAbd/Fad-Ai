import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import NewsListClient from './NewsListClient';

export const metadata = {
  title: 'Xəbərlər | Admin | FADAI',
};

export const dynamic = 'force-dynamic';

export default async function AdminNewsPage() {
  const supabase = createAdminClient();
  const { data: news } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false }) as { data: Database['public']['Tables']['news']['Row'][] | null };

  return (
    <div>
      <AdminPageHeader
        title="Xəbərlər"
        createHref="/admin/dashboard/news/new"
        createLabel="Yeni xəbər"
      />
      <NewsListClient news={news ?? []} />
    </div>
  );
}
