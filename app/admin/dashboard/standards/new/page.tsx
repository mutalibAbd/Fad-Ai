import StandardForm from '@/components/admin/StandardForm';

export const metadata = {
  title: 'Yeni Standart | Admin | FADAI',
};

export default function NewStandardPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
        Yeni Standart
      </h1>
      <StandardForm />
    </div>
  );
}
