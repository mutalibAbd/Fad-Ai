import { createClient } from '@/lib/supabase/server'
import type { Service } from '@/lib/types'

export type { Service }

export async function getVisibleServices(): Promise<Service[]> {
  const supabase = await createClient()

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
