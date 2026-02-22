'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BlockEditorCard from './BlockEditorCard';
import type { PageBlock } from '@/lib/types';

interface SortableBlockCardProps {
  block: PageBlock;
  onUpdate: (updates: Partial<PageBlock>) => void;
  onDelete: () => void;
}

export default function SortableBlockCard({ block, onUpdate, onDelete }: SortableBlockCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto' as any,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <BlockEditorCard
        block={block}
        dragHandleProps={{ ...attributes, ...listeners }}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </div>
  );
}
