import { getVisibleProjects } from '@/lib/queries/projects';
import { GlassHeader } from '@/components/ui';
import ProjectsClient from './ProjectsClient';

export const metadata = {
  title: 'Layihələr | FADAI',
  description: 'Tibbi görüntüləmə sahəsində həyata keçirilən layihələrimiz',
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProjectsPage() {
  // Backend: Fetch visible projects from Supabase
  const projects = await getVisibleProjects();

  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-24 bg-background-light">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-4">
              <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-text-primary mb-6">
                Layihələr
              </h1>
              <p className="text-xl text-text-secondary tracking-tight max-w-2xl mx-auto">
                Tibbi görüntüləmə sahəsində innovativ həllər və tətbiqlər
              </p>
            </div>
          </div>
        </section>

        {/* Projects Grid with Tabs */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <ProjectsClient projects={projects} />
          </div>
        </section>
      </main>
    </>
  );
}
