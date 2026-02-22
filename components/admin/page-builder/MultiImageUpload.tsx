'use client';

import ImageUpload from '@/components/admin/ImageUpload';

interface MultiImageUploadProps {
  bucket: string;
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}

export default function MultiImageUpload({
  bucket,
  value,
  onChange,
  label = 'Sekiller',
}: MultiImageUploadProps) {
  const handleAdd = () => {
    onChange([...value, '']);
  };

  const handleChange = (index: number, url: string) => {
    const next = [...value];
    next[index] = url;
    onChange(next);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-text-primary tracking-tight mb-1.5">
        {label}
      </label>
      <div className="space-y-3">
        {value.map((url, index) => (
          <div key={index} className="relative bg-slate-50/50 rounded-xl border border-slate-100 p-3">
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 z-10"
            >
              x
            </button>
            <ImageUpload
              bucket={bucket}
              value={url}
              onChange={(newUrl) => handleChange(index, newUrl)}
              label={`Sekil ${index + 1}`}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="mt-3 text-sm font-medium tracking-tight text-primary hover:text-primary-600"
      >
        + Yeni sekil
      </button>
    </div>
  );
}
