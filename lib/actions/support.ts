'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSupportType(data: {
  title: string
  slug: string
  description?: string
  content?: string
  image_url?: string
  sort_order?: number
  is_visible?: boolean
}) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('support_types') as any).insert(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/support')
  revalidatePath('/admin/dashboard/support')
  return { success: true }
}

export async function updateSupportType(id: string, data: {
  title?: string
  slug?: string
  description?: string
  content?: string
  image_url?: string | null
  sort_order?: number
  is_visible?: boolean
}) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('support_types') as any).update(data).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/support')
  revalidatePath(`/support/${data.slug}`)
  revalidatePath('/admin/dashboard/support')
  return { success: true }
}

export async function deleteSupportType(id: string) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('support_types') as any).delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/support')
  revalidatePath('/admin/dashboard/support')
  return { success: true }
}
