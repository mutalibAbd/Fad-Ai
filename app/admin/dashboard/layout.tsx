import AdminSidebar from '@/components/admin/AdminSidebar';
import ForceLight from '@/components/admin/ForceLight';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <ForceLight />
      <AdminSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
