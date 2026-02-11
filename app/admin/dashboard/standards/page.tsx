import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StandardListClient from './StandardListClient';

export const metadata = {
  title: 'Standartlar | Admin | FADAI',
};

export default async function AdminStandardsPage() {
  const supabase = createAdminClient();
  const { data: standards } = await supabase
    .from('standards')
    .select('*')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true }) as { data: Database['public']['Tables']['standards']['Row'][] | null };

  return (
    <div>
      <AdminPageHeader
        title="Standartlar"
        createHref="/admin/dashboard/standards/new"
        createLabel="Yeni standart"
      />
      <StandardListClient standards={standards ?? []} />
    </div>
  );
}
