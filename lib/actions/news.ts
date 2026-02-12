'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createNews(data: {
  title: string
  slug: string
  summary?: string
  content?: string
  image_url?: string
  published_at?: string
  is_visible?: boolean
}) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('news') as any).insert(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/news')
  revalidatePath('/admin/dashboard/news')
  return { success: true }
}

export async function updateNews(id: string, data: {
  title?: string
  slug?: string
  summary?: string
  content?: string
  image_url?: string | null
  published_at?: string
  is_visible?: boolean
}) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('news') as any).update(data).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/news')
  revalidatePath(`/news/${data.slug}`)
  revalidatePath('/admin/dashboard/news')
  return { success: true }
}

export async function deleteNews(id: string) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('news') as any).delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/news')
  revalidatePath('/admin/dashboard/news')
  return { success: true }
}
