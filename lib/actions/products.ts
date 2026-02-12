'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProduct(data: {
  slug: string
  icon: string
  title: string
  description?: string
  long_description?: string
  content?: string
  specifications?: Record<string, string>
  image_url?: string
  sort_order?: number
  is_visible?: boolean
}) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('products') as any).insert(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/products')
  revalidatePath('/admin/dashboard/products')
  return { success: true }
}

export async function updateProduct(id: string, data: {
  slug?: string
  icon?: string
  title?: string
  description?: string
  long_description?: string
  content?: string
  specifications?: Record<string, string>
  image_url?: string
  sort_order?: number
  is_visible?: boolean
}) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('products') as any).update(data).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/products')
  revalidatePath(`/products/${data.slug}`)
  revalidatePath('/admin/dashboard/products')
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('products') as any).delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/products')
  revalidatePath('/admin/dashboard/products')
  return { success: true }
}

export async function toggleProductVisibility(id: string, is_visible: boolean) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('products') as any).update({ is_visible }).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/products')
  revalidatePath('/admin/dashboard/products')
  return { success: true }
}

export async function createProductFeature(data: {
  product_id: string
  title: string
  description?: string
  sort_order?: number
}) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('product_features') as any).insert(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/products')
  revalidatePath('/admin/dashboard/products')
  return { success: true }
}

export async function updateProductFeature(id: string, data: {
  title?: string
  description?: string
  sort_order?: number
}) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('product_features') as any).update(data).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/products')
  revalidatePath('/admin/dashboard/products')
  return { success: true }
}

export async function deleteProductFeature(id: string) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('product_features') as any).delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/products')
  return { success: true }
}
