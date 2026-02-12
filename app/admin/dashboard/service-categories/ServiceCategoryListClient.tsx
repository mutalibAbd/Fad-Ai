'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteServiceCategory } from '@/lib/actions/service-categories';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

interface ServiceCategory {
  id: string;
  title: string;
  slug: string;
  icon: string;
  sort_order: number;
  is_visible: boolean;
}

export default function ServiceCategoryListClient({ categories }: { categories: ServiceCategory[] }) {
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
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Sıra</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase text-right">Əməliyyat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-text-secondary tracking-tight">
                  Kateqoriya yoxdur
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-xl">{category.icon}</td>
                  <td className="px-6 py-4 text-sm font-medium text-text-primary tracking-tight">
                    {category.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary tracking-tight">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary tracking-tight">
                    {category.sort_order}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium tracking-tight ${
                        category.is_visible
                          ? 'bg-green-50 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {category.is_visible ? 'Aktiv' : 'Gizli'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/dashboard/service-categories/${category.id}/edit`}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium tracking-tight text-primary hover:bg-primary/5 transition-colors"
                      >
                        Redakte
                      </Link>
                      <button
                        onClick={() => setDeleteId(category.id)}
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
        message="Bu kateqoriya və ona aid bütün məlumatlar silinəcək."
      />
    </>
  );
}
