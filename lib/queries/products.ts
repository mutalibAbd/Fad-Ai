import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import type { Product, ProductWithDetails } from '@/lib/types'

export type { Product }

export async function getVisibleProducts(): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await (supabase
    .from('products') as any)
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  const supabase = await createClient()

  const { data: product, error } = await (supabase
    .from('products') as any)
    .select('*')
    .eq('slug', slug)
    .eq('is_visible', true)
    .single()

  if (error || !product) {
    return null
  }

  const { data: features } = await (supabase
    .from('product_features') as any)
    .select('*')
    .eq('product_id', product.id)
    .order('sort_order', { ascending: true })

  const { data: images } = await (supabase
    .from('product_images') as any)
    .select('*')
    .eq('product_id', product.id)
    .order('sort_order', { ascending: true })

  return {
    ...product,
    features: features || [],
    images: images || [],
  }
}

export async function getAllProductSlugs(): Promise<string[]> {
  const supabase = createAdminClient()

  const { data, error } = await (supabase
    .from('products') as any)
    .select('slug')
    .eq('is_visible', true)

  if (error) {
    return []
  }

  return (data || []).map((p: { slug: string }) => p.slug)
}
