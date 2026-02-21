import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ServiceCategoryEditorClient from './ServiceCategoryEditorClient';

export const metadata = {
  title: 'Kateqoriya Redaktəsi | Admin | FADAI',
};

type CategoryRow = Database['public']['Tables']['service_categories']['Row'];
type ServiceRow = Database['public']['Tables']['services']['Row'];

function parseDetails(details: unknown): string[] {
  if (!details) return [];
  if (typeof details === 'string') {
    try { return JSON.parse(details); } catch { return []; }
  }
  if (Array.isArray(details)) return details as string[];
  return [];
}

export default async function EditServiceCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  // Fetch category
  const { data: category } = await supabase
    .from('service_categories')
    .select('*')
    .eq('id', id)
    .single() as { data: CategoryRow | null };

  if (!category) notFound();

  // Fetch services belonging to this category
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('category_id', id)
    .order('sort_order', { ascending: true }) as { data: ServiceRow[] | null };

  const serializedServices = (services ?? []).map((svc) => ({
    id: svc.id,
    icon: svc.icon ?? '',
    title: svc.title ?? '',
    slug: svc.slug ?? '',
    description: svc.description ?? '',
    content: svc.content ?? '',
    details: parseDetails(svc.details),
    image_url: svc.image_url ?? '',
    sort_order: svc.sort_order ?? 0,
    is_visible: svc.is_visible ?? true,
  }));

  return (
    <div>
      <AdminPageHeader title={`${category.title} — Redaktə`} />
      <ServiceCategoryEditorClient
        category={{
          id: category.id,
          title: category.title,
          slug: category.slug,
          icon: category.icon ?? '',
          description: category.description ?? '',
          image_url: category.image_url ?? '',
          sort_order: category.sort_order ?? 0,
          is_visible: category.is_visible ?? true,
        }}
        initialServices={serializedServices}
      />
    </div>
  );
}
