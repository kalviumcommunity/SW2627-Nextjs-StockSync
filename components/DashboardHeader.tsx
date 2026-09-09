'use client';

import React from 'react';
import { Search, Bell } from 'lucide-react';
import Link from 'next/link';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  managerName?: string;
}

export default function DashboardHeader({
  title,
  subtitle,
  managerName = 'Manager B',
}: DashboardHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'MB';
  };

  return (
    <header className="bg-white border-b border-slate-200/80 px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-30">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Search input */}
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
          />
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-brand-600 absolute top-2 right-2 ring-2 ring-white"></span>
        </button>

        {/* Manager Badge Dropdown */}
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
            {getInitials(managerName)}
          </div>
          <span className="text-xs font-semibold text-slate-700">{managerName}</span>
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
