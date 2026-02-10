'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteProduct, toggleProductVisibility } from '@/lib/actions/products';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

interface Product {
  id: string;
  slug: string;
  icon: string;
  title: string;
  is_visible: boolean;
  sort_order: number;
}

export default function ProductListClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    await deleteProduct(deleteId);
    setDeleteId(null);
    setLoading(false);
    router.refresh();
  };

  const handleToggle = async (id: string, current: boolean) => {
    await toggleProductVisibility(id, !current);
    router.refresh();
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Icon</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Məhsul</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Slug</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Sıra</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase text-right">Əməliyyat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-text-secondary tracking-tight">
                  Məhsul yoxdur
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-xl">{product.icon}</td>
                  <td className="px-6 py-4 text-sm font-medium text-text-primary tracking-tight">
                    {product.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary tracking-tight font-mono">
                    {product.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary tracking-tight">
                    {product.sort_order}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggle(product.id, product.is_visible)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium tracking-tight ${
                        product.is_visible
                          ? 'bg-green-50 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {product.is_visible ? 'Aktiv' : 'Gizli'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/dashboard/products/${product.id}/edit`}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium tracking-tight text-primary hover:bg-primary/5 transition-colors"
                      >
                        Redaktə
                      </Link>
                      <button
                        onClick={() => setDeleteId(product.id)}
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
        title="Məhsulu silmək istəyirsiniz?"
        message="Bu məhsul və ona aid bütün məlumatlar silinəcək."
      />
    </>
  );
}
