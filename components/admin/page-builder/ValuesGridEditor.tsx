'use client';

import FormField from '@/components/admin/FormField';
import type { PageBlock, ValuesGridContent, ValuesGridItem } from '@/lib/types';

interface ValuesGridEditorProps {
  block: PageBlock;
  onUpdate: (updates: Partial<PageBlock>) => void;
}

export default function ValuesGridEditor({ block, onUpdate }: ValuesGridEditorProps) {
  const content = block.content as ValuesGridContent;

  const handleTitleChange = (value: string) => {
    onUpdate({ title: value });
  };

  const handleItemChange = (index: number, field: keyof ValuesGridItem, value: string) => {
    const items = [...content.items];
    items[index] = { ...items[index], [field]: value };
    onUpdate({ content: { items } });
  };

  const handleAddItem = () => {
    const items = [...content.items, { icon: '', title: '', description: '' }];
    onUpdate({ content: { items } });
  };

  const handleRemoveItem = (index: number) => {
    const items = content.items.filter((_, i) => i !== index);
    onUpdate({ content: { items } });
  };

  return (
    <div className="space-y-4">
      <FormField
        label="Bolme bashligi"
        name={`block_title_${block.id}`}
        value={block.title}
        onChange={handleTitleChange}
      />

      <div className="space-y-4">
        {content.items.map((item, index) => (
          <div key={index} className="bg-slate-50/50 rounded-xl border border-slate-100 p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary tracking-tight">
                Deyer {index + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-xs font-medium tracking-tight text-red-600 hover:text-red-700"
              >
                Sil
              </button>
            </div>
            <FormField
              label="Ikon (emoji ve ya URL)"
              name={`values_icon_${block.id}_${index}`}
              value={item.icon}
              onChange={(v) => handleItemChange(index, 'icon', v)}
              placeholder="📊"
            />
            <FormField
              label="Bashliq"
              name={`values_title_${block.id}_${index}`}
              value={item.title}
              onChange={(v) => handleItemChange(index, 'title', v)}
            />
            <FormField
              label="Aciklama"
              name={`values_desc_${block.id}_${index}`}
              type="textarea"
              value={item.description}
              onChange={(v) => handleItemChange(index, 'description', v)}
              rows={2}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddItem}
        className="text-sm font-medium tracking-tight text-primary hover:text-primary-600"
      >
        + Yeni deyer
      </button>
    </div>
  );
}
