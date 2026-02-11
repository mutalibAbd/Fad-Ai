'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTeamMember(data: {
  name: string
  role: string
  bio?: string
  image_url?: string
  linkedin_url?: string
  sort_order?: number
  is_visible?: boolean
}) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('team_members') as any).insert(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/about')
  revalidatePath('/admin/dashboard/about')
  return { success: true }
}

export async function updateTeamMember(id: string, data: {
  name?: string
  role?: string
  bio?: string | null
  image_url?: string | null
  linkedin_url?: string | null
  sort_order?: number
  is_visible?: boolean
}) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('team_members') as any).update(data).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/about')
  revalidatePath('/admin/dashboard/about')
  return { success: true }
}

export async function deleteTeamMember(id: string) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('team_members') as any).delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/about')
  revalidatePath('/admin/dashboard/about')
  return { success: true }
}
