import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import { getAboutContent, getAboutStats } from '@/lib/queries/site-settings';
import AboutEditorClient from './AboutEditorClient';

export const metadata = {
  title: 'Haqqımızda | Admin | FAD-AI',
};

export default async function AdminAboutPage() {
  const supabase = createAdminClient();
  const about = await getAboutContent();
  const stats = await getAboutStats();
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('*')
    .order('sort_order', { ascending: true }) as { data: Database['public']['Tables']['team_members']['Row'][] | null };

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
        Haqqımızda Səhifəsi
      </h1>
      <AboutEditorClient
        about={about}
        stats={stats}
        teamMembers={teamMembers ?? []}
      />
    </div>
  );
}
