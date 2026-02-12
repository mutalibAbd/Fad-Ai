'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';

interface ProductFormProps {
  initialData?: {
    id: string;
    slug: string;
    icon: string;
    title: string;
    description: string;
    long_description: string;
    content: string;
    specifications: Record<string, string>;
    image_url: string;
    sort_order: number;
    is_visible: boolean;
  };
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [icon, setIcon] = useState(initialData?.icon ?? '');
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [longDescription, setLongDescription] = useState(initialData?.long_description ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? '');
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0);
  const [isVisible, setIsVisible] = useState(initialData?.is_visible ?? true);
  const [specsText, setSpecsText] = useState(
    initialData?.specifications
      ? Object.entries(initialData.specifications)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n')
      : ''
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const specifications: Record<string, string> = {};
    specsText
      .split('\n')
      .filter((line) => line.includes(':'))
      .forEach((line) => {
        const [key, ...rest] = line.split(':');
        specifications[key.trim()] = rest.join(':').trim();
      });

    const body = {
      slug,
      icon,
      title,
      description,
      long_description: longDescription,
      content,
      specifications,
      image_url: imageUrl,
      sort_order: sortOrder,
      is_visible: isVisible,
    };

    try {
      let result;
      if (isEditing) {
        const { updateProduct } = await import('@/lib/actions/products');
        result = await updateProduct(initialData.id, body);
      } else {
        const { createProduct } = await import('@/lib/actions/products');
        result = await createProduct(body);
      }

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push('/admin/dashboard/products');
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
        <FormField label="Slug" name="slug" value={slug} onChange={setSlug} required placeholder="radvision-pro" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Icon (emoji)" name="icon" value={icon} onChange={setIcon} required placeholder="🔬" />
        <FormField label="Sıra" name="sort_order" type="number" value={sortOrder} onChange={(v) => setSortOrder(Number(v))} />
      </div>

      <FormField label="Qısa təsvir" name="description" type="textarea" value={description} onChange={setDescription} rows={3} />

      <FormField label="Ətraflı təsvir" name="long_description" type="textarea" value={longDescription} onChange={setLongDescription} rows={6} />

      <FormField
        label="Məzmun (Blog / Markdown)"
        name="content"
        type="textarea"
        value={content}
        onChange={setContent}
        rows={10}
        placeholder="Məhsul haqqında ətraflı blog məzmunu..."
      />

      <FormField
        label="Spesifikasiyalar (hər sətir: açar: dəyər)"
        name="specifications"
        type="textarea"
        value={specsText}
        onChange={setSpecsText}
        rows={5}
        placeholder="Həcm: 15 inç&#10;Çəki: 2.5 kq"
      />

      <ImageUpload bucket="products" value={imageUrl} onChange={setImageUrl} label="Məhsul şəkli" />

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
