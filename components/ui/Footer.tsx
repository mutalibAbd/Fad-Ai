import Link from 'next/link';
import { getContactInfo, getSocialLinks, getFooterContent } from '@/lib/queries/site-settings';
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
  const [contactInfo, socialLinks, footerContent] = await Promise.all([
    getContactInfo(),
    getSocialLinks(),
    getFooterContent(),
  ]);

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
          {/* Brand + Social */}
          <div className="space-y-6">
            <div>
              <Link href="/" className="text-xl font-semibold text-white tracking-tight">
                FADAI
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

          {/* Contact */}
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
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {footerContent.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
