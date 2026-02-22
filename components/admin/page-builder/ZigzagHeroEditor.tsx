'use client';

import FormField from '@/components/admin/FormField';
import MultiImageUpload from './MultiImageUpload';
import type { PageBlock, ZigzagHeroContent } from '@/lib/types';

interface ZigzagHeroEditorProps {
  block: PageBlock;
  onUpdate: (updates: Partial<PageBlock>) => void;
}

export default function ZigzagHeroEditor({ block, onUpdate }: ZigzagHeroEditorProps) {
  const content = block.content as ZigzagHeroContent;

  const handleTitleChange = (value: string) => {
    onUpdate({ title: value });
  };

  const handleTextChange = (value: string) => {
    onUpdate({ content: { ...content, text: value } });
  };

  const handleImagesChange = (images: string[]) => {
    onUpdate({ content: { ...content, images } });
  };

  return (
    <div className="space-y-4">
      <FormField
        label="Bashliq"
        name={`block_title_${block.id}`}
        value={block.title}
        onChange={handleTitleChange}
      />
      <FormField
        label="Metn"
        name={`block_text_${block.id}`}
        type="textarea"
        value={content.text}
        onChange={handleTextChange}
        rows={5}
      />
      <MultiImageUpload
        bucket="pages"
        value={content.images}
        onChange={handleImagesChange}
        label="Sekiller (sag sutun)"
      />
    </div>
  );
}
