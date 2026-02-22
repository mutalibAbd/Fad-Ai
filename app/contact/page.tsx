import { GlassHeader } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import { EmailIcon, PhoneIcon, LocationIcon, LinkedInIcon, FacebookIcon, InstagramIcon, YouTubeIcon } from '@/components/icons';
import { getContactInfo, getSocialLinks } from '@/lib/queries/site-settings';
import ContactForm from './ContactForm';

export const metadata = {
  title: 'Əlaqə | FADAI',
  description: 'FADAI ilə əlaqə saxlayın',
};

export const revalidate = 3600;

export default async function ContactPage() {
  const [contactInfo, socialLinks] = await Promise.all([
    getContactInfo(),
    getSocialLinks(),
  ]);

  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-[#082f6b] via-[#0086a8] to-[#00d4d1]">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-4">
      <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-white mb-6">
        Bizimlə Əlaqə
      </h1>
      <p className="text-xl text-gray-100 tracking-tight max-w-2xl mx-auto">
        Suallarınız üçün bizimlə əlaqə saxlayın
      </p>
    </div>
  </div>
</section>

        {/* Contact Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-8">
                  Mesaj göndərin
                </h2>
                <ContactForm />
              </div>

              {/* Contact Info & Social */}
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-8">
                  Əlaqə məlumatları
                </h2>

                <div className="space-y-6 mb-12">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <EmailIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary tracking-tight mb-1">E-poçt</p>
                      <p className="text-text-primary tracking-tight font-medium">{contactInfo.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <PhoneIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary tracking-tight mb-1">Telefon</p>
                      <p className="text-text-primary tracking-tight font-medium">{contactInfo.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <LocationIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary tracking-tight mb-1">Ünvan</p>
                      <p className="text-text-primary tracking-tight font-medium">{contactInfo.address}</p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                {(socialLinks.linkedin || socialLinks.facebook || socialLinks.instagram || socialLinks.youtube) && (
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-text-primary mb-4">
                      Sosial şəbəkələr
                    </h3>
                    <div className="flex items-center gap-4">
                      {socialLinks.linkedin && (
                        <a
                          href={socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn"
                          className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                        >
                          <LinkedInIcon className="w-5 h-5" />
                        </a>
                      )}
                      {socialLinks.facebook && (
                        <a
                          href={socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Facebook"
                          className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                        >
                          <FacebookIcon className="w-5 h-5" />
                        </a>
                      )}
                      {socialLinks.instagram && (
                        <a
                          href={socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Instagram"
                          className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                        >
                          <InstagramIcon className="w-5 h-5" />
                        </a>
                      )}
                      {socialLinks.youtube && (
                        <a
                          href={socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="YouTube"
                          className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                        >
                          <YouTubeIcon className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
