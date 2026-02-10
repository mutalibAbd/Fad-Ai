import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/supabase/database.types';

export type Project = Database['public']['Tables']['projects']['Row'];

/**
 * Fetch all visible projects from Supabase
 * 
 * Backend Query Logic:
 * - Filter: is_visible = true
 * - Order: created_at DESC (newest first)
 * - Uses Server-side Supabase client
 */
export async function getVisibleProjects(): Promise<Project[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}

/**
 * Filter projects by status (client-side utility)
 */
export function filterProjectsByStatus(
  projects: Project[],
  status: Project['status'] | 'all'
): Project[] {
  if (status === 'all') return projects;
  return projects.filter((project) => project.status === status);
}
