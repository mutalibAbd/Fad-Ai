import { GlassHeader, SoftCard } from '@/components/ui';
import { getAboutContent, getAboutStats, getSocialLinks } from '@/lib/queries/site-settings';
import { getVisibleTeamMembers } from '@/lib/queries/team';

export const metadata = {
  title: 'Haqqımızda | FAD-AI',
  description: 'FAD-AI haqqında - tibbi görüntüləmə sahəsində innovativ həllər',
};

export const revalidate = 60;

export default async function AboutPage() {
  const [about, stats, teamMembers, socialLinks] = await Promise.all([
    getAboutContent(),
    getAboutStats(),
    getVisibleTeamMembers(),
    getSocialLinks(),
  ]);

  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-24 bg-background-light">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-4">
              <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-text-primary mb-6">
                Haqqımızda
              </h1>
              <p className="text-xl text-text-secondary tracking-tight max-w-2xl mx-auto">
                Tibbi görüntüləmə sahəsində innovativ həllər təqdim edən komanda
              </p>
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
              {about.story_title}
            </h2>
            <p className="text-lg text-text-secondary tracking-tight leading-relaxed mb-8">
              {about.story_text}
            </p>
            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
              <h3 className="text-xl font-semibold tracking-tight text-text-primary mb-4">
                Missiyamız
              </h3>
              <p className="text-text-secondary tracking-tight leading-relaxed">
                {about.mission_text}
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        {stats.length > 0 && (
          <section className="py-24 bg-background-light">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <SoftCard key={index} className="p-8 text-center" hover={false}>
                    <p className="text-4xl font-semibold tracking-tight text-primary mb-2">
                      {stat.value}
                    </p>
                    <p className="text-text-secondary tracking-tight">
                      {stat.label}
                    </p>
                  </SoftCard>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Team Members */}
        {teamMembers.length > 0 && (
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-semibold tracking-tight text-text-primary mb-12 text-center">
                Komandamız
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member) => (
                  <SoftCard key={member.id} className="p-8 text-center">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl text-primary/50">👤</span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight text-text-primary mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary tracking-tight mb-3">
                      {member.role}
                    </p>
                    {member.bio && (
                      <p className="text-text-secondary tracking-tight leading-relaxed text-sm">
                        {member.bio}
                      </p>
                    )}
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 text-sm text-primary hover:text-primary-600 tracking-tight transition-colors"
                      >
                        LinkedIn →
                      </a>
                    )}
                  </SoftCard>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Social Links */}
        {(socialLinks.facebook || socialLinks.instagram || socialLinks.linkedin || socialLinks.youtube) && (
          <section className="py-24 bg-background-light">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-text-primary mb-8">
                Bizi izləyin
              </h2>
              <div className="flex items-center justify-center gap-6">
                {socialLinks.linkedin && (
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors tracking-tight">
                    LinkedIn
                  </a>
                )}
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors tracking-tight">
                    Facebook
                  </a>
                )}
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors tracking-tight">
                    Instagram
                  </a>
                )}
                {socialLinks.youtube && (
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors tracking-tight">
                    YouTube
                  </a>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
