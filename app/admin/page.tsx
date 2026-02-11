import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminLoginForm from './AdminLoginForm';

export const metadata = {
  title: 'Admin Giriş | FADAI',
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/admin/dashboard');
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-primary mb-2">
            FADAI
          </h1>
          <p className="text-text-secondary tracking-tight">
            Admin Panel
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <h2 className="text-xl font-semibold tracking-tight text-text-primary mb-6">
            Daxil ol
          </h2>
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
