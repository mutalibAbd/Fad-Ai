import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ServiceCategoryForm from '@/components/admin/ServiceCategoryForm';

export const metadata = {
  title: 'Yeni Kateqoriya | Admin | FADAI',
};

export default function NewServiceCategoryPage() {
  return (
    <div>
      <AdminPageHeader title="Yeni Kateqoriya" />
      <ServiceCategoryForm />
    </div>
  );
}
