'use client';

import { Tab } from '@headlessui/react';
import { SoftCard } from '@/components/ui';
import type { Project } from '@/lib/queries/projects';

interface ProjectsClientProps {
  projects: Project[];
}

const STATUS_TABS = [
  { key: 'all', label: 'Hamısı' },
  { key: 'pending', label: 'Gözləmədə olanlar' },
  { key: 'in_progress', label: 'İcrada olanlar' },
  { key: 'completed', label: 'Tamamlanmış' },
] as const;

const STATUS_BADGES = {
  pending: { label: 'Gözləmədə', color: 'bg-yellow-100 text-yellow-800' },
  in_progress: { label: 'İcrada', color: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Tamamlanmış', color: 'bg-green-100 text-green-800' },
};

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const filterProjects = (status: string) => {
    if (status === 'all') return projects;
    return projects.filter((project) => project.status === status);
  };

  return (
    <Tab.Group>
      <div className="mb-12">
        <Tab.List className="flex space-x-2 rounded-2xl bg-white p-2 shadow-sm border border-slate-100">
          {STATUS_TABS.map((tab) => (
            <Tab
              key={tab.key}
              className={({ selected }) =>
                `w-full rounded-xl py-3 px-4 text-sm font-medium tracking-tight transition-all duration-300
                ${
                  selected
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:bg-slate-50 hover:text-text-primary'
                }`
              }
            >
              {tab.label}
            </Tab>
          ))}
        </Tab.List>
      </div>

      <Tab.Panels>
        {STATUS_TABS.map((tab) => {
          const filteredProjects = filterProjects(tab.key);

          return (
            <Tab.Panel key={tab.key}>
              {filteredProjects.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-text-secondary text-lg tracking-tight">
                    Bu statusda layihə yoxdur
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map((project) => (
                    <SoftCard key={project.id} className="overflow-hidden">
                      {/* Project Image */}
                      {project.image_url ? (
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 relative">
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <span className="text-6xl opacity-50">🏥</span>
                        </div>
                      )}

                      {/* Project Content */}
                      <div className="p-6">
                        {/* Status Badge */}
                        <span
                          className={`inline-block px-3 py-1 rounded-lg text-xs font-medium tracking-tight mb-3 ${
                            STATUS_BADGES[project.status].color
                          }`}
                        >
                          {STATUS_BADGES[project.status].label}
                        </span>

                        {/* Title */}
                        <h3 className="text-xl font-semibold tracking-tight text-text-primary mb-2">
                          {project.title}
                        </h3>

                        {/* Summary */}
                        {project.summary && (
                          <p className="text-text-secondary tracking-tight leading-relaxed line-clamp-3">
                            {project.summary}
                          </p>
                        )}

                        {/* Created Date */}
                        <p className="text-sm text-text-secondary mt-4 tracking-tight">
                          {new Date(project.created_at).toLocaleDateString('az-AZ', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </SoftCard>
                  ))}
                </div>
              )}
            </Tab.Panel>
          );
        })}
      </Tab.Panels>
    </Tab.Group>
  );
}
