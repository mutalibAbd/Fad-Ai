'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteServiceCategory } from '@/lib/actions/service-categories';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

interface CategoryWithCount {
  id: string;
  icon: string;
  title: string;
  slug: string;
  sort_order: number;
  is_visible: boolean;
  serviceCount: number;
}

export default function ServiceCategoryListClient({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    await deleteServiceCategory(deleteId);
    setDeleteId(null);
    setLoading(false);
    router.refresh();
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Icon</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Kateqoriya</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Slug</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Xidmətlər</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Sıra</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase text-right">Əməliyyat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-text-secondary tracking-tight">
                  Kateqoriya yoxdur
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-xl">{cat.icon}</td>
                  <td className="px-6 py-4 text-sm font-medium text-text-primary tracking-tight">
                    {cat.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary tracking-tight">
                    {cat.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary tracking-tight">
                    {cat.serviceCount} xidmət
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary tracking-tight">
                    {cat.sort_order}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium tracking-tight ${
                        cat.is_visible
                          ? 'bg-green-50 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat.is_visible ? 'Aktiv' : 'Gizli'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/dashboard/services/${cat.id}/edit`}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium tracking-tight text-primary hover:bg-primary/5 transition-colors"
                      >
                        Redakte
                      </Link>
                      <button
                        onClick={() => setDeleteId(cat.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium tracking-tight text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={loading}
        title="Kateqoriyanı silmək istəyirsiniz?"
        message="Bu kateqoriya və ona aid bütün xidmətlər silinəcək."
      />
    </>
  );
}
