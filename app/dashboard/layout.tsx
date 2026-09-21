/**
 * File task: Protected dashboard frame with sidebar navigation and layout spacing.
 * Used by: app/dashboard/page.tsx, app/dashboard/history/page.tsx, app/dashboard/profile/page.tsx.
 * Important code snippets:
 *   1. Sidebar rendering and pathname-aware navigation state.
 *   2. Dashboard top content wrapper and main section.
 *   3. Responsive layout that keeps protected pages consistent.
 */

'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

// Task: Protected dashboard layout with shared sidebar and content area.
// Used by: Used by all protected dashboard pages.
// Important code snippets:
// 1. Sidebar navigation structure
// 2. Active path awareness for menu items
// 3. Main content container for dashboard pages

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [manager, setManager] = useState({
    name: 'Manager B',
    email: 'manager@example.com',
  });

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.manager) {
          setManager({
            name: data.manager.name,
            email: data.manager.email,
          });
        }
      })
      .catch(() => {
        // Use default
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Dark Sidebar */}
      <Sidebar managerName={manager.name} managerEmail={manager.email} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
