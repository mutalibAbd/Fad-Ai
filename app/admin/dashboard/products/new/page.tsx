import ProductForm from '@/components/admin/ProductForm';

export const metadata = {
  title: 'Yeni Məhsul | Admin | FAD-AI',
};

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
        Yeni Məhsul
      </h1>
      <ProductForm />
    </div>
  );
}
