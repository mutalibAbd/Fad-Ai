import { Database } from '@/lib/supabase/database.types'

// Table row types
export type Project = Database['public']['Tables']['projects']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductFeature = Database['public']['Tables']['product_features']['Row']
export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type ServiceCategory = Database['public']['Tables']['service_categories']['Row']
export type Standard = Database['public']['Tables']['standards']['Row']
export type SupportType = Database['public']['Tables']['support_types']['Row']
export type News = Database['public']['Tables']['news']['Row']
export type TeamMember = Database['public']['Tables']['team_members']['Row']
export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row']
export type SiteSetting = Database['public']['Tables']['site_settings']['Row']

// Derived types
export interface ProductWithDetails extends Product {
  features: ProductFeature[]
  images: ProductImage[]
}

export interface ServiceCategoryWithServices extends ServiceCategory {
  services: Service[]
}

export interface HeroContent {
  headline: string
  subheadline: string
  cta_primary_text: string
  cta_primary_url: string
  cta_secondary_text: string
  cta_secondary_url: string
  background_images: string[]
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

// Homepage Section Types

export interface TrustLogo {
  name: string
  image_url: string
}

export interface SocialProofContent {
  title: string
  logos: TrustLogo[]
}

export interface AboutPreviewContent {
  title: string
  description: string
  image_url: string
  cta_text: string
  cta_url: string
}

export interface FeatureItem {
  icon: string
  title: string
  description: string
}

export interface FeaturesGridContent {
  title: string
  subtitle: string
  features: FeatureItem[]
}

export interface StatItem {
  value: string
  label: string
}

export interface StatsContent {
  stats: StatItem[]
}

export interface CTAContent {
  title: string
  subtitle: string
  cta_text: string
  cta_url: string
  image_url: string
}

export interface SectionTitles {
  services: string
  products: string
  news: string
  support: string
}

export interface FooterContent {
  tagline: string
  copyright: string
}

export interface FAQItem {
  question: string
  answer: string
}

// ── Page Block Types ──

export type BlockType = 'zigzag_hero' | 'journey_list' | 'values_grid'

export interface ZigzagHeroContent {
  text: string
  images: string[]
}

export interface JourneyListItem {
  image_url: string
  subtitle: string
  description: string
}

export interface JourneyListContent {
  items: JourneyListItem[]
}

export interface ValuesGridItem {
  icon: string
  title: string
  description: string
}

export interface ValuesGridContent {
  items: ValuesGridItem[]
}

export type BlockContent = ZigzagHeroContent | JourneyListContent | ValuesGridContent

export interface PageBlock {
  id: string
  page_slug: string
  block_type: BlockType
  title: string
  content: BlockContent
  sort_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}
