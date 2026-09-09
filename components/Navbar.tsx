'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Logo href="/" />

        {/* Center: Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-brand-600 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-brand-600 transition-colors">
            How It Works
          </a>
        </nav>

        {/* Right: Auth buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-700 hover:text-brand-600 px-4 py-2 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl shadow-sm shadow-brand-500/20 transition-all hover:shadow-brand-500/30 active:scale-[0.98]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
