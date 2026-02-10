'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteProject, toggleProjectVisibility } from '@/lib/actions/projects';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

interface Project {
  id: string;
  title: string;
  status: string;
  is_visible: boolean;
  created_at: string;
}

const statusLabels: Record<string, { label: string; className: string }> = {
  pending: { label: 'Planlaşdırılır', className: 'bg-blue-50 text-blue-700' },
  in_progress: { label: 'Aktiv', className: 'bg-green-50 text-green-700' },
  completed: { label: 'Tamamlandı', className: 'bg-slate-100 text-slate-600' },
};

export default function ProjectListClient({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    await deleteProject(deleteId);
    setDeleteId(null);
    setLoading(false);
    router.refresh();
  };

  const handleToggle = async (id: string, current: boolean) => {
    await toggleProjectVisibility(id, !current);
    router.refresh();
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Layihə</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Görünürlük</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase">Tarix</th>
              <th className="px-6 py-3 text-xs font-medium text-text-secondary tracking-tight uppercase text-right">Əməliyyat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-text-secondary tracking-tight">
                  Layihə yoxdur
                </td>
              </tr>
            ) : (
              projects.map((project) => {
                const statusInfo = statusLabels[project.status] ?? { label: project.status, className: 'bg-slate-100 text-slate-500' };
                return (
                  <tr key={project.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-text-primary tracking-tight">
                      {project.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium tracking-tight ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(project.id, project.is_visible)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium tracking-tight ${
                          project.is_visible
                            ? 'bg-green-50 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {project.is_visible ? 'Aktiv' : 'Gizli'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary tracking-tight">
                      {new Date(project.created_at).toLocaleDateString('az-AZ')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/dashboard/projects/${project.id}/edit`}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium tracking-tight text-primary hover:bg-primary/5 transition-colors"
                        >
                          Redaktə
                        </Link>
                        <button
                          onClick={() => setDeleteId(project.id)}
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
        title="Layihəni silmək istəyirsiniz?"
        message="Bu layihə birdəfəlik silinəcək."
      />
    </>
  );
}
