import { GlassHeader, SoftCard } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import { PersonIcon } from '@/components/icons';
import { getSocialLinks } from '@/lib/queries/site-settings';
import { getVisibleTeamMembers } from '@/lib/queries/team';
import { getVisiblePageBlocks } from '@/lib/queries/page-blocks';
import { BlockRenderer } from '@/components/sections/page-blocks';

export const metadata = {
  title: 'Haqqımızda | FADAI',
  description: 'FADAI haqqında - tibbi görüntüləmə sahəsində innovativ həllər',
};

export const revalidate = 3600;

export default async function AboutPage() {
  const [blocks, teamMembers, socialLinks] = await Promise.all([
    getVisiblePageBlocks('about'),
    getVisibleTeamMembers(),
    getSocialLinks(),
  ]);

  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/60 to-sky-50 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-[#082f6b] via-[#0086a8] to-[#00d4d1]" />
<div className="relative max-w-7xl mx-auto px-6">
  <div className="text-center mb-4">
    {/* Not: Arka plan koyulaştığı için yazıları beyaz yapmak isteyebilirsin */}
    <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-white mb-4">
      Haqqımızda
    </h1>
    <div className="w-10 h-0.5 bg-white mx-auto mb-6" />
    <p className="text-xl text-gray-100 tracking-tight max-w-2xl mx-auto">
      Tibbi görüntüləmə sahəsində innovativ həllər təqdim edən komanda
    </p>
  </div>
</div>
        </section>

        {/* Dynamic Blocks */}
        {blocks.map((block, index) => (
          <BlockRenderer key={block.id} block={block} index={index} />
        ))}

        {/* Team Members */}
        {teamMembers.length > 0 && (
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-semibold tracking-tight text-text-primary mb-12 text-center">
                Komandamız
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member) => (
                  <SoftCard key={member.id} className="p-8 text-center">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
                      {member.image_url ? (
                        <Image
                          src={member.image_url}
                          alt={member.name}
                          width={96}
                          height={96}
                          className="w-24 h-24 rounded-full object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <PersonIcon className="w-10 h-10 text-primary/40" />
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
          <section className="py-14 bg-background-light">
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

      <Footer />
    </>
  );
}
