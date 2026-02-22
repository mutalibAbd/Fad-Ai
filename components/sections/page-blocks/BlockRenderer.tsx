import type { PageBlock } from '@/lib/types';
import ZigzagHeroSection from './ZigzagHeroSection';
import JourneyListSection from './JourneyListSection';
import ValuesGridSection from './ValuesGridSection';

interface BlockRendererProps {
  block: PageBlock;
  index: number;
}

export default function BlockRenderer({ block, index }: BlockRendererProps) {
  switch (block.block_type) {
    case 'zigzag_hero':
      return <ZigzagHeroSection block={block} reverse={index % 2 === 1} />;
    case 'journey_list':
      return <JourneyListSection block={block} />;
    case 'values_grid':
      return <ValuesGridSection block={block} />;
    default:
      return null;
  }
}
