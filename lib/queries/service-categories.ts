import { createClient, createAdminClient } from '@/lib/supabase/server'
import type { ServiceCategory, ServiceCategoryWithServices } from '@/lib/types'

export async function getVisibleServiceCategories(): Promise<ServiceCategory[]> {
  const supabase = await createClient()

  const { data, error } = await (supabase
    .from('service_categories') as any)
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching service categories:', error)
    return []
  }

  return data || []
}

export async function getServiceCategoriesWithServices(): Promise<ServiceCategoryWithServices[]> {
  const supabase = await createClient()

  const { data: categories, error: catError } = await (supabase
    .from('service_categories') as any)
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  if (catError || !categories) {
    console.error('Error fetching service categories:', catError)
    return []
  }

  const { data: services, error: svcError } = await (supabase
    .from('services') as any)
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  if (svcError) {
    console.error('Error fetching services:', svcError)
    return categories.map((cat: ServiceCategory) => ({ ...cat, services: [] }))
  }

  return categories.map((cat: ServiceCategory) => ({
    ...cat,
    services: (services || []).filter((svc: any) => svc.category_id === cat.id),
  }))
}

export async function getCategoryBySlug(slug: string): Promise<ServiceCategory | null> {
  const supabase = await createClient()

  const { data, error } = await (supabase
    .from('service_categories') as any)
    .select('*')
    .eq('slug', slug)
    .eq('is_visible', true)
    .single()

  if (error || !data) return null
  return data
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const supabase = createAdminClient()

  const { data } = await (supabase
    .from('service_categories') as any)
    .select('slug')
    .eq('is_visible', true)

  return (data || []).map((c: { slug: string }) => c.slug)
}
