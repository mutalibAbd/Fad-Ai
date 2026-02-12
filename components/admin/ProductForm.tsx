'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';

interface Feature {
  id: string;
  title: string;
  description: string;
  sort_order: number;
}

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
    features?: Feature[];
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

  const [features, setFeatures] = useState<Feature[]>(initialData?.features ?? []);
  const [featureLoading, setFeatureLoading] = useState<string | null>(null);

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

  const handleAddFeature = async () => {
    if (!initialData) return;
    setFeatureLoading('new');

    try {
      const { createProductFeature } = await import('@/lib/actions/products');
      const result = await createProductFeature({
        product_id: initialData.id,
        title: 'Yeni xüsusiyyət',
        description: '',
        sort_order: features.length,
      });

      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    } catch {
      setError('Xüsusiyyət əlavə edilə bilmədi');
    }
    setFeatureLoading(null);
  };

  const handleUpdateFeature = async (featureId: string, data: { title?: string; description?: string; sort_order?: number }) => {
    setFeatureLoading(featureId);

    try {
      const { updateProductFeature } = await import('@/lib/actions/products');
      const result = await updateProductFeature(featureId, data);

      if (result.error) {
        setError(result.error);
      }
    } catch {
      setError('Xüsusiyyət yenilənə bilmədi');
    }
    setFeatureLoading(null);
  };

  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm('Bu xüsusiyyəti silmək istəyirsiniz?')) return;
    setFeatureLoading(featureId);

    try {
      const { deleteProductFeature } = await import('@/lib/actions/products');
      const result = await deleteProductFeature(featureId);

      if (result.error) {
        setError(result.error);
      } else {
        setFeatures((prev) => prev.filter((f) => f.id !== featureId));
      }
    } catch {
      setError('Xüsusiyyət silinə bilmədi');
    }
    setFeatureLoading(null);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <form onSubmit={handleSubmit} className="space-y-5">
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

        {/* Features Section - only in edit mode */}
        {isEditing && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold tracking-tight text-text-primary">
                Xüsusiyyətlər
              </h2>
              <button
                type="button"
                onClick={handleAddFeature}
                disabled={featureLoading === 'new'}
                className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium tracking-tight hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                {featureLoading === 'new' ? 'Əlavə edilir...' : '+ Əlavə et'}
              </button>
            </div>

            {features.length === 0 ? (
              <p className="text-sm text-text-secondary tracking-tight">
                Hələ xüsusiyyət əlavə edilməyib. Yuxarıdakı düyməni klikləyin.
              </p>
            ) : (
              <div className="space-y-4">
                {features.map((feature) => (
                  <FeatureRow
                    key={feature.id}
                    feature={feature}
                    loading={featureLoading === feature.id}
                    onUpdate={handleUpdateFeature}
                    onDelete={handleDeleteFeature}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-800 tracking-tight text-sm">{error}</p>
          </div>
        )}

        <div className="border-t border-slate-200 pt-6">
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
        </div>

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
    </div>
  );
}

function FeatureRow({
  feature,
  loading,
  onUpdate,
  onDelete,
}: {
  feature: Feature;
  loading: boolean;
  onUpdate: (id: string, data: { title?: string; description?: string; sort_order?: number }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [title, setTitle] = useState(feature.title);
  const [description, setDescription] = useState(feature.description);
  const [sortOrder, setSortOrder] = useState(feature.sort_order);
  const [dirty, setDirty] = useState(false);

  const handleChange = (field: 'title' | 'description' | 'sort_order', value: string | number) => {
    if (field === 'title') setTitle(value as string);
    else if (field === 'description') setDescription(value as string);
    else setSortOrder(value as number);
    setDirty(true);
  };

  const handleSave = async () => {
    await onUpdate(feature.id, { title, description, sort_order: sortOrder });
    setDirty(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-white">
      <div className="grid grid-cols-[1fr_80px] gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Xüsusiyyət adı"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => handleChange('sort_order', Number(e.target.value))}
          placeholder="Sıra"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
      <textarea
        value={description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Təsvir (istəyə bağlı)"
        rows={2}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
      />
      <div className="flex justify-end gap-2">
        {dirty && (
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-medium tracking-tight hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saxlanılır...' : 'Yadda saxla'}
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(feature.id)}
          disabled={loading}
          className="text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg text-xs font-medium tracking-tight transition-colors disabled:opacity-50"
        >
          Sil
        </button>
      </div>
    </div>
  );
}
