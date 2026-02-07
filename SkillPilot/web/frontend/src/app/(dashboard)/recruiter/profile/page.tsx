'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { userAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function RecruiterProfilePage() {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    linkedin: user?.linkedin || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await userAPI.updateProfile(form);
      setUser(res.user);
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-neutral-500">Manage your recruiter profile</p>
      </div>

      <div className="card space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="input min-h-[100px] resize-none"
            placeholder="Tell candidates about your company..."
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">LinkedIn URL</label>
          <input
            type="url"
            value={form.linkedin}
            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
            className="input"
            placeholder="https://linkedin.com/in/username"
          />
        </div>
        <div className="flex justify-end pt-2">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
