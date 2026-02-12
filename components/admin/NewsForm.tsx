'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';

interface NewsFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    image_url: string;
    published_at: string;
    is_visible: boolean;
  };
}

export default function NewsForm({ initialData }: NewsFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [summary, setSummary] = useState(initialData?.summary ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? '');
  const [publishedAt, setPublishedAt] = useState(
    initialData?.published_at ?? new Date().toISOString().slice(0, 16)
  );
  const [isVisible, setIsVisible] = useState(initialData?.is_visible ?? true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const body = {
      title,
      slug,
      summary,
      content,
      image_url: imageUrl || undefined,
      published_at: publishedAt,
      is_visible: isVisible,
    };

    try {
      let result;
      if (isEditing) {
        const { updateNews } = await import('@/lib/actions/news');
        result = await updateNews(initialData.id, body);
      } else {
        const { createNews } = await import('@/lib/actions/news');
        result = await createNews(body);
      }

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push('/admin/dashboard/news');
        router.refresh();
      }
    } catch {
      setError('Xəta baş verdi');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Başlıq" name="title" value={title} onChange={setTitle} required />
        <FormField label="Slug" name="slug" value={slug} onChange={setSlug} required placeholder="news-article-slug" />
      </div>

      <FormField
        label="Nəşr tarixi"
        name="published_at"
        value={publishedAt}
        onChange={setPublishedAt}
        placeholder="2024-01-15T10:00"
      />

      <FormField
        label="Xülasə"
        name="summary"
        type="textarea"
        value={summary}
        onChange={setSummary}
        rows={3}
        placeholder="Xəbərin qısa xülasəsi..."
      />

      <FormField
        label="Məzmun"
        name="content"
        type="textarea"
        value={content}
        onChange={setContent}
        rows={10}
        placeholder="Xəbərin ətraflı məzmunu..."
      />

      <ImageUpload bucket="news" value={imageUrl} onChange={setImageUrl} label="Xəbər şəkli" />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_visible"
          checked={isVisible}
          onChange={(e) => setIsVisible(e.target.checked)}
          className="rounded border-slate-300"
        />
        <label htmlFor="is_visible" className="text-sm text-text-primary tracking-tight">
          Saytda göstər
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-red-800 tracking-tight text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium tracking-tight hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saxlanılır...' : isEditing ? 'Yenilə' : 'Yarat'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl text-sm font-medium tracking-tight text-text-secondary hover:bg-slate-50 transition-colors"
        >
          Ləğv et
        </button>
      </div>
    </form>
  );
}
