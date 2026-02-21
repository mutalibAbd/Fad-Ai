'use client';

import { useRef, useCallback } from 'react';
import type { ContentSection } from '@/lib/utils/content-sections';
export { parseSections } from '@/lib/utils/content-sections';
export type { ContentSection } from '@/lib/utils/content-sections';

interface Props {
  value: ContentSection[];
  onChange: (sections: ContentSection[]) => void;
}

/* ── Toolbar ── */

function MarkdownToolbar({
  textareaRef,
  onUpdate,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onUpdate: (newValue: string) => void;
}) {
  const wrap = useCallback(
    (prefix: string, suffix: string) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const text = ta.value;
      const selected = text.slice(start, end);
      const replacement = `${prefix}${selected || 'mətn'}${suffix}`;
      const newVal = text.slice(0, start) + replacement + text.slice(end);
      onUpdate(newVal);
      // Restore cursor after React re-render
      requestAnimationFrame(() => {
        ta.focus();
        const cursorStart = start + prefix.length;
        const cursorEnd = cursorStart + (selected || 'mətn').length;
        ta.setSelectionRange(cursorStart, cursorEnd);
      });
    },
    [textareaRef, onUpdate],
  );

  const prefixLine = useCallback(
    (prefix: string) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const text = ta.value;
      // Find start of line
      const lineStart = text.lastIndexOf('\n', start - 1) + 1;
      const newVal = text.slice(0, lineStart) + prefix + text.slice(lineStart);
      onUpdate(newVal);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(start + prefix.length, start + prefix.length);
      });
    },
    [textareaRef, onUpdate],
  );

  const btnClass =
    'px-2.5 py-1 rounded-lg text-xs font-medium tracking-tight border border-slate-200 hover:bg-slate-100 transition-colors text-text-primary';

  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      <button type="button" onClick={() => wrap('**', '**')} className={btnClass} title="Qalın (Bold)">
        <strong>B</strong>
      </button>
      <button type="button" onClick={() => wrap('*', '*')} className={btnClass} title="Kursiv (Italic)">
        <em>I</em>
      </button>
      <button type="button" onClick={() => prefixLine('## ')} className={btnClass} title="Başlıq 2">
        H2
      </button>
      <button type="button" onClick={() => prefixLine('### ')} className={btnClass} title="Başlıq 3">
        H3
      </button>
      <button type="button" onClick={() => prefixLine('- ')} className={btnClass} title="Siyahı elementi">
        List
      </button>
    </div>
  );
}

/* ── Section Card ── */

function SectionCard({
  section,
  index,
  total,
  onUpdate,
  onMove,
  onDelete,
}: {
  section: ContentSection;
  index: number;
  total: number;
  onUpdate: (field: 'heading' | 'body', value: string) => void;
  onMove: (direction: -1 | 1) => void;
  onDelete: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <input
        type="text"
        value={section.heading}
        onChange={(e) => onUpdate('heading', e.target.value)}
        placeholder="Bölmə başlığı"
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
      <MarkdownToolbar
        textareaRef={textareaRef}
        onUpdate={(v) => onUpdate('body', v)}
      />
      <textarea
        ref={textareaRef}
        value={section.body}
        onChange={(e) => onUpdate('body', e.target.value)}
        placeholder="Bölmə məzmunu (Markdown dəstəklənir)..."
        rows={6}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y font-mono"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onMove(-1)}
          disabled={index === 0}
          className="text-xs font-medium text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors px-2 py-1.5"
        >
          Yuxarı
        </button>
        <button
          type="button"
          onClick={() => onMove(1)}
          disabled={index === total - 1}
          className="text-xs font-medium text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors px-2 py-1.5"
        >
          Aşağı
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors px-2 py-1.5 ml-auto"
        >
          Sil
        </button>
      </div>
    </div>
  );
}

/* ── Main Editor ── */

export default function ContentSectionsEditor({ value, onChange }: Props) {
  const updateSection = (idx: number, field: 'heading' | 'body', val: string) => {
    onChange(value.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
  };

  const addSection = () => {
    onChange([...value, { heading: '', body: '' }]);
  };

  const deleteSection = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const moveSection = (idx: number, direction: -1 | 1) => {
    const target = idx + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-text-primary tracking-tight">
        Məzmun bölmələri
      </label>

      {value.length === 0 && (
        <p className="text-sm text-text-secondary tracking-tight">
          Hələ bölmə əlavə edilməyib. Aşağıdakı düyməni klikləyin.
        </p>
      )}

      <div className="space-y-4">
        {value.map((section, idx) => (
          <SectionCard
            key={idx}
            section={section}
            index={idx}
            total={value.length}
            onUpdate={(field, val) => updateSection(idx, field, val)}
            onMove={(dir) => moveSection(idx, dir)}
            onDelete={() => deleteSection(idx)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={addSection}
        className="text-sm font-medium tracking-tight text-primary hover:text-primary-600 transition-colors"
      >
        + Yeni bölmə əlavə et
      </button>
    </div>
  );
}
