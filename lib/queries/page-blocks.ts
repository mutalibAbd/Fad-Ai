import { createClient, createAdminClient } from '@/lib/supabase/server'
import type { PageBlock, BlockType, BlockContent, ZigzagHeroContent, JourneyListContent, ValuesGridContent } from '@/lib/types'

export async function getVisiblePageBlocks(pageSlug: string): Promise<PageBlock[]> {
  const supabase = await createClient()

  const { data, error } = await (supabase
    .from('page_blocks') as any)
    .select('*')
    .eq('page_slug', pageSlug)
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching page blocks:', error)
    return []
  }

  return (data || []).map(parseBlockRow)
}

export async function getAllPageBlocks(pageSlug: string): Promise<PageBlock[]> {
  const supabase = createAdminClient()

  const { data, error } = await (supabase
    .from('page_blocks') as any)
    .select('*')
    .eq('page_slug', pageSlug)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching page blocks:', error)
    return []
  }

  return (data || []).map(parseBlockRow)
}

function parseBlockRow(row: any): PageBlock {
  const blockType = row.block_type as BlockType
  let content: BlockContent

  const raw = (typeof row.content === 'string' ? JSON.parse(row.content) : row.content) || {}

  switch (blockType) {
    case 'zigzag_hero':
      content = {
        text: raw.text || '',
        images: Array.isArray(raw.images) ? raw.images : [],
      } as ZigzagHeroContent
      break
    case 'journey_list':
      content = {
        items: Array.isArray(raw.items) ? raw.items : [],
      } as JourneyListContent
      break
    case 'values_grid':
      content = {
        items: Array.isArray(raw.items) ? raw.items : [],
      } as ValuesGridContent
      break
    default:
      content = raw as BlockContent
  }

  return {
    id: row.id,
    page_slug: row.page_slug,
    block_type: blockType,
    title: row.title || '',
    content,
    sort_order: row.sort_order ?? 0,
    is_visible: row.is_visible ?? true,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}
