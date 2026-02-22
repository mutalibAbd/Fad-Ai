import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import { getAllPageBlocks } from '@/lib/queries/page-blocks';
import PageBlocksEditorClient from './PageBlocksEditorClient';
import TeamMembersEditorClient from './TeamMembersEditorClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Haqqımızda | Admin | FADAI',
};

export default async function AdminAboutPage() {
  const supabase = createAdminClient();
  const blocks = await getAllPageBlocks('about');
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('*')
    .order('sort_order', { ascending: true }) as { data: Database['public']['Tables']['team_members']['Row'][] | null };

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
        Haqqımızda Səhifəsi
      </h1>
      <div className="space-y-10 max-w-2xl">
        <PageBlocksEditorClient initialBlocks={blocks} pageSlug="about" />
        <TeamMembersEditorClient teamMembers={teamMembers ?? []} />
      </div>
    </div>
  );
}
