'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';
import type { ContactInfo, SocialLinks } from '@/lib/types';

interface Props {
  contactInfo: ContactInfo;
  socialLinks: SocialLinks;
}

export default function SettingsEditorClient({ contactInfo, socialLinks }: Props) {
  const router = useRouter();

  const [email, setEmail] = useState(contactInfo.email);
  const [phone, setPhone] = useState(contactInfo.phone);
  const [address, setAddress] = useState(contactInfo.address);

  const [facebook, setFacebook] = useState(socialLinks.facebook);
  const [instagram, setInstagram] = useState(socialLinks.instagram);
  const [linkedin, setLinkedin] = useState(socialLinks.linkedin);
  const [youtube, setYoutube] = useState(socialLinks.youtube);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSaveContact = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { updateSiteSetting } = await import('@/lib/actions/settings');
      const result = await updateSiteSetting('contact_info', {
        email,
        phone,
        address,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Əlaqə məlumatları yeniləndi');
        router.refresh();
      }
    } catch {
      setError('Xəta baş verdi');
    }

    setLoading(false);
  };

  const handleSaveSocial = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { updateSiteSetting } = await import('@/lib/actions/settings');
      const result = await updateSiteSetting('social_links', {
        facebook,
        instagram,
        linkedin,
        youtube,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Sosial media linkləri yeniləndi');
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

      {/* Contact Info */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold tracking-tight text-text-primary mb-5">
          Əlaqə Məlumatları
        </h2>
        <div className="space-y-4">
          <FormField label="E-poçt" name="email" type="email" value={email} onChange={setEmail} />
          <FormField label="Telefon" name="phone" value={phone} onChange={setPhone} placeholder="+994 XX XXX XX XX" />
          <FormField label="Ünvan" name="address" value={address} onChange={setAddress} />
          <button
            type="button"
            onClick={handleSaveContact}
            disabled={loading}
            className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium tracking-tight hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saxlanılır...' : 'Əlaqə məlumatlarını yadda saxla'}
          </button>
        </div>
      </section>

      {/* Social Links */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold tracking-tight text-text-primary mb-5">
          Sosial Media
        </h2>
        <div className="space-y-4">
          <FormField label="Facebook" name="facebook" type="url" value={facebook} onChange={setFacebook} placeholder="https://facebook.com/..." />
          <FormField label="Instagram" name="instagram" type="url" value={instagram} onChange={setInstagram} placeholder="https://instagram.com/..." />
          <FormField label="LinkedIn" name="linkedin" type="url" value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/company/..." />
          <FormField label="YouTube" name="youtube" type="url" value={youtube} onChange={setYoutube} placeholder="https://youtube.com/@..." />
          <button
            type="button"
            onClick={handleSaveSocial}
            disabled={loading}
            className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium tracking-tight hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saxlanılır...' : 'Sosial linkləri yadda saxla'}
          </button>
        </div>
      </section>
    </div>
  );
}
