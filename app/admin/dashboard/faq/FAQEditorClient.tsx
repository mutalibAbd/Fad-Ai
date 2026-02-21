'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';
import type { FAQItem } from '@/lib/types';

interface Props {
  initialItems: FAQItem[];
}

export default function FAQEditorClient({ initialItems }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<FAQItem[]>(
    initialItems.length > 0 ? initialItems : [],
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const updateItem = (index: number, field: keyof FAQItem, value: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { question: '', answer: '' }]);
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const filtered = items.filter((item) => item.question.trim() !== '');
      const { updateSiteSetting } = await import('@/lib/actions/settings');
      const result = await updateSiteSetting('faq', JSON.parse(JSON.stringify(filtered)));

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('FAQ yeniləndi');
        router.refresh();
      }
    } catch {
      setError('Xəta baş verdi');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-red-800 tracking-tight text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <p className="text-green-800 tracking-tight text-sm">{success}</p>
        </div>
      )}

      {items.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-text-secondary tracking-tight">
              Sual {index + 1}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
                className="text-xs font-medium text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors"
              >
                Yuxarı
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, 1)}
                disabled={index === items.length - 1}
                className="text-xs font-medium text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors"
              >
                Aşağı
              </button>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors ml-2"
              >
                Sil
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <FormField
              label="Sual"
              name={`faq_q_${index}`}
              value={item.question}
              onChange={(v) => updateItem(index, 'question', v)}
              required
            />
            <FormField
              label="Cavab"
              name={`faq_a_${index}`}
              type="textarea"
              value={item.answer}
              onChange={(v) => updateItem(index, 'answer', v)}
              rows={4}
            />
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={addItem}
          className="text-sm font-medium tracking-tight text-primary hover:text-primary-600 transition-colors"
        >
          + Yeni sual əlavə et
        </button>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium tracking-tight hover:bg-primary-600 transition-colors disabled:opacity-50"
      >
        {loading ? 'Saxlanılır...' : 'FAQ-ı yadda saxla'}
      </button>
    </div>
  );
}
