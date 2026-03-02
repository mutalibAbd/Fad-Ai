'use client';

import { useState } from 'react';
import { updateSiteSetting } from '@/lib/actions/settings';

interface AchievementItem {
  icon: string;
  text: string;
}

interface Props {
  achievements: AchievementItem[];
}

export default function AchievementsEditorClient({ achievements: initial }: Props) {
  const [items, setItems] = useState<AchievementItem[]>(initial);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const addItem = () => {
    setItems([...items, { icon: '', text: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof AchievementItem, value: string) => {
    setItems(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    const filtered = items.filter((item) => item.text.trim() !== '');
    const result = await updateSiteSetting('achievements', filtered as unknown as import('@/lib/supabase/database.types').Json);
    if (result.error) {
      setMessage(`Xəta: ${result.error}`);
    } else {
      setMessage('Yadda saxlanıldı');
      setItems(filtered);
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-text-primary mb-4">Nailiyyətlər</h2>
      <p className="text-sm text-text-secondary mb-6">
        Haqqımızda səhifəsində göstəriləcək nailiyyətlər siyahısı
      </p>

      <div className="space-y-3 mb-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item.icon}
              onChange={(e) => updateItem(index, 'icon', e.target.value)}
              placeholder="🏆"
              className="w-14 px-2 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-text-primary text-center text-lg"
            />
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateItem(index, 'text', e.target.value)}
              placeholder="Nailiyyət mətni..."
              className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-text-primary text-sm"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="px-2 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm"
            >
              Sil
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium mb-6 block"
      >
        + Nailiyyət əlavə et
      </button>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
        >
          {loading ? 'Saxlanılır...' : 'Yadda saxla'}
        </button>
        {message && (
          <span className={`text-sm ${message.startsWith('Xəta') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
