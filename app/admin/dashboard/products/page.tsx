import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ProductListClient from './ProductListClient';

export const metadata = {
  title: 'Məhsullar | Admin | FAD-AI',
};

export default async function AdminProductsPage() {
  const supabase = createAdminClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true }) as { data: Database['public']['Tables']['products']['Row'][] | null };

  return (
    <div>
      <AdminPageHeader
        title="Məhsullar"
        createHref="/admin/dashboard/products/new"
        createLabel="Yeni məhsul"
      />
      <ProductListClient products={products ?? []} />
    </div>
  );
}
