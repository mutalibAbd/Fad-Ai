import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth check is handled by middleware for /admin/dashboard/* routes
  // This layout just passes through children
  return <>{children}</>;
}
