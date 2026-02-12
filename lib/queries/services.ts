import { createAdminClient } from '@/lib/supabase/server'
import type { Service } from '@/lib/types'

export type { Service }

export async function getVisibleServices(): Promise<Service[]> {
  const supabase = createAdminClient()

  const { data, error } = await (supabase
    .from('services') as any)
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching services:', error)
    return []
  }

  return data || []
}

export async function getServicesByCategory(categoryId: string): Promise<Service[]> {
  const supabase = createAdminClient()

  const { data, error } = await (supabase
    .from('services') as any)
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching services by category:', error)
    return []
  }

  return data || []
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const supabase = createAdminClient()

  const { data, error } = await (supabase
    .from('services') as any)
    .select('*')
    .eq('slug', slug)
    .eq('is_visible', true)
    .single()

  if (error || !data) return null
  return data
}

export async function getAllServiceSlugs(): Promise<string[]> {
  const supabase = createAdminClient()

  const { data } = await (supabase
    .from('services') as any)
    .select('slug')
    .eq('is_visible', true)
    .not('slug', 'is', null)

  return (data || []).map((s: { slug: string }) => s.slug)
}
