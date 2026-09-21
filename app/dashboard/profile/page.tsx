/**
 * File task: Manager profile editing screen for name and email information.
 * Used by: app/dashboard/layout.tsx and authenticated dashboard navigation.
 * Important code snippets:
 *   1. Current manager data retrieval from /api/auth/me.
 *   2. Form state for updating profile information.
 *   3. Save action to /api/profile and success feedback UI.
 */

'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import {
  Save,
  X,
  KeyRound,
  ChevronRight,
  Activity,
  Box,
  Monitor,
  CheckCircle2,
} from 'lucide-react';

// Task: Manager profile management screen.
// Used by: Used by the dashboard profile route.
// Important code snippets:
// 1. Manager data retrieval from the auth route
// 2. Editable profile form state
// 3. Save action and success message handling

export default function ProfilePage() {
  const [name, setName] = useState('Manager B');
  const [email, setEmail] = useState('manager@example.com');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.manager) {
          setName(data.manager.name);
          setEmail(data.manager.email);
        }
      })
      .catch(() => {});
  }, []);

  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'MB';
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch {
      // Handle
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* 1. Header */}
      <DashboardHeader
        title="My Profile"
        subtitle="Manage your StockSync account."
        managerName={name}
      />

      <div className="p-8 max-w-5xl mx-auto space-y-8">
        {/* 2. Main Profile Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          {/* Header with Avatar & Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-8 border-b border-slate-100">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-brand-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-brand-500/20 flex-shrink-0">
              {getInitials(name)}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">{name}</h2>
              <p className="text-sm text-slate-500">{email}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
                Inventory Manager
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="pt-8 space-y-5">
            {savedSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Profile changes saved successfully.
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full max-w-lg px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full max-w-lg px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition-all active:scale-[0.98] disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>

        {/* 3. Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">284</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Total Updates</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Box className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">76</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Products Updated</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Monitor className="w-5 h-5" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">Today, 10:31 AM</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Last Activity</div>
          </div>
        </div>

        {/* 4. Security Card (Static Change Password) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Security
          </h3>

          <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-200/80 text-slate-700 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Change Password</div>
                <div className="text-xs text-slate-500">Update your account password</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
