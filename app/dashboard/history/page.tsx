'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import MetricCard from '@/components/MetricCard';
import { InventoryLogItem } from '@/lib/dataService';
import {
  Activity,
  Calendar,
  TrendingUp,
  TrendingDown,
  Search,
} from 'lucide-react';

/**
 * ============================================================================
 * HistoryPage Component
 * ============================================================================
 * An audit trail screen providing complete transparency into all inventory
 * movements across managers.
 * 
 * Features & Requirements:
 *  - FR-11: Full chronological history log table with Manager, Product, Delta, Previous/New Stock, and Timestamp.
 *  - Filter by search keyword, individual manager, or transaction type (Added / Removed).
 *  - Real-time stock movement metrics at the top.
 */
export default function HistoryPage() {
  // ==========================================================================
  // SECTION 1: Local State Management
  // ==========================================================================
  
  // List of inventory change records
  const [logs, setLogs] = useState<InventoryLogItem[]>([]);
  
  // Aggregate movement KPIs
  const [metrics, setMetrics] = useState({
    totalUpdates: 1284,
    todayUpdates: 47,
    addedStock: 102,
    removedStock: -39,
  });
  
  // Multi-criteria filter state
  const [searchQuery, setSearchQuery] = useState('');              // Search query for product or manager
  const [selectedManager, setSelectedManager] = useState('All');    // Filter by specific manager name
  const [selectedType, setSelectedType] = useState('All');          // Filter by movement type (Added / Removed)
  const [sortOrder, setSortOrder] = useState('newest');             // Chronological sort direction

  // ==========================================================================
  // SECTION 2: Data Fetching Lifecycle
  // ==========================================================================
  useEffect(() => {
    fetch('/api/history')
      .then((res) => res.json())
      .then((data) => {
        if (data.logs) {
          setLogs(data.logs);
          setMetrics(data.metrics);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch inventory audit logs:', err);
      });
  }, []);

  // ==========================================================================
  // SECTION 3: Helper Functions & Filtering Logic
  // ==========================================================================
  
  /**
   * Generates a 2-letter avatar initials string from a full name (e.g., 'Manager B' -> 'MB')
   */
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'MB';
  };

  /**
   * Applies search, manager, and transaction type filters
   */
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.managerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesManager =
      selectedManager === 'All' || log.managerName === selectedManager;

    const matchesType =
      selectedType === 'All' ||
      (selectedType === 'Added' && log.change > 0) ||
      (selectedType === 'Removed' && log.change < 0);

    return matchesSearch && matchesManager && matchesType;
  });

  // ==========================================================================
  // SECTION 4: Component Render & JSX Structure
  // ==========================================================================
  return (
    <div>
      {/* -------------------------------------------------------------------- */}
      {/* 1. Header Section: Title & Subtitle                                  */}
      {/* -------------------------------------------------------------------- */}
      <DashboardHeader
        title="Inventory History"
        subtitle="Track every successful stock change made by managers."
      />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* ------------------------------------------------------------------ */}
        {/* 2. Top Summary Metrics Cards (Movement KPIs)                       */}
        {/* ------------------------------------------------------------------ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total All-Time Updates */}
          <MetricCard
            label="Total Updates"
            value="1,284"
            icon={Activity}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />
          {/* Card 2: Today's Updates */}
          <MetricCard
            label="Today's Updates"
            value="47"
            icon={Calendar}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />
          {/* Card 3: Added Stock Units */}
          <MetricCard
            label="Added Stock"
            value="+102"
            icon={TrendingUp}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          {/* Card 4: Removed Stock Units */}
          <MetricCard
            label="Removed Stock"
            value="-39"
            icon={TrendingDown}
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
          />
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 3. Search & Multi-Filter Control Toolbar                           */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input Filter */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product or manager..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by Manager Dropdown */}
            <div className="relative">
              <select
                value={selectedManager}
                onChange={(e) => setSelectedManager(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white focus:border-brand-500 cursor-pointer"
              >
                <option value="All">All Managers</option>
                <option value="Manager A">Manager A</option>
                <option value="Manager B">Manager B</option>
                <option value="Manager C">Manager C</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                ▼
              </div>
            </div>

            {/* Filter by Type Dropdown (Added / Removed) */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white focus:border-brand-500 cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Added">Added (+)</option>
                <option value="Removed">Removed (-)</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                ▼
              </div>
            </div>

            {/* Sort Direction Dropdown */}
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white focus:border-brand-500 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 4. Complete Audit History Log Data Table                           */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              {/* Table Column Headers */}
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Manager</th>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Change</th>
                  <th className="py-4 px-6">Prev. Stock</th>
                  <th className="py-4 px-6">New Stock</th>
                  <th className="py-4 px-6">Time</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              {/* Table Rows Body */}
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      No inventory change records found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Manager Identification */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center border border-slate-200">
                            {getInitials(log.managerName)}
                          </div>
                          <span className="font-semibold text-slate-900">
                            {log.managerName}
                          </span>
                        </div>
                      </td>

                      {/* Product Name */}
                      <td className="py-4 px-6 text-slate-900 font-semibold">
                        {log.productName}
                      </td>

                      {/* Delta Change (+ / -) */}
                      <td className="py-4 px-6 font-bold">
                        <span
                          className={log.change > 0 ? 'text-emerald-600' : 'text-rose-600'}
                        >
                          {log.change > 0 ? `+ ${log.change}` : `- ${Math.abs(log.change)}`}
                        </span>
                      </td>

                      {/* Previous Stock Count */}
                      <td className="py-4 px-6 text-slate-500">{log.previousStock}</td>

                      {/* Authoritative New Stock Count */}
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {log.newStock}
                      </td>

                      {/* Timestamp */}
                      <td className="py-4 px-6 text-slate-500">{log.createdAt}</td>

                      {/* Transaction Status Badge */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Successful
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
