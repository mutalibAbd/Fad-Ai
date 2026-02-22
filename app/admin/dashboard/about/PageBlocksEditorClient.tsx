'use client';

import { BlockListEditor } from '@/components/admin/page-builder';
import type { PageBlock } from '@/lib/types';

interface Props {
  initialBlocks: PageBlock[];
  pageSlug: string;
}

export default function PageBlocksEditorClient({ initialBlocks, pageSlug }: Props) {
  return <BlockListEditor initialBlocks={initialBlocks} pageSlug={pageSlug} />;
}
