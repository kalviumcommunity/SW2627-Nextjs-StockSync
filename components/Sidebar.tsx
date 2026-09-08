'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';
import { LayoutGrid, Clock, User, LogOut } from 'lucide-react';

interface SidebarProps {
  managerName?: string;
  managerEmail?: string;
}

export default function Sidebar({
  managerName = 'Manager B',
  managerEmail = 'manager@example.com',
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore
    }
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid, exact: true },
    { label: 'Inventory History', href: '/dashboard/history', icon: Clock },
    { label: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'MB';
  };

  return (
    <aside className="w-64 bg-[#0F172A] text-white flex flex-col justify-between h-screen sticky top-0 border-r border-slate-800 flex-shrink-0">
      {/* Top Section */}
      <div className="p-6">
        <Logo variant="dark" href="/dashboard" className="mb-8" />

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Section */}
      <div className="p-4 m-3 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center font-bold text-sm text-white shadow-sm">
            {getInitials(managerName)}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-semibold text-white truncate">{managerName}</div>
            <div className="text-xs text-slate-400 truncate">{managerEmail}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
