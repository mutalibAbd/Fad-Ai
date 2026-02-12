import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import ContactsListClient from './ContactsListClient';

export const metadata = {
  title: 'Müraciətlər | Admin | FADAI',
};

export const dynamic = 'force-dynamic';

export default async function AdminContactsPage() {
  const supabase = createAdminClient();
  const { data: contacts } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false }) as { data: Database['public']['Tables']['contact_submissions']['Row'][] | null };

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
        Müraciətlər
      </h1>
      <ContactsListClient contacts={contacts ?? []} />
    </div>
  );
}
