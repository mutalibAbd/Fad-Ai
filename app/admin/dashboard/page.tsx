import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';

export const metadata = {
  title: 'Dashboard | Admin | FAD-AI',
};

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  const [
    { count: productsCount },
    { count: projectsCount },
    { count: servicesCount },
    { count: standardsCount },
    { count: contactsCount },
    { count: unreadCount },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('standards').select('*', { count: 'exact', head: true }),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('is_read', false),
  ]) as { count: number | null }[];

  const stats = [
    { label: 'Məhsullar', value: productsCount ?? 0, icon: '📦', href: '/admin/dashboard/products' },
    { label: 'Layihələr', value: projectsCount ?? 0, icon: '🏗️', href: '/admin/dashboard/projects' },
    { label: 'Xidmətlər', value: servicesCount ?? 0, icon: '⚙️', href: '/admin/dashboard/services' },
    { label: 'Standartlar', value: standardsCount ?? 0, icon: '📋', href: '/admin/dashboard/standards' },
    { label: 'Müraciətlər', value: contactsCount ?? 0, icon: '📩', href: '/admin/dashboard/contacts' },
    { label: 'Oxunmamış', value: unreadCount ?? 0, icon: '📬', href: '/admin/dashboard/contacts' },
  ];

  // Recent contact submissions
  const { data: recentContacts } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5) as { data: Database['public']['Tables']['contact_submissions']['Row'][] | null };

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-2xl font-semibold tracking-tight text-text-primary mt-2">
              {stat.value}
            </p>
            <p className="text-sm text-text-secondary tracking-tight">
              {stat.label}
            </p>
          </a>
        ))}
      </div>

      {/* Recent Contacts */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold tracking-tight text-text-primary">
            Son Müraciətlər
          </h2>
        </div>
        <div className="divide-y divide-slate-100">
          {recentContacts && recentContacts.length > 0 ? (
            recentContacts.map((contact) => (
              <div key={contact.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary tracking-tight">
                    {contact.full_name}
                    {!contact.is_read && (
                      <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full" />
                    )}
                  </p>
                  <p className="text-xs text-text-secondary tracking-tight">
                    {contact.email} {contact.subject ? `— ${contact.subject}` : ''}
                  </p>
                </div>
                <p className="text-xs text-text-secondary tracking-tight">
                  {new Date(contact.created_at).toLocaleDateString('az-AZ')}
                </p>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-text-secondary tracking-tight">Müraciət yoxdur</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
