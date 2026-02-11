import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import StandardForm from '@/components/admin/StandardForm';

export const metadata = {
  title: 'Standartı Redaktə Et | Admin | FADAI',
};

export default async function EditStandardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: standard } = await supabase
    .from('standards')
    .select('*')
    .eq('id', id)
    .single() as { data: Database['public']['Tables']['standards']['Row'] | null };

  if (!standard) notFound();

  // Parse features from JSONB - may be a JSON string or already an array
  let features: string[] = [];
  if (standard.features) {
    if (typeof standard.features === 'string') {
      try {
        features = JSON.parse(standard.features);
      } catch {
        features = [];
      }
    } else if (Array.isArray(standard.features)) {
      features = standard.features as string[];
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
        Standartı Redaktə Et
      </h1>
      <StandardForm
        initialData={{
          id: standard.id,
          icon: standard.icon ?? '',
          acronym: standard.acronym ?? '',
          full_name: standard.full_name ?? '',
          title: standard.title ?? '',
          description: standard.description ?? '',
          features,
          category: standard.category ?? 'main',
          az_name: standard.az_name ?? '',
          normal_range: standard.normal_range ?? '',
          measurement: standard.measurement ?? '',
          sort_order: standard.sort_order ?? 0,
          is_visible: standard.is_visible ?? true,
        }}
      />
    </div>
  );
}
