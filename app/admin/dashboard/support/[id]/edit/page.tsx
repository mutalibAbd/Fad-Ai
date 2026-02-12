import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import SupportForm from '@/components/admin/SupportForm';

export const metadata = {
  title: 'Dəstək Növünü Redaktə Et | Admin | FADAI',
};

export default async function EditSupportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: supportType } = await supabase
    .from('support_types')
    .select('*')
    .eq('id', id)
    .single() as { data: Database['public']['Tables']['support_types']['Row'] | null };

  if (!supportType) notFound();

  return (
    <div>
      <AdminPageHeader title="Dəstək Növünü Redaktə Et" />
      <SupportForm
        initialData={{
          id: supportType.id,
          title: supportType.title ?? '',
          slug: supportType.slug ?? '',
          description: supportType.description ?? '',
          content: supportType.content ?? '',
          image_url: supportType.image_url ?? '',
          sort_order: supportType.sort_order ?? 0,
          is_visible: supportType.is_visible ?? true,
        }}
      />
    </div>
  );
}
