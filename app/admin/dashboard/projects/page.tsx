import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ProjectListClient from './ProjectListClient';

export const metadata = {
  title: 'Layihələr | Admin | FAD-AI',
};

export default async function AdminProjectsPage() {
  const supabase = createAdminClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false }) as { data: Database['public']['Tables']['projects']['Row'][] | null };

  return (
    <div>
      <AdminPageHeader
        title="Layihələr"
        createHref="/admin/dashboard/projects/new"
        createLabel="Yeni layihə"
      />
      <ProjectListClient projects={projects ?? []} />
    </div>
  );
}
