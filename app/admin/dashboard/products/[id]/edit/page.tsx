import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import ProductForm from '@/components/admin/ProductForm';

export const metadata = {
  title: 'Məhsulu Redaktə Et | Admin | FADAI',
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single() as { data: Database['public']['Tables']['products']['Row'] | null };

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
        Məhsulu Redaktə Et
      </h1>
      <ProductForm
        initialData={{
          id: product.id,
          slug: product.slug,
          icon: product.icon,
          title: product.title,
          description: product.description ?? '',
          long_description: product.long_description ?? '',
          specifications: (product.specifications as Record<string, string>) ?? {},
          image_url: product.image_url ?? '',
          sort_order: product.sort_order ?? 0,
          is_visible: product.is_visible ?? true,
        }}
      />
    </div>
  );
}
