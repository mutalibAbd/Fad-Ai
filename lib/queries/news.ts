import { createAdminClient } from '@/lib/supabase/server'
import type { News } from '@/lib/types'

export async function getVisibleNews(): Promise<News[]> {
  const supabase = createAdminClient()

  const { data, error } = await (supabase
    .from('news') as any)
    .select('*')
    .eq('is_visible', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching news:', error)
    return []
  }

  return data || []
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  const supabase = createAdminClient()

  const { data, error } = await (supabase
    .from('news') as any)
    .select('*')
    .eq('slug', slug)
    .eq('is_visible', true)
    .single()

  if (error || !data) return null
  return data
}

export async function getAllNewsSlugs(): Promise<string[]> {
  const supabase = createAdminClient()

  const { data } = await (supabase
    .from('news') as any)
    .select('slug')
    .eq('is_visible', true)

  return (data || []).map((n: { slug: string }) => n.slug)
}
