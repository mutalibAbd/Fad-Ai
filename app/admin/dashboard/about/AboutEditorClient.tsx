'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';
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
  const [editingId, setEditingId] = useState<string | null>(null);

  // New team member inline form
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newLinkedinUrl, setNewLinkedinUrl] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);

  // Edit team member form
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editLinkedinUrl, setEditLinkedinUrl] = useState('');

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
      const result = await createTeamMember({
        name: newName,
        role: newRole,
        bio: newBio || undefined,
        image_url: newImageUrl || undefined,
        linkedin_url: newLinkedinUrl || undefined,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setNewName('');
        setNewRole('');
        setNewBio('');
        setNewImageUrl('');
        setNewLinkedinUrl('');
        setShowNewForm(false);
        setSuccess('Komanda üzvü əlavə edildi');
        router.refresh();
      }
    } catch {
      setError('Xəta baş verdi');
    }

    setLoading(false);
  };

  const startEditing = (member: TeamMember) => {
    setEditingId(member.id);
    setEditName(member.name);
    setEditRole(member.role);
    setEditBio(member.bio || '');
    setEditImageUrl(member.image_url || '');
    setEditLinkedinUrl(member.linkedin_url || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleUpdateTeamMember = async () => {
    if (!editingId || !editName.trim() || !editRole.trim()) return;
    setLoading(true);
    setError('');

    try {
      const { updateTeamMember } = await import('@/lib/actions/team');
      const result = await updateTeamMember(editingId, {
        name: editName,
        role: editRole,
        bio: editBio || null,
        image_url: editImageUrl || null,
        linkedin_url: editLinkedinUrl || null,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setEditingId(null);
        setSuccess('Komanda üzvü yeniləndi');
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
            <ImageUpload bucket="team" value={newImageUrl} onChange={setNewImageUrl} label="Şəkil" />
            <FormField label="Haqqında" name="new_bio" type="textarea" value={newBio} onChange={setNewBio} rows={3} placeholder="Qısa bioqrafiya..." />
            <FormField label="LinkedIn URL" name="new_linkedin" type="url" value={newLinkedinUrl} onChange={setNewLinkedinUrl} placeholder="https://linkedin.com/in/..." />
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
                onClick={() => {
                  setShowNewForm(false);
                  setNewName('');
                  setNewRole('');
                  setNewBio('');
                  setNewImageUrl('');
                  setNewLinkedinUrl('');
                }}
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
              <div key={member.id} className="py-3">
                {editingId === member.id ? (
                  <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-4 space-y-3">
                    <FormField label="Ad" name={`edit_name_${member.id}`} value={editName} onChange={setEditName} required />
                    <FormField label="Vəzifə" name={`edit_role_${member.id}`} value={editRole} onChange={setEditRole} required />
                    <ImageUpload bucket="team" value={editImageUrl} onChange={setEditImageUrl} label="Şəkil" />
                    <FormField label="Haqqında" name={`edit_bio_${member.id}`} type="textarea" value={editBio} onChange={setEditBio} rows={3} placeholder="Qısa bioqrafiya..." />
                    <FormField label="LinkedIn URL" name={`edit_linkedin_${member.id}`} type="url" value={editLinkedinUrl} onChange={setEditLinkedinUrl} placeholder="https://linkedin.com/in/..." />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleUpdateTeamMember}
                        disabled={loading}
                        className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium tracking-tight hover:bg-primary-600 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Saxlanılır...' : 'Yadda saxla'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="px-4 py-2 rounded-xl text-sm font-medium tracking-tight text-text-secondary hover:bg-slate-100 transition-colors"
                      >
                        Ləğv et
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm text-primary/50">?</span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-text-primary tracking-tight">{member.name}</p>
                        <p className="text-xs text-text-secondary tracking-tight">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => startEditing(member)}
                        className="text-xs font-medium tracking-tight text-primary hover:text-primary-600"
                      >
                        Redaktə
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(member.id)}
                        className="text-xs font-medium tracking-tight text-red-600 hover:text-red-700"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                )}
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
