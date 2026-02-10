'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Json } from '@/lib/supabase/database.types'

export async function updateSiteSetting(key: string, value: Json) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('site_settings') as any)
    .upsert({ key, value })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/contact')
  revalidatePath('/admin/dashboard/settings')
  revalidatePath('/admin/dashboard/homepage')
  revalidatePath('/admin/dashboard/about')
  return { success: true }
}
