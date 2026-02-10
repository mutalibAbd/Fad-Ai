import { createClient } from '@/lib/supabase/server'
import type { Standard } from '@/lib/types'

export type { Standard }

export async function getMainStandards(): Promise<Standard[]> {
  const supabase = await createClient()

  const { data, error } = await (supabase
    .from('standards') as any)
    .select('*')
    .eq('is_visible', true)
    .eq('category', 'main')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching main standards:', error)
    return []
  }

  return data || []
}

export async function getAdditionalStandards(): Promise<Standard[]> {
  const supabase = await createClient()

  const { data, error } = await (supabase
    .from('standards') as any)
    .select('*')
    .eq('is_visible', true)
    .eq('category', 'additional')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching additional standards:', error)
    return []
  }

  return data || []
}

export async function getBiometricIndicators(): Promise<Standard[]> {
  const supabase = await createClient()

  const { data, error } = await (supabase
    .from('standards') as any)
    .select('*')
    .eq('is_visible', true)
    .eq('category', 'biometric')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching biometric indicators:', error)
    return []
  }

  return data || []
}
