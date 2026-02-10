'use client';

import { Dialog } from '@headlessui/react';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

export default function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Silmək istədiyinizə əminsiniz?',
  message = 'Bu əməliyyat geri qaytarıla bilməz.',
  loading = false,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
          <Dialog.Title className="text-lg font-semibold tracking-tight text-text-primary">
            {title}
          </Dialog.Title>
          <p className="mt-2 text-sm text-text-secondary tracking-tight">
            {message}
          </p>
          <div className="mt-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-sm font-medium tracking-tight text-text-secondary hover:bg-slate-50 transition-colors"
            >
              Ləğv et
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-sm font-medium tracking-tight bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Silinir...' : 'Sil'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
