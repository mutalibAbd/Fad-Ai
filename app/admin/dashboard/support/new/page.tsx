import AdminPageHeader from '@/components/admin/AdminPageHeader';
import SupportForm from '@/components/admin/SupportForm';

export const metadata = {
  title: 'Yeni Dəstək Növü | Admin | FADAI',
};

export default function NewSupportPage() {
  return (
    <div>
      <AdminPageHeader title="Yeni Dəstək Növü" />
      <SupportForm />
    </div>
  );
}
