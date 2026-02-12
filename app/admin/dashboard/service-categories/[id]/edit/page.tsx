import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ServiceCategoryForm from '@/components/admin/ServiceCategoryForm';

export const metadata = {
  title: 'Kateqoriyanı Redaktə Et | Admin | FADAI',
};

export default async function EditServiceCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: category } = await supabase
    .from('service_categories')
    .select('*')
    .eq('id', id)
    .single() as { data: Database['public']['Tables']['service_categories']['Row'] | null };

  if (!category) notFound();

  return (
    <div>
      <AdminPageHeader title="Kateqoriyanı Redaktə Et" />
      <ServiceCategoryForm
        initialData={{
          id: category.id,
          title: category.title ?? '',
          slug: category.slug ?? '',
          icon: category.icon ?? '',
          description: category.description ?? '',
          image_url: category.image_url ?? '',
          sort_order: category.sort_order ?? 0,
          is_visible: category.is_visible ?? true,
        }}
      />
    </div>
  );
}
