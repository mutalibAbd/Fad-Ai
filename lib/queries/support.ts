import { createAdminClient } from '@/lib/supabase/server'
import type { SupportType } from '@/lib/types'

export async function getVisibleSupportTypes(): Promise<SupportType[]> {
  const supabase = createAdminClient()

  const { data, error } = await (supabase
    .from('support_types') as any)
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching support types:', error)
    return []
  }

  return data || []
}

export async function getSupportBySlug(slug: string): Promise<SupportType | null> {
  const supabase = createAdminClient()

  const { data, error } = await (supabase
    .from('support_types') as any)
    .select('*')
    .eq('slug', slug)
    .eq('is_visible', true)
    .single()

  if (error || !data) return null
  return data
}

export async function getAllSupportSlugs(): Promise<string[]> {
  const supabase = createAdminClient()

  const { data } = await (supabase
    .from('support_types') as any)
    .select('slug')
    .eq('is_visible', true)

  return (data || []).map((s: { slug: string }) => s.slug)
}
