'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';
import {
  Headset,
  FileText,
  ShieldCheck,
  Wrench,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Settings,
  Phone,
  Mail,
  Monitor,
  Heart,
  Stethoscope,
  Clock,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICON_OPTIONS: { name: string; label: string; Icon: LucideIcon }[] = [
  { name: 'Headset', label: 'Qulaqlıq', Icon: Headset },
  { name: 'FileText', label: 'Sənəd', Icon: FileText },
  { name: 'ShieldCheck', label: 'Təhlükəsizlik', Icon: ShieldCheck },
  { name: 'Wrench', label: 'Alət', Icon: Wrench },
  { name: 'HelpCircle', label: 'Kömək', Icon: HelpCircle },
  { name: 'BookOpen', label: 'Kitab', Icon: BookOpen },
  { name: 'MessageSquare', label: 'Mesaj', Icon: MessageSquare },
  { name: 'Settings', label: 'Parametrlər', Icon: Settings },
  { name: 'Phone', label: 'Telefon', Icon: Phone },
  { name: 'Mail', label: 'E-poçt', Icon: Mail },
  { name: 'Monitor', label: 'Monitor', Icon: Monitor },
  { name: 'Heart', label: 'Ürək', Icon: Heart },
  { name: 'Stethoscope', label: 'Stetoskop', Icon: Stethoscope },
  { name: 'Clock', label: 'Saat', Icon: Clock },
  { name: 'Users', label: 'İstifadəçilər', Icon: Users },
];

interface SupportFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    icon: string;
    image_url: string;
    sort_order: number;
    is_visible: boolean;
  };
}

export default function SupportForm({ initialData }: SupportFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [icon, setIcon] = useState(initialData?.icon ?? 'Headset');
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
      description,
      content,
      icon,
      image_url: imageUrl || undefined,
      sort_order: sortOrder,
      is_visible: isVisible,
    };

    try {
      let result;
      if (isEditing) {
        const { updateSupportType } = await import('@/lib/actions/support');
        result = await updateSupportType(initialData.id, body);
      } else {
        const { createSupportType } = await import('@/lib/actions/support');
        result = await createSupportType(body);
      }

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push('/admin/dashboard/support');
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
        <FormField label="Slug" name="slug" value={slug} onChange={setSlug} required placeholder="technical-support" />
      </div>

      {/* Icon Picker */}
      <div>
        <label className="block text-sm font-medium text-text-primary tracking-tight mb-2">
          İkon
        </label>
        <div className="grid grid-cols-5 gap-3">
          {ICON_OPTIONS.map(({ name, label, Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => setIcon(name)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                icon === name
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-slate-100 bg-white text-text-secondary hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-6 h-6" strokeWidth={1.8} />
              <span className="text-[10px] font-medium tracking-tight leading-tight text-center">
                {label}
              </span>
            </button>
          ))}
        </div>
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
        label="Məzmun"
        name="content"
        type="textarea"
        value={content}
        onChange={setContent}
        rows={10}
        placeholder="Dəstək növü haqqında ətraflı məzmun..."
      />

      <ImageUpload bucket="support" value={imageUrl} onChange={setImageUrl} label="Dəstək şəkli" />

      <FormField
        label="Sıra"
        name="sort_order"
        type="number"
        value={sortOrder}
        onChange={(v) => setSortOrder(Number(v))}
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
