import { Database } from '@/lib/supabase/database.types'

// Table row types
export type Project = Database['public']['Tables']['projects']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductFeature = Database['public']['Tables']['product_features']['Row']
export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type Standard = Database['public']['Tables']['standards']['Row']
export type TeamMember = Database['public']['Tables']['team_members']['Row']
export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row']
export type SiteSetting = Database['public']['Tables']['site_settings']['Row']

// Derived types
export interface ProductWithDetails extends Product {
  features: ProductFeature[]
  images: ProductImage[]
}

export interface HeroContent {
  headline: string
  subheadline: string
  cta_primary_text: string
  cta_primary_url: string
  cta_secondary_text: string
  cta_secondary_url: string
}

export interface AboutContent {
  story_title: string
  story_text: string
  mission_text: string
}

export interface AboutStat {
  label: string
  value: string
}

export interface ContactInfo {
  email: string
  phone: string
  address: string
}

export interface SocialLinks {
  facebook: string
  instagram: string
  linkedin: string
  youtube: string
}

export interface HomepageService {
  icon: string
  title: string
  description: string
}

export interface ContactFormData {
  full_name: string
  email: string
  phone?: string
  subject?: string
  message: string
}
