import AdminPageHeader from '@/components/admin/AdminPageHeader';
import NewsForm from '@/components/admin/NewsForm';

export const metadata = {
  title: 'Yeni Xəbər | Admin | FADAI',
};

export default function NewNewsPage() {
  return (
    <div>
      <AdminPageHeader title="Yeni Xəbər" />
      <NewsForm />
    </div>
  );
}
