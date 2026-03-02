import { createClient } from '@/lib/supabase/server'
import type { Json } from '@/lib/supabase/database.types'
import type {
  HeroContent,
  HeroSlide,
  AboutContent,
  AboutStat,
  ContactInfo,
  SocialLinks,
  HomepageService,
  SocialProofContent,
  AboutPreviewContent,
  FeaturesGridContent,
  StatsContent,
  CTAContent,
  SectionTitles,
  FooterContent,
  FAQItem,
  AchievementItem,
  ContactCTAContent,
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
  const defaultSlides: HeroSlide[] = [
    {
      subtitle: 'Süni İntellekt ilə',
      title: 'Tibbi Görüntüləmə',
      description: 'Tibbi görüntüləmədə dəqiqliyin orkestrləşdirilməsi - innovativ süni intellekt texnologiyası',
      background_image: '',
    },
  ]
  const defaults: HeroContent = {
    slides: defaultSlides,
    cta_primary_text: 'Başlamaq',
    cta_primary_url: '/contact',
    cta_secondary_text: 'Ətraflı Məlumat',
    cta_secondary_url: '/about',
    background_images: [],
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaults
  }

  const raw = value as Record<string, unknown>

  // Migrate old background_image (string) to background_images (array)
  let backgroundImages: string[] = []
  if (Array.isArray(raw.background_images)) {
    backgroundImages = raw.background_images as string[]
  } else if (typeof raw.background_image === 'string' && (raw.background_image as string).trim() !== '') {
    backgroundImages = [raw.background_image as string]
  }

  // Parse slides - support new slides array or migrate from old flat format
  let slides: HeroSlide[] = defaultSlides
  if (Array.isArray(raw.slides) && raw.slides.length > 0) {
    slides = (raw.slides as Record<string, unknown>[]).map((s) => ({
      subtitle: (s.subtitle as string) || '',
      title: (s.title as string) || '',
      description: (s.description as string) || '',
      background_image: (s.background_image as string) || '',
    }))
  } else if (raw.headline) {
    // Migrate from old flat format: create slides from headline + background_images
    slides = backgroundImages.length > 0
      ? backgroundImages.map((img, i) => ({
          subtitle: i === 0 ? 'Süni İntellekt ilə' : '',
          title: (raw.headline as string) || defaults.slides[0].title,
          description: (raw.subheadline as string) || defaults.slides[0].description,
          background_image: img,
        }))
      : [{
          subtitle: 'Süni İntellekt ilə',
          title: (raw.headline as string) || defaults.slides[0].title,
          description: (raw.subheadline as string) || defaults.slides[0].description,
          background_image: '',
        }]
  }

  return {
    slides,
    cta_primary_text: (raw.cta_primary_text as string) || defaults.cta_primary_text,
    cta_primary_url: (raw.cta_primary_url as string) || defaults.cta_primary_url,
    cta_secondary_text: (raw.cta_secondary_text as string) || defaults.cta_secondary_text,
    cta_secondary_url: (raw.cta_secondary_url as string) || defaults.cta_secondary_url,
    background_images: backgroundImages,
  }
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

export async function getSocialProofContent(): Promise<SocialProofContent> {
  const value = await getSiteSetting('social_proof')
  const defaults: SocialProofContent = {
    title: 'Etibarlı tərəfdaşlar',
    logos: [],
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaults
  }

  return { ...defaults, ...(value as Record<string, unknown>) } as SocialProofContent
}

export async function getAboutPreviewContent(): Promise<AboutPreviewContent> {
  const value = await getSiteSetting('about_preview')
  const defaults: AboutPreviewContent = {
    title: 'Biz kimik?',
    description: 'FADAI tibbi görüntüləmə sahəsində süni intellekt texnologiyalarını tətbiq edən innovativ şirkətdir. Missiyamız — dəqiq diaqnostika ilə həyatları dəyişmək.',
    image_url: '',
    cta_text: 'Ətraflı',
    cta_url: '/about',
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaults
  }

  return { ...defaults, ...(value as Record<string, unknown>) } as AboutPreviewContent
}

export async function getFeaturesGridContent(): Promise<FeaturesGridContent> {
  const value = await getSiteSetting('features_grid')
  const defaults: FeaturesGridContent = {
    title: 'Əsas Üstünlüklərimiz',
    subtitle: 'Müasir tibbi görüntüləmə texnologiyaları ilə gələcəyə addım',
    features: [
      {
        title: 'Süni İntellekt Analizi',
        description: 'Rentgen və MRT görüntülərinin dərin analizi üçün qabaqcıl AI alqoritmləri.',
        icon: '🧠'
      },
      {
        title: '24/7 Diaqnostika',
        description: 'Zaman itkisi olmadan, günün istənilən saatında dəqiq nəticələr əldə edin.',
        icon: '⚡'
      },
      {
        title: 'Təhlükəsiz Arxiv',
        description: 'Bütün tibbi məlumatlarınız ən yüksək təhlükəsizlik standartları ilə qorunur.',
        icon: '🔒'
      },
      {
        title: 'Komanda İnteqrasiyası',
        description: 'Həkimlər və mütəxəssislər arasında vahid platforma üzərindən əməkdaşlıq.',
        icon: '🤝'
      }
    ],
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaults
  }

  return { ...defaults, ...(value as Record<string, unknown>) } as FeaturesGridContent
}

export async function getStatsContent(): Promise<StatsContent> {
  const value = await getSiteSetting('homepage_stats')
  const defaults: StatsContent = {
    stats: [],
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaults
  }

  return { ...defaults, ...(value as Record<string, unknown>) } as StatsContent
}

export async function getCTAContent(): Promise<CTAContent> {
  const value = await getSiteSetting('homepage_cta')
  const defaults: CTAContent = {
    title: 'Layihənizi bizimlə başlayın',
    subtitle: 'Pulsuz konsultasiya alın və tibbi görüntüləmə həllərimizi kəşf edin.',
    cta_text: 'Pulsuz Konsultasiya',
    cta_url: '/contact',
    image_url: '',
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaults
  }

  return { ...defaults, ...(value as Record<string, unknown>) } as CTAContent
}

export async function getSectionTitles(): Promise<SectionTitles> {
  const value = await getSiteSetting('section_titles')
  const defaults: SectionTitles = {
    services: 'Xidmətlərimiz',
    products: 'Məhsullarımız',
    news: 'Xəbərlər',
    support: 'Dəstək',
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaults
  }

  return { ...defaults, ...(value as Record<string, string>) }
}

export async function getFooterContent(): Promise<FooterContent> {
  const value = await getSiteSetting('footer')
  const defaults: FooterContent = {
    tagline: 'Tibbi görüntüləmədə dəqiqliyin orkestrləşdirilməsi',
    copyright: 'FADAI. Bütün hüquqlar qorunur.',
    quick_links: [
      { label: 'Haqqımızda', url: '/about' },
      { label: 'Xəbərlər', url: '/news' },
      { label: 'Dəstək', url: '/support' },
    ],
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaults
  }

  const raw = value as Record<string, unknown>
  return {
    tagline: (raw.tagline as string) || defaults.tagline,
    copyright: (raw.copyright as string) || defaults.copyright,
    quick_links: Array.isArray(raw.quick_links) ? (raw.quick_links as FooterContent['quick_links']) : defaults.quick_links,
  }
}

export async function getFAQItems(): Promise<FAQItem[]> {
  const value = await getSiteSetting('faq')

  if (!value || !Array.isArray(value)) {
    return []
  }

  return value as unknown as FAQItem[]
}

export async function getAchievements(): Promise<AchievementItem[]> {
  const value = await getSiteSetting('achievements')

  if (!value || !Array.isArray(value)) {
    return []
  }

  return value as unknown as AchievementItem[]
}

export async function getContactCTAContent(): Promise<ContactCTAContent> {
  const value = await getSiteSetting('homepage_contact_cta')
  const defaults: ContactCTAContent = {
    title: 'Bizimlə əlaqə saxlayın',
    subtitle: 'Komandamız sizə kömək etməyə hazırdır. Pulsuz konsultasiya alın.',
    cta_text: 'Əlaqə Formu',
    phone_text: 'Zəng edin',
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaults
  }

  return { ...defaults, ...(value as Record<string, string>) }
}
