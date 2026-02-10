'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ProjectStatus } from '@/lib/supabase/database.types'

export async function createProject(data: {
  title: string
  summary?: string
  status?: ProjectStatus
  is_visible?: boolean
  image_url?: string
}) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('projects') as any).insert(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/projects')
  revalidatePath('/admin/dashboard/projects')
  return { success: true }
}

export async function updateProject(id: string, data: {
  title?: string
  summary?: string
  status?: ProjectStatus
  is_visible?: boolean
  image_url?: string
}) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('projects') as any).update(data).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/projects')
  revalidatePath('/admin/dashboard/projects')
  return { success: true }
}

export async function deleteProject(id: string) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('projects') as any).delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/projects')
  revalidatePath('/admin/dashboard/projects')
  return { success: true }
}

export async function toggleProjectVisibility(id: string, is_visible: boolean) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('projects') as any).update({ is_visible }).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/projects')
  revalidatePath('/admin/dashboard/projects')
  return { success: true }
}
