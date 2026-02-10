'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface ImageUploadProps {
  bucket: string;
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({
  bucket,
  value,
  onChange,
  label = 'Şəkil',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Yalnız şəkil faylları yükləyə bilərsiniz');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Fayl 5MB-dan böyük olmamalıdır');
      return;
    }

    setError('');
    setUploading(true);

    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    onChange(data.publicUrl);
    setUploading(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-text-primary tracking-tight mb-1.5">
        {label}
      </label>

      {value && (
        <div className="mb-3 relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-xl border border-slate-200"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
          >
            x
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="cursor-pointer px-4 py-2 rounded-xl text-sm font-medium tracking-tight bg-slate-100 text-text-secondary hover:bg-slate-200 transition-colors">
          {uploading ? 'Yüklənir...' : 'Şəkil seç'}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="və ya URL daxil edin"
          className="flex-1 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-text-primary tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600 tracking-tight">{error}</p>
      )}
    </div>
  );
}
