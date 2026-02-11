import { getVisibleProjects } from '@/lib/queries/projects';
import { GlassHeader } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import ProjectsClient from './ProjectsClient';

export const metadata = {
  title: 'Layihələr | FADAI',
  description: 'Tibbi görüntüləmə sahəsində həyata keçirilən layihələrimiz',
};

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getVisibleProjects();

  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-background-light">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-text-primary mb-4">
              Layihələr
            </h1>
            <p className="text-xl text-text-secondary tracking-tight max-w-xl mx-auto">
              Tibbi görüntüləmə sahəsində innovativ həllər və tətbiqlər
            </p>
            {projects.length > 0 && (
              <span className="inline-block mt-4 text-sm font-medium text-text-secondary bg-white border border-slate-200 rounded-lg px-3 py-1">
                {projects.length} layihə
              </span>
            )}
          </div>
        </section>

        {/* Projects Grid with Tabs */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <ProjectsClient projects={projects} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
