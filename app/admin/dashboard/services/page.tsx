import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ServiceListClient from './ServiceListClient';

export const metadata = {
  title: 'Xidmətlər | Admin | FADAI',
};

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  const supabase = createAdminClient();
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true }) as { data: Database['public']['Tables']['services']['Row'][] | null };

  const { data: categories } = await supabase
    .from('service_categories')
    .select('id, title')
    .order('sort_order', { ascending: true }) as { data: { id: string; title: string }[] | null };

  // Build a category map for display
  const categoryMap: Record<string, string> = {};
  (categories ?? []).forEach((cat) => {
    categoryMap[cat.id] = cat.title;
  });

  return (
    <div>
      <AdminPageHeader
        title="Xidmətlər"
        createHref="/admin/dashboard/services/new"
        createLabel="Yeni xidmət"
      />
      <ServiceListClient services={services ?? []} categoryMap={categoryMap} />
    </div>
  );
}
