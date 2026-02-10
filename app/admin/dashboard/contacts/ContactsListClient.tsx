'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { markAsRead, markAsUnread, deleteSubmission } from '@/lib/actions/contacts';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean | null;
  created_at: string;
}

export default function ContactsListClient({ contacts }: { contacts: Contact[] }) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleToggleRead = async (id: string, isRead: boolean | null) => {
    if (isRead) {
      await markAsUnread(id);
    } else {
      await markAsRead(id);
    }
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    await deleteSubmission(deleteId);
    setDeleteId(null);
    setLoading(false);
    router.refresh();
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {contacts.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-text-secondary tracking-tight">Müraciət yoxdur</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {contacts.map((contact) => (
              <div key={contact.id}>
                <div
                  className={`px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors ${
                    !contact.is_read ? 'bg-primary/[0.02]' : ''
                  }`}
                  onClick={() =>
                    setExpandedId((prev) => (prev === contact.id ? null : contact.id))
                  }
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {!contact.is_read && (
                      <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary tracking-tight truncate">
                        {contact.full_name}
                        {contact.subject && (
                          <span className="text-text-secondary font-normal"> — {contact.subject}</span>
                        )}
                      </p>
                      <p className="text-xs text-text-secondary tracking-tight truncate">
                        {contact.email}
                        {contact.phone && ` | ${contact.phone}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <p className="text-xs text-text-secondary tracking-tight">
                      {new Date(contact.created_at).toLocaleDateString('az-AZ')}
                    </p>
                    <svg
                      className={`w-4 h-4 text-text-secondary transition-transform ${
                        expandedId === contact.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>

                {expandedId === contact.id && (
                  <div className="px-6 pb-4 bg-slate-50/50">
                    <div className="bg-white rounded-xl border border-slate-100 p-4 mb-3">
                      <p className="text-sm text-text-primary tracking-tight whitespace-pre-wrap">
                        {contact.message}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleRead(contact.id, contact.is_read)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium tracking-tight text-primary hover:bg-primary/5 transition-colors"
                      >
                        {contact.is_read ? 'Oxunmamış kimi işarələ' : 'Oxunmuş kimi işarələ'}
                      </button>
                      <button
                        onClick={() => setDeleteId(contact.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium tracking-tight text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={loading}
        title="Müraciəti silmək istəyirsiniz?"
        message="Bu müraciət birdəfəlik silinəcək."
      />
    </>
  );
}
