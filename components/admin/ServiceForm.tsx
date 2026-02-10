'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';

interface ServiceFormProps {
  initialData?: {
    id: string;
    icon: string;
    title: string;
    description: string;
    details: string[];
    sort_order: number;
    is_visible: boolean;
  };
}

export default function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [icon, setIcon] = useState(initialData?.icon ?? '');
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [detailsText, setDetailsText] = useState(
    initialData?.details ? initialData.details.join('\n') : ''
  );
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0);
  const [isVisible, setIsVisible] = useState(initialData?.is_visible ?? true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const details = detailsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const body = {
      icon,
      title,
      description,
      details,
      sort_order: sortOrder,
      is_visible: isVisible,
    };

    try {
      let result;
      if (isEditing) {
        const { updateService } = await import('@/lib/actions/services');
        result = await updateService(initialData.id, body);
      } else {
        const { createService } = await import('@/lib/actions/services');
        result = await createService(body);
      }

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push('/admin/dashboard/services');
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
        <FormField
          label="Başlıq"
          name="title"
          value={title}
          onChange={setTitle}
          required
        />
        <FormField
          label="Icon (emoji)"
          name="icon"
          value={icon}
          onChange={setIcon}
          required
          placeholder="🛠️"
        />
      </div>

      <FormField
        label="Sıra"
        name="sort_order"
        type="number"
        value={sortOrder}
        onChange={(v) => setSortOrder(Number(v))}
      />

      <FormField
        label="Təsvir"
        name="description"
        type="textarea"
        value={description}
        onChange={setDescription}
        rows={3}
      />

      <FormField
        label="Detallar (hər sətir ayrı element olacaq)"
        name="details"
        type="textarea"
        value={detailsText}
        onChange={setDetailsText}
        rows={6}
        placeholder={"Birinci detal\nİkinci detal\nÜçüncü detal"}
      />

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
