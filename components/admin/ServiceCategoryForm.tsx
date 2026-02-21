'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';

interface ServiceCategoryFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    icon: string;
    description: string;
    image_url: string;
    sort_order: number;
    is_visible: boolean;
  };
  redirectToEdit?: boolean;
}

export default function ServiceCategoryForm({ initialData, redirectToEdit }: ServiceCategoryFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [icon, setIcon] = useState(initialData?.icon ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? '');
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0);
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
      icon,
      description,
      image_url: imageUrl || undefined,
      sort_order: sortOrder,
      is_visible: isVisible,
    };

    try {
      let result;
      if (isEditing) {
        const { updateServiceCategory } = await import('@/lib/actions/service-categories');
        result = await updateServiceCategory(initialData.id, body);
      } else {
        const { createServiceCategory } = await import('@/lib/actions/service-categories');
        result = await createServiceCategory(body);
      }

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        if (!isEditing && redirectToEdit && 'id' in result && result.id) {
          router.push(`/admin/dashboard/services/${result.id}/edit`);
        } else {
          router.push('/admin/dashboard/services');
        }
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
        <FormField label="Slug" name="slug" value={slug} onChange={setSlug} required placeholder="coaching" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Icon (emoji)" name="icon" value={icon} onChange={setIcon} placeholder="🎯" />
        <FormField label="Sıra" name="sort_order" type="number" value={sortOrder} onChange={(v) => setSortOrder(Number(v))} />
      </div>

      <FormField label="Təsvir" name="description" type="textarea" value={description} onChange={setDescription} rows={3} />

      <ImageUpload bucket="services" value={imageUrl} onChange={setImageUrl} label="Kateqoriya şəkli" />

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
