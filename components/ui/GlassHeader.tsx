'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Dialog } from '@headlessui/react';
import { CloseIcon } from '@/components/icons';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface NavLink {
  label: string;
  href: string;
}

interface GlassHeaderProps {
  logo?: string;
  navLinks?: NavLink[];
}

const defaultNavLinks: NavLink[] = [
  { label: 'Məhsullar', href: '/products' },
  { label: 'Xidmətlər', href: '/services' },
  { label: 'Dəstək', href: '/support' },
  { label: 'Haqqımızda', href: '/about' },
  { label: 'Xəbərlər', href: '/news' },
];

export default function GlassHeader({ logo = 'FADAI', navLinks = defaultNavLinks }: GlassHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-semibold tracking-tight text-primary">
          {logo}
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-primary hover:text-primary font-medium tracking-tight transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/contact"
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium tracking-tight hover:bg-primary-600 transition-colors duration-200"
          >
            Əlaqə
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="flex flex-col items-center justify-center w-10 h-10 gap-1.5"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Menyunu aç"
          >
            <span className="block w-6 h-0.5 bg-text-primary transition-all" />
            <span className="block w-6 h-0.5 bg-text-primary transition-all" />
            <span className="block w-6 h-0.5 bg-text-primary transition-all" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog
        as="div"
        className="md:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-slate-950 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-slate-100 dark:sm:ring-slate-800">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-semibold tracking-tight text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {logo}
            </Link>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Menyunu bağla"
            >
              <span className="text-2xl text-text-primary">
                <CloseIcon className="w-5 h-5" />
              </span>
            </button>
          </div>
          <div className="mt-8 flow-root">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-xl px-4 py-3 text-lg font-medium tracking-tight text-text-primary hover:bg-primary/5 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/contact"
                className="block w-full text-center bg-primary text-white px-6 py-3 rounded-xl font-medium tracking-tight hover:bg-primary-600 transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Əlaqə
              </Link>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
