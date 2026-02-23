'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { ChevronDown } from 'lucide-react';

/* ── Slug helper ── */

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ə/g, 'e')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/* ── Types ── */

interface CategoryData {
  id: string;
  title: string;
  slug: string;
  icon: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_visible: boolean;
}

interface ServiceData {
  id: string;
  icon: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  details: string[];
  image_url: string;
  sort_order: number;
  is_visible: boolean;
}

interface Props {
  category: CategoryData;
  initialServices: ServiceData[];
}

/* ── Module-level helpers (avoid focus loss from re-mount) ── */

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h2 className="text-lg font-semibold tracking-tight text-text-primary mb-6">{title}</h2>
      {children}
    </div>
  );
}

function StatusMessage({ error, success }: { error: string; success: string }) {
  if (!error && !success) return null;
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-3 mt-4">
        <p className="text-red-800 tracking-tight text-sm">{error}</p>
      </div>
    );
  }
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-3 mt-4">
      <p className="text-green-800 tracking-tight text-sm">{success}</p>
    </div>
  );
}

/* ── Main Editor ── */

export default function ServiceCategoryEditorClient({ category, initialServices }: Props) {
  const router = useRouter();

  /* --- Category state --- */
  const [catTitle, setCatTitle] = useState(category.title);
  const [catSlug, setCatSlug] = useState(category.slug);
  const [catIcon, setCatIcon] = useState(category.icon);
  const [catDescription, setCatDescription] = useState(category.description);
  const [catImageUrl, setCatImageUrl] = useState(category.image_url);
  const [catSortOrder, setCatSortOrder] = useState(category.sort_order);
  const [catIsVisible, setCatIsVisible] = useState(category.is_visible);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState('');
  const [catSuccess, setCatSuccess] = useState('');

  /* --- Services state --- */
  const [services, setServices] = useState<(ServiceData & { _isNew?: boolean })[]>(initialServices);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [svcLoadingIdx, setSvcLoadingIdx] = useState<number | null>(null);
  const [svcError, setSvcError] = useState('');
  const [svcSuccess, setSvcSuccess] = useState('');
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ── Category save ── */
  const handleSaveCategory = async () => {
    setCatLoading(true);
    setCatError('');
    setCatSuccess('');
    try {
      const { updateServiceCategory } = await import('@/lib/actions/service-categories');
      const result = await updateServiceCategory(category.id, {
        title: catTitle,
        slug: catSlug,
        icon: catIcon,
        description: catDescription,
        image_url: catImageUrl || null,
        sort_order: catSortOrder,
        is_visible: catIsVisible,
      });
      if (result.error) {
        setCatError(result.error);
      } else {
        setCatSuccess('Kateqoriya yeniləndi');
        router.refresh();
      }
    } catch {
      setCatError('Xəta baş verdi');
    }
    setCatLoading(false);
  };

  /* ── Service helpers ── */
  const updateService = (idx: number, field: string, value: unknown) => {
    setServices((prev) =>
      prev.map((svc, i) => (i === idx ? { ...svc, [field]: value } : svc)),
    );
  };

  const addService = () => {
    const newSvc: ServiceData & { _isNew?: boolean } = {
      id: `new-${Date.now()}`,
      icon: '',
      title: '',
      slug: '',
      description: '',
      content: '',
      details: [],
      image_url: '',
      sort_order: services.length,
      is_visible: true,
      _isNew: true,
    };
    setServices((prev) => [...prev, newSvc]);
    setExpandedIndex(services.length);
  };

  const handleSaveService = async (idx: number) => {
    const svc = services[idx];
    setSvcLoadingIdx(idx);
    setSvcError('');
    setSvcSuccess('');

    const body = {
      title: svc.title,
      slug: toSlug(svc.title) || undefined,
      icon: svc.icon,
      description: svc.description,
      content: svc.content || undefined,
      details: svc.details,
      image_url: svc.image_url || undefined,
      category_id: category.id,
      sort_order: idx,
      is_visible: svc.is_visible,
    };

    try {
      if (svc._isNew) {
        const { createService } = await import('@/lib/actions/services');
        const result = await createService(body);
        if (result.error) {
          setSvcError(result.error);
        } else {
          setSvcSuccess('Xidmət yaradıldı');
          router.refresh();
        }
      } else {
        const { updateService: updateSvc } = await import('@/lib/actions/services');
        const result = await updateSvc(svc.id, body);
        if (result.error) {
          setSvcError(result.error);
        } else {
          setSvcSuccess('Xidmət yeniləndi');
          router.refresh();
        }
      }
    } catch {
      setSvcError('Xəta baş verdi');
    }
    setSvcLoadingIdx(null);
  };

  const handleDeleteService = async () => {
    if (deleteIdx === null) return;
    const svc = services[deleteIdx];
    setDeleteLoading(true);

    if (svc._isNew) {
      setServices((prev) => prev.filter((_, i) => i !== deleteIdx));
      setDeleteIdx(null);
      setDeleteLoading(false);
      if (expandedIndex === deleteIdx) setExpandedIndex(null);
      return;
    }

    try {
      const { deleteService } = await import('@/lib/actions/services');
      const result = await deleteService(svc.id);
      if (result.error) {
        setSvcError(result.error);
      } else {
        setServices((prev) => prev.filter((_, i) => i !== deleteIdx));
        if (expandedIndex === deleteIdx) setExpandedIndex(null);
        router.refresh();
      }
    } catch {
      setSvcError('Xəta baş verdi');
    }
    setDeleteIdx(null);
    setDeleteLoading(false);
  };

  const moveService = (idx: number, direction: -1 | 1) => {
    const target = idx + direction;
    if (target < 0 || target >= services.length) return;
    setServices((prev) => {
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
    if (expandedIndex === idx) setExpandedIndex(target);
    else if (expandedIndex === target) setExpandedIndex(idx);
  };

  /* ── Render ── */
  return (
    <div className="space-y-8 max-w-3xl">
      {/* ── Category section ── */}
      <SectionCard title="Kateqoriya məlumatları">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Başlıq" name="cat_title" value={catTitle} onChange={setCatTitle} required />
            <FormField label="Slug" name="cat_slug" value={catSlug} onChange={setCatSlug} required placeholder="coaching" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Icon (emoji)" name="cat_icon" value={catIcon} onChange={setCatIcon} placeholder="🎯" />
            <FormField label="Sıra" name="cat_sort_order" type="number" value={catSortOrder} onChange={(v) => setCatSortOrder(Number(v))} />
          </div>
          <FormField label="Təsvir" name="cat_description" type="textarea" value={catDescription} onChange={setCatDescription} rows={3} />
          <ImageUpload bucket="services" value={catImageUrl} onChange={setCatImageUrl} label="Kateqoriya şəkli" />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="cat_is_visible" checked={catIsVisible} onChange={(e) => setCatIsVisible(e.target.checked)} className="rounded border-slate-300" />
            <label htmlFor="cat_is_visible" className="text-sm text-text-primary tracking-tight">Saytda göstər</label>
          </div>
          <StatusMessage error={catError} success={catSuccess} />
          <button
            type="button"
            onClick={handleSaveCategory}
            disabled={catLoading}
            className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium tracking-tight hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {catLoading ? 'Saxlanılır...' : 'Kateqoriyanı yadda saxla'}
          </button>
        </div>
      </SectionCard>

      {/* ── Services section ── */}
      <SectionCard title={`Xidmətlər (${services.length})`}>
        <StatusMessage error={svcError} success={svcSuccess} />

        <div className="space-y-4 mt-2">
          {services.map((svc, idx) => {
            const isExpanded = expandedIndex === idx;
            const isLoading = svcLoadingIdx === idx;

            return (
              <div
                key={svc.id}
                className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden"
              >
                {/* Collapsed header */}
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    {svc.icon && <span className="text-lg">{svc.icon}</span>}
                    <span className="text-sm font-medium text-text-primary tracking-tight">
                      {svc.title || 'Yeni xidmət'}
                    </span>
                    {svc._isNew && (
                      <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg">Yadda saxlanmayıb</span>
                    )}
                    {!svc._isNew && (
                      <span className={`text-xs px-2 py-0.5 rounded-lg ${svc.is_visible ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {svc.is_visible ? 'Aktiv' : 'Gizli'}
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Expanded form */}
                {isExpanded && (
                  <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                    <FormField label="Başlıq" name={`svc_title_${idx}`} value={svc.title} onChange={(v) => updateService(idx, 'title', v)} required />
                    <ImageUpload bucket="services" value={svc.image_url} onChange={(v) => updateService(idx, 'image_url', v)} label="Xidmət şəkli" />
                    <FormField label="Qısa təsvir" name={`svc_desc_${idx}`} type="textarea" value={svc.description} onChange={(v) => updateService(idx, 'description', v)} rows={2} placeholder="Xidmət haqqında qısa məlumat" />

                    <p className="text-xs text-text-secondary tracking-tight">
                      URL: /services/{toSlug(svc.title) || '...'}
                    </p>

                    {!svc._isNew && (
                      <Link
                        href={`/admin/dashboard/services/service-blocks/${svc.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-600 tracking-tight transition-colors"
                      >
                        Səhifə blokları &rarr;
                      </Link>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleSaveService(idx)}
                        disabled={isLoading}
                        className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-medium tracking-tight hover:bg-primary-600 transition-colors disabled:opacity-50"
                      >
                        {isLoading ? 'Saxlanılır...' : svc._isNew ? 'Yarat' : 'Yadda saxla'}
                      </button>
                      <button
                        type="button"
                        onClick={() => moveService(idx, -1)}
                        disabled={idx === 0}
                        className="text-xs font-medium text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors px-2 py-2"
                      >
                        Yuxarı
                      </button>
                      <button
                        type="button"
                        onClick={() => moveService(idx, 1)}
                        disabled={idx === services.length - 1}
                        className="text-xs font-medium text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors px-2 py-2"
                      >
                        Aşağı
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteIdx(idx)}
                        className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors px-2 py-2 ml-auto"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={addService}
          className="mt-4 text-sm font-medium tracking-tight text-primary hover:text-primary-600 transition-colors"
        >
          + Yeni xidmət əlavə et
        </button>
      </SectionCard>

      <DeleteConfirmDialog
        open={deleteIdx !== null}
        onClose={() => setDeleteIdx(null)}
        onConfirm={handleDeleteService}
        loading={deleteLoading}
        title="Xidməti silmək istəyirsiniz?"
        message="Bu xidmət və ona aid bütün məlumatlar silinəcək."
      />
    </div>
  );
}
