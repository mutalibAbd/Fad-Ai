'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markAsRead(id: string) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('contact_submissions') as any)
    .update({ is_read: true })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/dashboard/contacts')
  return { success: true }
}

export async function markAsUnread(id: string) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('contact_submissions') as any)
    .update({ is_read: false })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/dashboard/contacts')
  return { success: true }
}

export async function deleteSubmission(id: string) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('contact_submissions') as any)
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/dashboard/contacts')
  return { success: true }
}
