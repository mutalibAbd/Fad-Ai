'use client';

import { useState } from 'react';
import { GripVertical, ChevronDown, ChevronUp, Eye, EyeOff, Trash2 } from 'lucide-react';
import type { PageBlock } from '@/lib/types';
import ZigzagHeroEditor from './ZigzagHeroEditor';
import JourneyListEditor from './JourneyListEditor';
import ValuesGridEditor from './ValuesGridEditor';

const BLOCK_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  zigzag_hero: { label: 'Zigzag / Hero', color: 'bg-blue-100 text-blue-700' },
  journey_list: { label: 'Yolculuq / Siyahi', color: 'bg-green-100 text-green-700' },
  values_grid: { label: 'Deyerler Grid', color: 'bg-purple-100 text-purple-700' },
};

interface BlockEditorCardProps {
  block: PageBlock;
  dragHandleProps: Record<string, any>;
  onUpdate: (updates: Partial<PageBlock>) => void;
  onDelete: () => void;
}

export default function BlockEditorCard({
  block,
  dragHandleProps,
  onUpdate,
  onDelete,
}: BlockEditorCardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const typeInfo = BLOCK_TYPE_LABELS[block.block_type] || { label: block.block_type, color: 'bg-slate-100 text-slate-700' };

  const renderEditor = () => {
    switch (block.block_type) {
      case 'zigzag_hero':
        return <ZigzagHeroEditor block={block} onUpdate={onUpdate} />;
      case 'journey_list':
        return <JourneyListEditor block={block} onUpdate={onUpdate} />;
      case 'values_grid':
        return <ValuesGridEditor block={block} onUpdate={onUpdate} />;
      default:
        return <p className="text-sm text-text-secondary">Bilinmeyen blok tipi</p>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-50">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 touch-none"
          {...dragHandleProps}
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium tracking-tight ${typeInfo.color}`}>
          {typeInfo.label}
        </span>

        <span className="text-sm font-medium text-text-primary tracking-tight truncate flex-1">
          {block.title || '(Bashliqsiz)'}
        </span>

        <button
          type="button"
          onClick={() => onUpdate({ is_visible: !block.is_visible })}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          title={block.is_visible ? 'Gizle' : 'Goster'}
        >
          {block.is_visible ? (
            <Eye className="w-4 h-4 text-slate-500" />
          ) : (
            <EyeOff className="w-4 h-4 text-slate-400" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          {collapsed ? (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          )}
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="p-6">
          {renderEditor()}
        </div>
      )}
    </div>
  );
}
