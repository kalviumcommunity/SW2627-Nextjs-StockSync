/**
 * File task: Shared footer section used by landing and public pages.
 * Used by: app/page.tsx and any page needing consistent footer branding.
 * Important code snippets:
 *   1. Brand, tagline, and quick links markup.
 *   2. Social or support section layout.
 *   3. Footer alignment with app-wide spacing rules.
 */

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

// Task: Shared footer block for public-facing screens.
// Used by: Used by the landing page layout.
// Important code snippets:
// 1. Branding and quick links
// 2. Footer layout structure
// 3. Closing section formatting

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 px-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Brand info */}
        <div className="md:col-span-6 space-y-4">
          <Logo variant="dark" href="/" />
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            Inventory management built for speed, clarity, and accountability.
          </p>
        </div>

        {/* Product links */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-sm font-semibold text-white tracking-wider">Product</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer transition-colors">
                Security
              </span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer transition-colors">
                Help
              </span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer transition-colors">
                Flow Diagram
              </span>
            </li>
          </ul>
        </div>

        {/* Legal links */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-sm font-semibold text-white tracking-wider">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="hover:text-white cursor-pointer transition-colors">
                Privacy
              </span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer transition-colors">
                Terms
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800/80 text-xs text-slate-500">
        © 2026 StockSync. All rights reserved.
      </div>
    </footer>
  );
}
