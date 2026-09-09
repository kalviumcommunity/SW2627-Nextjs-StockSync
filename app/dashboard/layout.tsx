'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

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
