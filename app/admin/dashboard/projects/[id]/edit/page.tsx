import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import ProjectForm from '@/components/admin/ProjectForm';

export const metadata = {
  title: 'Layihəni Redaktə Et | Admin | FADAI',
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single() as { data: Database['public']['Tables']['projects']['Row'] | null };

  if (!project) notFound();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
        Layihəni Redaktə Et
      </h1>
      <ProjectForm
        initialData={{
          id: project.id,
          title: project.title,
          summary: project.summary ?? '',
          status: project.status,
          image_url: project.image_url ?? '',
          is_visible: project.is_visible ?? true,
        }}
      />
    </div>
  );
}
