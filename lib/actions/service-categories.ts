'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createServiceCategory(data: {
  title: string
  slug: string
  icon?: string
  description?: string
  image_url?: string
  sort_order?: number
  is_visible?: boolean
}) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('service_categories') as any).insert(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/services')
  revalidatePath('/admin/dashboard/service-categories')
  return { success: true }
}

export async function updateServiceCategory(id: string, data: {
  title?: string
  slug?: string
  icon?: string
  description?: string
  image_url?: string | null
  sort_order?: number
  is_visible?: boolean
}) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('service_categories') as any).update(data).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/services')
  revalidatePath('/admin/dashboard/service-categories')
  return { success: true }
}

export async function deleteServiceCategory(id: string) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('service_categories') as any).delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/services')
  revalidatePath('/admin/dashboard/service-categories')
  return { success: true }
}
