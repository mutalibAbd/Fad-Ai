'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import type { AboutContent, AboutStat } from '@/lib/types';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  linkedin_url: string | null;
  sort_order: number | null;
  is_visible: boolean | null;
}

interface Props {
  about: AboutContent;
  stats: AboutStat[];
  teamMembers: TeamMember[];
}

export default function AboutEditorClient({ about, stats, teamMembers }: Props) {
  const router = useRouter();

  // About content
  const [storyTitle, setStoryTitle] = useState(about.story_title);
  const [storyText, setStoryText] = useState(about.story_text);
  const [missionText, setMissionText] = useState(about.mission_text);

  // Stats
  const [statList, setStatList] = useState<AboutStat[]>(
    stats.length > 0 ? stats : [{ label: '', value: '' }]
  );

  // Team
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // New team member inline form
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSaveAbout = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { updateSiteSetting } = await import('@/lib/actions/settings');
      const result = await updateSiteSetting('about', {
        story_title: storyTitle,
        story_text: storyText,
        mission_text: missionText,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Haqqımızda məzmunu yeniləndi');
        router.refresh();
      }
    } catch {
      setError('Xəta baş verdi');
    }

    setLoading(false);
  };

  const handleSaveStats = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { updateSiteSetting } = await import('@/lib/actions/settings');
      const filtered = statList.filter((s) => s.label.trim() !== '');
      const result = await updateSiteSetting('about_stats', JSON.parse(JSON.stringify(filtered)));

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Statistikalar yeniləndi');
        router.refresh();
      }
    } catch {
      setError('Xəta baş verdi');
    }

    setLoading(false);
  };

  const handleDeleteTeamMember = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    try {
      const { deleteTeamMember } = await import('@/lib/actions/team');
      await deleteTeamMember(deleteId);
      setDeleteId(null);
      router.refresh();
    } catch {
      setError('Xəta baş verdi');
    }

    setDeleteLoading(false);
  };

  const handleAddTeamMember = async () => {
    if (!newName.trim() || !newRole.trim()) return;
    setLoading(true);

    try {
      const { createTeamMember } = await import('@/lib/actions/team');
      const result = await createTeamMember({ name: newName, role: newRole });

      if (result.error) {
        setError(result.error);
      } else {
        setNewName('');
        setNewRole('');
        setShowNewForm(false);
        setSuccess('Komanda üzvü əlavə edildi');
        router.refresh();
      }
    } catch {
      setError('Xəta baş verdi');
    }

    setLoading(false);
  };

  return (
    <div className="space-y-10 max-w-2xl">
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

      {/* About Content */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold tracking-tight text-text-primary mb-5">
          Şirkət Haqqında
        </h2>
        <div className="space-y-4">
          <FormField label="Bölmə başlığı" name="story_title" value={storyTitle} onChange={setStoryTitle} />
          <FormField label="Hekayə mətni" name="story_text" type="textarea" value={storyText} onChange={setStoryText} rows={5} />
          <FormField label="Missiya mətni" name="mission_text" type="textarea" value={missionText} onChange={setMissionText} rows={3} />
          <button
            type="button"
            onClick={handleSaveAbout}
            disabled={loading}
            className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium tracking-tight hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saxlanılır...' : 'Yadda saxla'}
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold tracking-tight text-text-primary mb-5">
          Statistikalar
        </h2>
        <div className="space-y-3">
          {statList.map((stat, index) => (
            <div key={index} className="flex items-end gap-3">
              <div className="flex-1">
                <FormField
                  label="Etiket"
                  name={`stat_label_${index}`}
                  value={stat.label}
                  onChange={(v) =>
                    setStatList((prev) =>
                      prev.map((s, i) => (i === index ? { ...s, label: v } : s))
                    )
                  }
                  placeholder="Müştərilər"
                />
              </div>
              <div className="w-32">
                <FormField
                  label="Dəyər"
                  name={`stat_value_${index}`}
                  value={stat.value}
                  onChange={(v) =>
                    setStatList((prev) =>
                      prev.map((s, i) => (i === index ? { ...s, value: v } : s))
                    )
                  }
                  placeholder="50+"
                />
              </div>
              <button
                type="button"
                onClick={() => setStatList((prev) => prev.filter((_, i) => i !== index))}
                className="pb-3 text-red-500 hover:text-red-700 text-sm font-medium tracking-tight"
              >
                Sil
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setStatList((prev) => [...prev, { label: '', value: '' }])}
            className="text-sm font-medium tracking-tight text-primary hover:text-primary-600"
          >
            + Yeni statistika
          </button>
          <div>
            <button
              type="button"
              onClick={handleSaveStats}
              disabled={loading}
              className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium tracking-tight hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saxlanılır...' : 'Statistikaları yadda saxla'}
            </button>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold tracking-tight text-text-primary">
            Komanda
          </h2>
          <button
            type="button"
            onClick={() => setShowNewForm(true)}
            className="text-sm font-medium tracking-tight text-primary hover:text-primary-600"
          >
            + Yeni üzv
          </button>
        </div>

        {showNewForm && (
          <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-4 mb-4 space-y-3">
            <FormField label="Ad" name="new_name" value={newName} onChange={setNewName} required />
            <FormField label="Vəzifə" name="new_role" value={newRole} onChange={setNewRole} required />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddTeamMember}
                disabled={loading}
                className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium tracking-tight hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                Əlavə et
              </button>
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium tracking-tight text-text-secondary hover:bg-slate-100 transition-colors"
              >
                Ləğv et
              </button>
            </div>
          </div>
        )}

        <div className="divide-y divide-slate-100">
          {teamMembers.length === 0 ? (
            <p className="py-4 text-sm text-text-secondary tracking-tight">Komanda üzvü yoxdur</p>
          ) : (
            teamMembers.map((member) => (
              <div key={member.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary tracking-tight">{member.name}</p>
                  <p className="text-xs text-text-secondary tracking-tight">{member.role}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteId(member.id)}
                  className="text-xs font-medium tracking-tight text-red-600 hover:text-red-700"
                >
                  Sil
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <DeleteConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteTeamMember}
        loading={deleteLoading}
        title="Komanda üzvünü silmək istəyirsiniz?"
        message="Bu əməliyyat geri qaytarıla bilməz."
      />
    </div>
  );
}
