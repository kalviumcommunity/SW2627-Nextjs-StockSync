/**
 * File task: Reusable summary card for dashboard metrics and KPIs.
 * Used by: app/dashboard/page.tsx and app/dashboard/history/page.tsx.
 * Important code snippets:
 *   1. Generic metric title and value display.
 *   2. Conditional icon and accent styling.
 *   3. Shared layout for dashboard status overview cards.
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
}

// Task: Reusable metric summary card.
// Used by: Used by dashboard overview and history pages.
// Important code snippets:
// 1. Card title and value props
// 2. Icon and accent styling
// 3. Dashboard KPI presentation layout

export default function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  iconBg = 'bg-brand-50',
  iconColor = 'text-brand-600',
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start justify-between">
      <div>
        <span className="text-xs font-semibold text-slate-500 tracking-wide">{label}</span>
        <div className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
          {value}
        </div>
        {subtext && (
          <div className="text-xs text-slate-500 mt-1 font-medium">{subtext}</div>
        )}
      </div>
      <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
