'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createService(data: {
  icon?: string
  title: string
  slug?: string
  description?: string
  content?: string
  details?: string[]
  image_url?: string
  detail_image_url?: string
  category_id?: string
  sort_order?: number
  is_visible?: boolean
}) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('services') as any).insert({
    ...data,
    details: data.details ? JSON.stringify(data.details) : '[]',
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/services')
  revalidatePath('/admin/dashboard/services')
  return { success: true }
}

export async function updateService(id: string, data: {
  icon?: string
  title?: string
  slug?: string
  description?: string
  content?: string
  details?: string[]
  image_url?: string | null
  detail_image_url?: string | null
  category_id?: string | null
  sort_order?: number
  is_visible?: boolean
}) {
  const supabase = createAdminClient()

  const updateData: Record<string, unknown> = { ...data }
  if (data.details) {
    updateData.details = JSON.stringify(data.details)
  }

  const { error } = await (supabase.from('services') as any).update(updateData).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/services')
  revalidatePath('/admin/dashboard/services')
  return { success: true }
}

export async function deleteService(id: string) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('services') as any).delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/services')
  revalidatePath('/admin/dashboard/services')
  return { success: true }
}
