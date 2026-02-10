'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteStandard } from '@/lib/actions/standards';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

interface Standard {
  id: string;
  icon: string;
  title: string;
  category: string;
  sort_order: number;
  is_visible: boolean;
}

const categoryBadge: Record<string, { label: string; classes: string }> = {
  main: {
    label: 'Əsas',
    classes: 'bg-blue-50 text-blue-700',
  },
  additional: {
    label: 'Əlavə',
    classes: 'bg-purple-50 text-purple-700',
  },
  biometric: {
    label: 'Biometrik',
    classes: 'bg-green-50 text-green-700',
  },
};

export default function StandardListClient({ standards }: { standards: Standard[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    await deleteStandard(deleteId);
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
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Standart</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Kateqoriya</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Sıra</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase text-right">Əməliyyat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {standards.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-text-secondary tracking-tight">
                  Standart yoxdur
                </td>
              </tr>
            ) : (
              standards.map((standard) => {
                const badge = categoryBadge[standard.category] ?? {
                  label: standard.category,
                  classes: 'bg-slate-50 text-slate-600',
                };

                return (
                  <tr key={standard.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-xl">{standard.icon}</td>
                    <td className="px-6 py-4 text-sm font-medium text-text-primary tracking-tight">
                      {standard.title}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium tracking-tight ${badge.classes}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary tracking-tight">
                      {standard.sort_order}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium tracking-tight ${
                          standard.is_visible
                            ? 'bg-green-50 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {standard.is_visible ? 'Aktiv' : 'Gizli'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/dashboard/standards/${standard.id}/edit`}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium tracking-tight text-primary hover:bg-primary/5 transition-colors"
                        >
                          Redaktə
                        </Link>
                        <button
                          onClick={() => setDeleteId(standard.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium tracking-tight text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={loading}
        title="Standartı silmək istəyirsiniz?"
        message="Bu standart və ona aid bütün məlumatlar silinəcək."
      />
    </>
  );
}
