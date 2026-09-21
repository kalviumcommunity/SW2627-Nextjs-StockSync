/**
 * File task: Main inventory dashboard for listing products and stock metrics.
 * Used by: app/dashboard/layout.tsx and authenticated dashboard routes.
 * Important code snippets:
 *   1. fetchProducts() data load from /api/products.
 *   2. Search and filter controls for category and stock status.
 *   3. ProductCard grid with live stock update handling.
 */

'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import MetricCard from '@/components/MetricCard';
import ProductCard from '@/components/ProductCard';
import { ProductItem } from '@/lib/dataService';
import {
  Box,
  TrendingDown,
  TrendingUp,
  RotateCw,
  Search,
} from 'lucide-react';

// Dashboard overview: loads inventory, metrics, and product filters.

export default function DashboardPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [metrics, setMetrics] = useState({
    totalProducts: 12,
    totalUnits: 335,
    totalManagers: 3,
    outOfStock: 1,
    todayUpdates: 47,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch latest products and metrics from the dashboard API.
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
        setMetrics(data.metrics);
      }
    } catch {
      // Keep state
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Refresh the dashboard inventory and summary metrics.
  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  // Update totals and out-of-stock count after a product stock change.
  const handleStockUpdated = (updatedProd: ProductItem) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === updatedProd.id ? updatedProd : p));
      const totalUnits = next.reduce((acc, p) => acc + p.stock, 0);
      const outOfStock = next.filter((p) => p.stock === 0).length;
      setMetrics((m) => ({
        ...m,
        totalUnits,
        outOfStock,
        todayUpdates: m.todayUpdates + 1,
      }));
      return next;
    });
  };

  // Categories list
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filtering
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'In Stock' && p.stock > 0) ||
      (selectedStatus === 'Out of Stock' && p.stock === 0);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div>
      {/* 1. Header */}
      <DashboardHeader
        title="Inventory Dashboard"
        subtitle="Monitor and update your current inventory."
      />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* 2. Top 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            label="Total Products"
            value={metrics.totalProducts}
            subtext={`${metrics.totalUnits} total units`}
            icon={Box}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />
          <MetricCard
            label="Total Managers"
            value={metrics.totalManagers}
            subtext={`${metrics.totalManagers} registered managers`}
            icon={Box}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <MetricCard
            label="Out of Stock"
            value={metrics.outOfStock}
            subtext="Products unavailable"
            icon={TrendingDown}
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
          />
          <MetricCard
            label="Today's Updates"
            value={metrics.todayUpdates}
            subtext="Last: just now"
            icon={TrendingUp}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />
        </div>

        {/* 3. Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white focus:border-brand-500 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                ▼
              </div>
            </div>

            {/* Stock Status Dropdown */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white focus:border-brand-500 cursor-pointer"
              >
                <option value="All">All Stock Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                ▼
              </div>
            </div>
          </div>

          {/* Refresh Action */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors disabled:opacity-60"
            >
              <RotateCw
                className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-brand-600' : ''}`}
              />
              <span>Refresh</span>
            </button>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Last updated: Just now
            </span>
          </div>
        </div>

        {/* 4. Products Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-500 text-sm">No products found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onStockUpdated={handleStockUpdated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
