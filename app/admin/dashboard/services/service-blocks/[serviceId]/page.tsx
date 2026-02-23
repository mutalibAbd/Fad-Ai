import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { getAllPageBlocks } from '@/lib/queries/page-blocks';
import PageBlocksEditorClient from '@/components/admin/PageBlocksEditorClient';

export const metadata = {
  title: 'Xidmət Blokları | Admin | FADAI',
};

type ServiceRow = Database['public']['Tables']['services']['Row'];

export default async function ServiceBlocksPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  const supabase = createAdminClient();

  const { data: service } = await supabase
    .from('services')
    .select('id, title, slug')
    .eq('id', serviceId)
    .single() as { data: Pick<ServiceRow, 'id' | 'title' | 'slug'> | null };

  if (!service) notFound();

  const pageSlug = `services/${service.slug}`;
  const blocks = await getAllPageBlocks(pageSlug);

  return (
    <div>
      <AdminPageHeader title={`${service.title} — Səhifə Blokları`} />
      <div className="max-w-2xl">
        <PageBlocksEditorClient initialBlocks={blocks} pageSlug={pageSlug} />
      </div>
    </div>
  );
}
