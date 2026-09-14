import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import {
  Save,
  X,
  KeyRound,
  ChevronRight,
  Activity,
  Box,
  Monitor,
} from 'lucide-react';

export default function ProfilePage() {
  return (
    <div>
      {/* 1. Dashboard Top Header */}
      <DashboardHeader
        title="My Profile"
        subtitle="Manage your StockSync account."
        managerName="Manager B"
      />

      <div className="p-8 max-w-5xl mx-auto space-y-8">
        {/* 2. Main Profile Card (Static Presentation matching screenshot) */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          {/* Header with Avatar & Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-8 border-b border-slate-100">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-brand-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-brand-500/20 flex-shrink-0">
              MB
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Manager B</h2>
              <p className="text-sm text-slate-500">manager@example.com</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
                Inventory Manager
              </div>
            </div>
          </div>

          {/* Static Form Fields */}
          <div className="pt-8 space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                readOnly
                defaultValue="Manager B"
                className="w-full max-w-lg px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none cursor-default"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                readOnly
                defaultValue="manager@example.com"
                className="w-full max-w-lg px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none cursor-default"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition-all active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Quick Stats Row (Static) */}
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

        {/* 4. Security Card (Static Change Password tile) */}
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
