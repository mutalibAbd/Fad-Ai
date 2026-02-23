'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import SortableBlockCard from './SortableBlockCard';
import AddBlockDialog from './AddBlockDialog';
import type { PageBlock, BlockType, BlockContent, ZigzagHeroContent, JourneyListContent, ValuesGridContent } from '@/lib/types';

interface BlockListEditorProps {
  initialBlocks: PageBlock[];
  pageSlug: string;
}

function getDefaultContent(blockType: BlockType): BlockContent {
  switch (blockType) {
    case 'zigzag_hero':
      return { text: '', images: [] } as ZigzagHeroContent;
    case 'journey_list':
      return { items: [] } as JourneyListContent;
    case 'values_grid':
      return { items: [] } as ValuesGridContent;
  }
}

export default function BlockListEditor({ initialBlocks, pageSlug }: BlockListEditorProps) {
  const router = useRouter();
  const [blocks, setBlocks] = useState<PageBlock[]>(initialBlocks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    const reordered = arrayMove(blocks, oldIndex, newIndex);
    setBlocks(reordered);

    const { reorderPageBlocks } = await import('@/lib/actions/page-blocks');
    const result = await reorderPageBlocks(pageSlug, reordered.map((b) => b.id));
    if (result.error) {
      setError(result.error);
      setBlocks(blocks);
    }
  };

  const handleAddBlock = async (blockType: BlockType) => {
    setLoading(true);
    setError('');

    try {
      const { createPageBlock } = await import('@/lib/actions/page-blocks');
      const result = await createPageBlock({
        page_slug: pageSlug,
        block_type: blockType,
        title: '',
        content: getDefaultContent(blockType) as any,
        sort_order: blocks.length,
      });

      if (result.error) {
        setError(result.error);
      } else if (result.block) {
        const newBlock: PageBlock = {
          id: result.block.id,
          page_slug: pageSlug,
          block_type: blockType,
          title: '',
          content: getDefaultContent(blockType),
          sort_order: blocks.length,
          is_visible: true,
          created_at: result.block.created_at,
          updated_at: result.block.updated_at,
        };
        setBlocks((prev) => [...prev, newBlock]);
      }
    } catch {
      setError('Xeta bash verdi');
    }

    setLoading(false);
  };

  const handleUpdateBlock = (id: string, updates: Partial<PageBlock>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const handleDeleteBlock = async (id: string) => {
    setError('');

    try {
      const { deletePageBlock } = await import('@/lib/actions/page-blocks');
      const result = await deletePageBlock(id, pageSlug);

      if (result.error) {
        setError(result.error);
      } else {
        setBlocks((prev) => prev.filter((b) => b.id !== id));
      }
    } catch {
      setError('Xeta bash verdi');
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { updatePageBlock } = await import('@/lib/actions/page-blocks');
      for (const block of blocks) {
        const result = await updatePageBlock(block.id, pageSlug, {
          title: block.title,
          content: block.content as any,
          is_visible: block.is_visible,
        });
        if (result.error) {
          setError(`Blok "${block.title || block.block_type}" saxlanarken xeta: ${result.error}`);
          setLoading(false);
          return;
        }
      }

      setSuccess('Butun bloklar ugurla saxlandi');
      router.refresh();
    } catch {
      setError('Xeta bash verdi');
    }

    setLoading(false);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-text-primary">
          Sehife bloklari
        </h2>
        <button
          type="button"
          onClick={() => setShowAddDialog(true)}
          disabled={loading}
          className="text-sm font-medium tracking-tight text-primary hover:text-primary-600"
        >
          + Blok elave et
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
          <p className="text-red-800 tracking-tight text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
          <p className="text-green-800 tracking-tight text-sm">{success}</p>
        </div>
      )}

      {blocks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
          <p className="text-sm text-text-secondary tracking-tight">
            Hec bir blok yoxdur. &quot;Blok elave et&quot; duymesine basin.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {blocks.map((block) => (
                <SortableBlockCard
                  key={block.id}
                  block={block}
                  onUpdate={(updates) => handleUpdateBlock(block.id, updates)}
                  onDelete={() => handleDeleteBlock(block.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {blocks.length > 0 && (
        <div className="mt-6">
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={loading}
            className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium tracking-tight hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saxlanilir...' : 'Butun bloklari saxla'}
          </button>
        </div>
      )}

      <AddBlockDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSelect={handleAddBlock}
      />
    </section>
  );
}
