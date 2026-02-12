import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ServiceForm from '@/components/admin/ServiceForm';

export const metadata = {
  title: 'Xidməti Redaktə Et | Admin | FADAI',
};

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single() as { data: Database['public']['Tables']['services']['Row'] | null };

  if (!service) notFound();

  const { data: categories } = await supabase
    .from('service_categories')
    .select('id, title')
    .order('sort_order', { ascending: true }) as { data: { id: string; title: string }[] | null };

  // Parse details JSONB - could be a JSON string or already an array
  let details: string[] = [];
  if (service.details) {
    if (typeof service.details === 'string') {
      try {
        details = JSON.parse(service.details);
      } catch {
        details = [];
      }
    } else if (Array.isArray(service.details)) {
      details = service.details as string[];
    }
  }

  return (
    <div>
      <AdminPageHeader title="Xidməti Redaktə Et" />
      <ServiceForm
        initialData={{
          id: service.id,
          icon: service.icon ?? '',
          title: service.title ?? '',
          slug: service.slug ?? '',
          description: service.description ?? '',
          content: service.content ?? '',
          details,
          image_url: service.image_url ?? '',
          category_id: service.category_id ?? '',
          sort_order: service.sort_order ?? 0,
          is_visible: service.is_visible ?? true,
        }}
        categories={categories ?? []}
      />
    </div>
  );
}
