'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';

interface ProjectFormProps {
  initialData?: {
    id: string;
    title: string;
    summary: string;
    status: string;
    image_url: string;
    is_visible: boolean;
  };
}

const statusOptions = [
  { value: 'pending', label: 'Planlaşdırılır' },
  { value: 'in_progress', label: 'Aktiv' },
  { value: 'completed', label: 'Tamamlandı' },
];

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [summary, setSummary] = useState(initialData?.summary ?? '');
  const [status, setStatus] = useState(initialData?.status ?? 'pending');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? '');
  const [isVisible, setIsVisible] = useState(initialData?.is_visible ?? true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const body = {
      title,
      summary,
      status: status as 'pending' | 'in_progress' | 'completed',
      image_url: imageUrl || undefined,
      is_visible: isVisible,
    };

    try {
      let result;
      if (isEditing) {
        const { updateProject } = await import('@/lib/actions/projects');
        result = await updateProject(initialData.id, body);
      } else {
        const { createProject } = await import('@/lib/actions/projects');
        result = await createProject(body);
      }

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push('/admin/dashboard/projects');
        router.refresh();
      }
    } catch {
      setError('Xəta baş verdi');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <FormField label="Başlıq" name="title" value={title} onChange={setTitle} required />

      <FormField label="Xülasə" name="summary" type="textarea" value={summary} onChange={setSummary} rows={4} />

      <FormField
        label="Status"
        name="status"
        type="select"
        value={status}
        onChange={setStatus}
        options={statusOptions}
      />

      <ImageUpload bucket="site" value={imageUrl} onChange={setImageUrl} label="Layihə şəkli" />

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
