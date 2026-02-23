'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Json } from '@/lib/supabase/database.types'

function getAdminBasePath(pageSlug: string): string {
  // "about" -> "about"
  // "products/my-product" -> "products"
  // "news/my-article" -> "news"
  // "services/my-service" -> "services"
  return pageSlug.split('/')[0]
}

export async function createPageBlock(data: {
  page_slug: string
  block_type: string
  title?: string
  content?: Json
  sort_order?: number
  is_visible?: boolean
}) {
  const supabase = createAdminClient()

  const { data: block, error } = await (supabase.from('page_blocks') as any)
    .insert(data)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/${data.page_slug}`)
  revalidatePath(`/admin/dashboard/${getAdminBasePath(data.page_slug)}`)
  return { success: true, block }
}

export async function updatePageBlock(id: string, pageSlug: string, data: {
  title?: string
  content?: Json
  sort_order?: number
  is_visible?: boolean
}) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('page_blocks') as any)
    .update(data)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/${pageSlug}`)
  revalidatePath(`/admin/dashboard/${getAdminBasePath(pageSlug)}`)
  return { success: true }
}

export async function deletePageBlock(id: string, pageSlug: string) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('page_blocks') as any)
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/${pageSlug}`)
  revalidatePath(`/admin/dashboard/${getAdminBasePath(pageSlug)}`)
  return { success: true }
}

export async function reorderPageBlocks(
  pageSlug: string,
  orderedIds: string[]
) {
  const supabase = createAdminClient()

  const results = await Promise.all(
    orderedIds.map((id, index) =>
      (supabase.from('page_blocks') as any)
        .update({ sort_order: index })
        .eq('id', id)
    )
  )

  const firstError = results.find((r) => r.error)
  if (firstError?.error) {
    return { error: firstError.error.message }
  }

  revalidatePath(`/${pageSlug}`)
  revalidatePath(`/admin/dashboard/${getAdminBasePath(pageSlug)}`)
  return { success: true }
}
