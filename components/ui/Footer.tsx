import Link from 'next/link';
import { getContactInfo, getSocialLinks } from '@/lib/queries/site-settings';
import {
  EmailIcon,
  PhoneIcon,
  LocationIcon,
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
  YouTubeIcon,
} from '@/components/icons';

const navLinks = [
  { label: 'Məhsullar', href: '/products' },
  { label: 'Xidmətlər', href: '/services' },
  { label: 'Standartlar', href: '/standards' },
  { label: 'Layihələr', href: '/projects' },
  { label: 'Haqqımızda', href: '/about' },
];

export default async function Footer() {
  const [contactInfo, socialLinks] = await Promise.all([
    getContactInfo(),
    getSocialLinks(),
  ]);

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-semibold text-white tracking-tight">
              FADAI
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              Tibbi görüntüləmədə dəqiqliyin orkestrləşdirilməsi
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-tight mb-4">
              Naviqasiya
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-tight mb-4">
              Əlaqə
            </h4>
            <ul className="space-y-2.5 text-sm">
              {contactInfo.email && (
                <li className="flex items-start gap-2.5">
                  <EmailIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-500" />
                  <span>{contactInfo.email}</span>
                </li>
              )}
              {contactInfo.phone && (
                <li className="flex items-start gap-2.5">
                  <PhoneIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-500" />
                  <span>{contactInfo.phone}</span>
                </li>
              )}
              {contactInfo.address && (
                <li className="flex items-start gap-2.5">
                  <LocationIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-500" />
                  <span>{contactInfo.address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-tight mb-4">
              Sosial
            </h4>
            <div className="flex items-center gap-3">
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors duration-200">
                  <LinkedInIcon />
                </a>
              )}
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors duration-200">
                  <FacebookIcon />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors duration-200">
                  <InstagramIcon />
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors duration-200">
                  <YouTubeIcon />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} FADAI. Bütün hüquqlar qorunur.
          </p>
        </div>
      </div>
    </footer>
  );
}
