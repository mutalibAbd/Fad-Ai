import { getContactInfo, getSocialLinks } from '@/lib/queries/site-settings';
import SettingsEditorClient from './SettingsEditorClient';

export const metadata = {
  title: 'Ayarlar | Admin | FAD-AI',
};

export default async function AdminSettingsPage() {
  const contactInfo = await getContactInfo();
  const socialLinks = await getSocialLinks();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
        Sayt Ayarları
      </h1>
      <SettingsEditorClient contactInfo={contactInfo} socialLinks={socialLinks} />
    </div>
  );
}
