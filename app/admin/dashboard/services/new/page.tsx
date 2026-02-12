import { createAdminClient } from '@/lib/supabase/server';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ServiceForm from '@/components/admin/ServiceForm';

export const metadata = {
  title: 'Yeni Xidmət | Admin | FADAI',
};

export default async function NewServicePage() {
  const supabase = createAdminClient();
  const { data: categories } = await supabase
    .from('service_categories')
    .select('id, title')
    .order('sort_order', { ascending: true }) as { data: { id: string; title: string }[] | null };

  return (
    <div>
      <AdminPageHeader title="Yeni Xidmət" />
      <ServiceForm categories={categories ?? []} />
    </div>
  );
}
