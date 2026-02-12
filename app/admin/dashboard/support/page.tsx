import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import SupportListClient from './SupportListClient';

export const metadata = {
  title: 'Dəstək | Admin | FADAI',
};

export const dynamic = 'force-dynamic';

export default async function AdminSupportPage() {
  const supabase = createAdminClient();
  const { data: supportTypes } = await supabase
    .from('support_types')
    .select('*')
    .order('sort_order', { ascending: true }) as { data: Database['public']['Tables']['support_types']['Row'][] | null };

  return (
    <div>
      <AdminPageHeader
        title="Dəstək Növləri"
        createHref="/admin/dashboard/support/new"
        createLabel="Yeni dəstək növü"
      />
      <SupportListClient supportTypes={supportTypes ?? []} />
    </div>
  );
}
