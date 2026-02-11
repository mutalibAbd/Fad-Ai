import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ServiceListClient from './ServiceListClient';

export const metadata = {
  title: 'Xidmətlər | Admin | FADAI',
};

export default async function AdminServicesPage() {
  const supabase = createAdminClient();
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true }) as { data: Database['public']['Tables']['services']['Row'][] | null };

  return (
    <div>
      <AdminPageHeader
        title="Xidmətlər"
        createHref="/admin/dashboard/services/new"
        createLabel="Yeni xidmət"
      />
      <ServiceListClient services={services ?? []} />
    </div>
  );
}
