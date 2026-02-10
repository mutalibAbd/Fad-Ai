import ServiceForm from '@/components/admin/ServiceForm';

export const metadata = {
  title: 'Yeni Xidmət | Admin | FAD-AI',
};

export default function NewServicePage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
        Yeni Xidmət
      </h1>
      <ServiceForm />
    </div>
  );
}
