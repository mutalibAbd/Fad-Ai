import { createClient } from '@/lib/supabase/server'
import type { Json } from '@/lib/supabase/database.types'
import type {
  HeroContent,
  AboutContent,
  AboutStat,
  ContactInfo,
  SocialLinks,
  HomepageService,
} from '@/lib/types'

export async function getSiteSetting(key: string): Promise<Json | null> {
  const supabase = await createClient()

  const { data, error } = await (supabase
    .from('site_settings') as any)
    .select('value')
    .eq('key', key)
    .single()

  if (error || !data) {
    return null
  }

  return data.value
}

export async function getHeroContent(): Promise<HeroContent> {
  const value = await getSiteSetting('hero')
  const defaults: HeroContent = {
    headline: 'Radiologiyada Rəqəmsal Simfoniya',
    subheadline: 'Tibbi görüntüləmədə dəqiqliyin orkestrləşdirilməsi - innovativ süni intellekt texnologiyası',
    cta_primary_text: 'Başlamaq',
    cta_primary_url: '/products',
    cta_secondary_text: 'Ətraflı Məlumat',
    cta_secondary_url: '/about',
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaults
  }

  return { ...defaults, ...(value as Record<string, string>) }
}

export async function getAboutContent(): Promise<AboutContent> {
  const value = await getSiteSetting('about')
  const defaults: AboutContent = {
    story_title: 'FADAI haqqında',
    story_text: 'FADAI tibbi görüntüləmə sahəsində süni intellekt texnologiyalarını tətbiq edən innovativ şirkətdir.',
    mission_text: 'Tibbi görüntüləmə sahəsində ən son texnologiyaların tətbiqi ilə səhiyyə sektoruna töhfə vermək.',
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaults
  }

  return { ...defaults, ...(value as Record<string, string>) }
}

export async function getAboutStats(): Promise<AboutStat[]> {
  const value = await getSiteSetting('about_stats')

  if (!value || !Array.isArray(value)) {
    return []
  }

  return value as unknown as AboutStat[]
}

export async function getContactInfo(): Promise<ContactInfo> {
  const value = await getSiteSetting('contact_info')
  const defaults: ContactInfo = {
    email: 'info@fadai.com',
    phone: '+994 XX XXX XX XX',
    address: 'Bakı, Azərbaycan',
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaults
  }

  return { ...defaults, ...(value as Record<string, string>) }
}

export async function getSocialLinks(): Promise<SocialLinks> {
  const value = await getSiteSetting('social_links')
  const defaults: SocialLinks = {
    facebook: '',
    instagram: '',
    linkedin: '',
    youtube: '',
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaults
  }

  return { ...defaults, ...(value as Record<string, string>) }
}

export async function getHomepageServices(): Promise<HomepageService[]> {
  const value = await getSiteSetting('homepage_services')

  if (!value || !Array.isArray(value)) {
    return []
  }

  return value as unknown as HomepageService[]
}
