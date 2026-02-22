'use client';

import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';
import type { PageBlock, JourneyListContent, JourneyListItem } from '@/lib/types';

interface JourneyListEditorProps {
  block: PageBlock;
  onUpdate: (updates: Partial<PageBlock>) => void;
}

export default function JourneyListEditor({ block, onUpdate }: JourneyListEditorProps) {
  const content = block.content as JourneyListContent;

  const handleTitleChange = (value: string) => {
    onUpdate({ title: value });
  };

  const handleItemChange = (index: number, field: keyof JourneyListItem, value: string) => {
    const items = [...content.items];
    items[index] = { ...items[index], [field]: value };
    onUpdate({ content: { items } });
  };

  const handleAddItem = () => {
    const items = [...content.items, { image_url: '', subtitle: '', description: '' }];
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
                Element {index + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-xs font-medium tracking-tight text-red-600 hover:text-red-700"
              >
                Sil
              </button>
            </div>
            <ImageUpload
              bucket="pages"
              value={item.image_url}
              onChange={(url) => handleItemChange(index, 'image_url', url)}
              label="Sekil"
            />
            <FormField
              label="Alt bashliq"
              name={`journey_subtitle_${block.id}_${index}`}
              value={item.subtitle}
              onChange={(v) => handleItemChange(index, 'subtitle', v)}
            />
            <FormField
              label="Aciklama"
              name={`journey_desc_${block.id}_${index}`}
              type="textarea"
              value={item.description}
              onChange={(v) => handleItemChange(index, 'description', v)}
              rows={3}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddItem}
        className="text-sm font-medium tracking-tight text-primary hover:text-primary-600"
      >
        + Yeni element
      </button>
    </div>
  );
}
