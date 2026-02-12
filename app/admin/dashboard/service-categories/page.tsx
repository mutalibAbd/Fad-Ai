import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ServiceCategoryListClient from './ServiceCategoryListClient';

export const metadata = {
  title: 'Xidmət Kateqoriyaları | Admin | FADAI',
};

export const dynamic = 'force-dynamic';

export default async function AdminServiceCategoriesPage() {
  const supabase = createAdminClient();
  const { data: categories } = await supabase
    .from('service_categories')
    .select('*')
    .order('sort_order', { ascending: true }) as { data: Database['public']['Tables']['service_categories']['Row'][] | null };

  return (
    <div>
      <AdminPageHeader
        title="Xidmət Kateqoriyaları"
        createHref="/admin/dashboard/service-categories/new"
        createLabel="Yeni kateqoriya"
      />
      <ServiceCategoryListClient categories={categories ?? []} />
    </div>
  );
}
