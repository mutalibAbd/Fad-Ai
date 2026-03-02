import Link from 'next/link';
import { getContactInfo, getSocialLinks, getFooterContent } from '@/lib/queries/site-settings';
import { getVisibleServiceCategories } from '@/lib/queries/service-categories';
import {
  EmailIcon,
  PhoneIcon,
  LocationIcon,
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
  YouTubeIcon,
} from '@/components/icons';

export default async function Footer() {
  const [contactInfo, socialLinks, footerContent, serviceCategories] = await Promise.all([
    getContactInfo(),
    getSocialLinks(),
    getFooterContent(),
    getVisibleServiceCategories(),
  ]);

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - Company */}
          <div className="space-y-6">
            <div>
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  F
                </div>
                <span className="text-xl font-semibold text-white tracking-tight">
                  FADAI
                </span>
              </Link>
              <p className="mt-3 text-sm leading-relaxed max-w-xs">
                {footerContent.tagline}
              </p>
            </div>
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

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-tight mb-4">
              Sürətli Keçidlər
            </h4>
            <ul className="space-y-2.5 text-sm">
              {footerContent.quick_links.map((link) => (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Services */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-tight mb-4">
              Xidmətlər
            </h4>
            <ul className="space-y-2.5 text-sm">
              {serviceCategories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/services/${cat.slug}`}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-tight mb-4">
              Əlaqə
            </h4>
            <ul className="space-y-2.5 text-sm">
              {contactInfo.email && (
                <li className="flex items-start gap-2.5">
                  <EmailIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-500" />
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors duration-200">
                    {contactInfo.email}
                  </a>
                </li>
              )}
              {contactInfo.phone && (
                <li className="flex items-start gap-2.5">
                  <PhoneIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-500" />
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-white transition-colors duration-200">
                    {contactInfo.phone}
                  </a>
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
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {footerContent.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
