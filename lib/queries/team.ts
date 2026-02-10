import { createClient } from '@/lib/supabase/server'
import type { TeamMember } from '@/lib/types'

export type { TeamMember }

export async function getVisibleTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createClient()

  const { data, error } = await (supabase
    .from('team_members') as any)
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching team members:', error)
    return []
  }

  return data || []
}
