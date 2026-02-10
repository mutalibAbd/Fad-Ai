'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createStandard(data: {
  icon: string
  acronym?: string
  full_name?: string
  title: string
  description?: string
  features?: string[]
  category: string
  az_name?: string
  normal_range?: string
  measurement?: string
  sort_order?: number
  is_visible?: boolean
}) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('standards') as any).insert({
    ...data,
    features: data.features ? JSON.stringify(data.features) : '[]',
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/standards')
  revalidatePath('/admin/dashboard/standards')
  return { success: true }
}

export async function updateStandard(id: string, data: {
  icon?: string
  acronym?: string
  full_name?: string
  title?: string
  description?: string
  features?: string[]
  category?: string
  az_name?: string
  normal_range?: string
  measurement?: string
  sort_order?: number
  is_visible?: boolean
}) {
  const supabase = createAdminClient()

  const updateData: Record<string, unknown> = { ...data }
  if (data.features) {
    updateData.features = JSON.stringify(data.features)
  }

  const { error } = await (supabase.from('standards') as any).update(updateData).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/standards')
  revalidatePath('/admin/dashboard/standards')
  return { success: true }
}

export async function deleteStandard(id: string) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('standards') as any).delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/standards')
  revalidatePath('/admin/dashboard/standards')
  return { success: true }
}
