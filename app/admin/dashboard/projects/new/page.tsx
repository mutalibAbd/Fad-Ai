import ProjectForm from '@/components/admin/ProjectForm';

export const metadata = {
  title: 'Yeni Layihə | Admin | FAD-AI',
};

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
        Yeni Layihə
      </h1>
      <ProjectForm />
    </div>
  );
}
