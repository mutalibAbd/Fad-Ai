import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ServiceCategoryListClient from './ServiceCategoryListClient';

export const metadata = {
  title: 'Xidmətlər | Admin | FADAI',
};

export const dynamic = 'force-dynamic';

type CategoryRow = Database['public']['Tables']['service_categories']['Row'];
type ServiceRow = Database['public']['Tables']['services']['Row'];

export default async function AdminServicesPage() {
  const supabase = createAdminClient();

  const { data: categories } = await supabase
    .from('service_categories')
    .select('*')
    .order('sort_order', { ascending: true }) as { data: CategoryRow[] | null };

  const { data: services } = await supabase
    .from('services')
    .select('id, category_id')
    .order('sort_order', { ascending: true }) as { data: Pick<ServiceRow, 'id' | 'category_id'>[] | null };

  // Count services per category
  const countMap: Record<string, number> = {};
  (services ?? []).forEach((svc) => {
    if (svc.category_id) {
      countMap[svc.category_id] = (countMap[svc.category_id] || 0) + 1;
    }
  });

  const categoriesWithCount = (categories ?? []).map((cat) => ({
    id: cat.id,
    icon: cat.icon,
    title: cat.title,
    slug: cat.slug,
    sort_order: cat.sort_order,
    is_visible: cat.is_visible,
    serviceCount: countMap[cat.id] || 0,
  }));

  return (
    <div>
      <AdminPageHeader
        title="Xidmətlər"
        createHref="/admin/dashboard/services/new"
        createLabel="Yeni kateqoriya"
      />
      <ServiceCategoryListClient categories={categoriesWithCount} />
    </div>
  );
}
