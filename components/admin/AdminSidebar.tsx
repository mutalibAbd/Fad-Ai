'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/lib/actions/auth';
import Image from 'next/image';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { label: 'Məhsullar', href: '/admin/dashboard/products', icon: '📦' },
  { label: 'Layihələr', href: '/admin/dashboard/projects', icon: '🏗️' },
  { label: 'Xidmətlər', href: '/admin/dashboard/services', icon: '⚙️' },
  { label: 'Dəstək', href: '/admin/dashboard/support', icon: '🤝' },
  { label: 'FAQ', href: '/admin/dashboard/faq', icon: '❓' },
  { label: 'Xəbərlər', href: '/admin/dashboard/news', icon: '📰' },
  { label: 'Ana Səhifə', href: '/admin/dashboard/homepage', icon: '🏠' },
  { label: 'Haqqımızda', href: '/admin/dashboard/about', icon: '👥' },
  { label: 'Müraciətlər', href: '/admin/dashboard/contacts', icon: '📩' },
  { label: 'Ayarlar', href: '/admin/dashboard/settings', icon: '⚙️' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-100 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-100">
        <Link href="/admin/dashboard" className="text-xl font-semibold tracking-tight text-primary">
          <Image src="/logo.svg" alt="FADAI Logo" width={140} height={40} />
        </Link>
        <p className="text-xs text-text-secondary tracking-tight mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium tracking-tight transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-slate-50 hover:text-text-primary'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-100">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium tracking-tight text-red-600 hover:bg-red-50 transition-colors"
        >
          <span className="text-base">🚪</span>
          Çıxış
        </button>
        <Link
          href="/"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium tracking-tight text-text-secondary hover:bg-slate-50 hover:text-text-primary transition-colors mt-1"
        >
          <span className="text-base">🌐</span>
          Saytı gör
        </Link>
      </div>
    </aside>
  );
}
