'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';

interface StandardFormProps {
  initialData?: {
    id: string;
    icon: string;
    acronym: string;
    full_name: string;
    title: string;
    description: string;
    features: string[];
    category: string;
    az_name: string;
    normal_range: string;
    measurement: string;
    sort_order: number;
    is_visible: boolean;
  };
}

export default function StandardForm({ initialData }: StandardFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [icon, setIcon] = useState(initialData?.icon ?? '');
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [acronym, setAcronym] = useState(initialData?.acronym ?? '');
  const [fullName, setFullName] = useState(initialData?.full_name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [featuresText, setFeaturesText] = useState(
    initialData?.features ? initialData.features.join('\n') : ''
  );
  const [category, setCategory] = useState(initialData?.category ?? 'main');
  const [azName, setAzName] = useState(initialData?.az_name ?? '');
  const [normalRange, setNormalRange] = useState(initialData?.normal_range ?? '');
  const [measurement, setMeasurement] = useState(initialData?.measurement ?? '');
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0);
  const [isVisible, setIsVisible] = useState(initialData?.is_visible ?? true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const features = featuresText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const body = {
      icon,
      title,
      acronym,
      full_name: fullName,
      description,
      features,
      category,
      az_name: azName,
      normal_range: normalRange,
      measurement,
      sort_order: sortOrder,
      is_visible: isVisible,
    };

    try {
      let result;
      if (isEditing) {
        const { updateStandard } = await import('@/lib/actions/standards');
        result = await updateStandard(initialData.id, body);
      } else {
        const { createStandard } = await import('@/lib/actions/standards');
        result = await createStandard(body);
      }

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push('/admin/dashboard/standards');
        router.refresh();
      }
    } catch {
      setError('Xəta baş verdi');
      setLoading(false);
    }
  };

  const categoryOptions = [
    { value: 'main', label: 'Əsas standart' },
    { value: 'additional', label: 'Əlavə standart' },
    { value: 'biometric', label: 'Biometrik göstərici' },
  ];

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
          placeholder="🔬"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Qısaltma"
          name="acronym"
          value={acronym}
          onChange={setAcronym}
          placeholder="ISO"
        />
        <FormField
          label="Tam adı"
          name="full_name"
          value={fullName}
          onChange={setFullName}
        />
      </div>

      <FormField
        label="Təsvir"
        name="description"
        type="textarea"
        value={description}
        onChange={setDescription}
        rows={3}
      />

      <FormField
        label="Xüsusiyyətlər (hər sətir bir element)"
        name="features"
        type="textarea"
        value={featuresText}
        onChange={setFeaturesText}
        rows={5}
        placeholder={"Yüksək dəqiqlik\nSürətli nəticə\nEtibarlı ölçmə"}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Kateqoriya"
          name="category"
          type="select"
          value={category}
          onChange={setCategory}
          options={categoryOptions}
          required
        />
        <FormField
          label="Sıra"
          name="sort_order"
          type="number"
          value={sortOrder}
          onChange={(v) => setSortOrder(Number(v))}
        />
      </div>

      {category === 'biometric' && (
        <div className="space-y-5 p-5 bg-green-50/50 rounded-2xl border border-green-100">
          <p className="text-sm font-semibold tracking-tight text-green-800">
            Biometrik göstərici məlumatları
          </p>
          <FormField
            label="Azərbaycanca adı"
            name="az_name"
            value={azName}
            onChange={setAzName}
            placeholder="Qan təzyiqi"
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Normal aralıq"
              name="normal_range"
              value={normalRange}
              onChange={setNormalRange}
              placeholder="120/80"
            />
            <FormField
              label="Ölçü vahidi"
              name="measurement"
              value={measurement}
              onChange={setMeasurement}
              placeholder="mmHg"
            />
          </div>
        </div>
      )}

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
