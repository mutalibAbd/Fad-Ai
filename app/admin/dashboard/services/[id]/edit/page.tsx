import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
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
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
        Xidməti Redaktə Et
      </h1>
      <ServiceForm
        initialData={{
          id: service.id,
          icon: service.icon ?? '',
          title: service.title ?? '',
          description: service.description ?? '',
          details,
          image_url: (service as any).image_url ?? '',
          sort_order: service.sort_order ?? 0,
          is_visible: service.is_visible ?? true,
        }}
      />
    </div>
  );
}
