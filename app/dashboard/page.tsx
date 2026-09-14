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

/**
 * ============================================================================
 * DashboardPage Component
 * ============================================================================
 * The primary operations hub for StockSync inventory managers.
 * 
 * Key Responsibilities:
 *  1. Fetches and displays live product inventory (12 items) and high-level KPIs.
 *  2. Provides real-time search, category filtering, and stock-status filtering.
 *  3. Coordinates state reconciliation when child ProductCards update quantities.
 *  4. Displays responsive metric overview cards at the top.
 */
export default function DashboardPage() {
  // ==========================================================================
  // SECTION 1: Component State Management
  // ==========================================================================
  
  // Array of inventory products loaded from the backend API
  const [products, setProducts] = useState<ProductItem[]>([]);
  
  // Aggregate KPI metrics displayed in top summary cards
  const [metrics, setMetrics] = useState({
    totalProducts: 12,
    totalUnits: 335,
    totalManagers: 3,
    outOfStock: 1,
    todayUpdates: 47,
  });
  
  // Search & Filter controls
  const [searchQuery, setSearchQuery] = useState('');           // Text query for product name search
  const [selectedCategory, setSelectedCategory] = useState('All'); // Active category filter
  const [selectedStatus, setSelectedStatus] = useState('All');     // Stock status filter (All, In Stock, Out of Stock)
  
  // Loading & network state indicators
  const [loading, setLoading] = useState(true);                  // Initial page load spinner state
  const [refreshing, setRefreshing] = useState(false);            // Manual refresh button spin animation state

  // ==========================================================================
  // SECTION 2: Data Fetching & API Integration
  // ==========================================================================
  
  /**
   * Fetches the latest product list and computed inventory metrics from /api/products
   */
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error('Failed to load products from API:', error);
      // Fallback: Maintain current state in case of intermittent network glitch
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Initial mount lifecycle: Trigger initial inventory load
   */
  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * Handler for the manual 'Refresh' button in the toolbar
   */
  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  // ==========================================================================
  // SECTION 3: Live State Reconciliation & Concurrency Handlers
  // ==========================================================================
  
  /**
   * Callback fired by child <ProductCard /> components after a successful stock update.
   * Optimistically updates the parent state and recalculates KPI metrics on the fly.
   * 
   * @param updatedProd - The modified ProductItem returned from the API
   */
  const handleStockUpdated = (updatedProd: ProductItem) => {
    setProducts((prev) => {
      // 1. Replace the updated product in local list
      const next = prev.map((p) => (p.id === updatedProd.id ? updatedProd : p));
      
      // 2. Recompute aggregate total units and out-of-stock items
      const totalUnits = next.reduce((acc, p) => acc + p.stock, 0);
      const outOfStock = next.filter((p) => p.stock === 0).length;
      
      // 3. Update top KPI metrics cards
      setMetrics((m) => ({
        ...m,
        totalUnits,
        outOfStock,
        todayUpdates: m.todayUpdates + 1,
      }));
      
      return next;
    });
  };

  // ==========================================================================
  // SECTION 4: Derived Filtered Data Computations
  // ==========================================================================
  
  // Dynamically extract unique categories from loaded products
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  // Apply multi-criteria filters (Search query + Category dropdown + Stock status dropdown)
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

  // ==========================================================================
  // SECTION 5: Component Render & JSX Structure
  // ==========================================================================
  return (
    <div>
      {/* -------------------------------------------------------------------- */}
      {/* 1. Header Section: Title & Context Subtitle                         */}
      {/* -------------------------------------------------------------------- */}
      <DashboardHeader
        title="Inventory Dashboard"
        subtitle="Monitor and update your current inventory."
      />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* ------------------------------------------------------------------ */}
        {/* 2. Overview Metrics Cards Grid (4 Top KPI Cards)                   */}
        {/* ------------------------------------------------------------------ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Metric 1: Total Product Count & Units in Stock */}
          <MetricCard
            label="Total Products"
            value={metrics.totalProducts}
            subtext={`${metrics.totalUnits} total units`}
            icon={Box}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />
          {/* Metric 2: Total Active Registered Managers */}
          <MetricCard
            label="Total Managers"
            value={metrics.totalManagers}
            subtext={`${metrics.totalManagers} registered managers`}
            icon={Box}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          {/* Metric 3: Out of Stock Warning Count */}
          <MetricCard
            label="Out of Stock"
            value={metrics.outOfStock}
            subtext="Products unavailable"
            icon={TrendingDown}
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
          />
          {/* Metric 4: Inventory Updates Completed Today */}
          <MetricCard
            label="Today's Updates"
            value={metrics.todayUpdates}
            subtext="Last: just now"
            icon={TrendingUp}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 3. Search & Filter Toolbar                                         */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input Filter */}
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

            {/* Category Dropdown Filter */}
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

            {/* Stock Status Dropdown Filter */}
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

          {/* Manual Refresh Button & Timestamp */}
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

        {/* ------------------------------------------------------------------ */}
        {/* 4. Product Cards Grid Section                                      */}
        {/* ------------------------------------------------------------------ */}
        {loading ? (
          /* Loading Skeleton State */
          <div className="text-center py-20 text-slate-400 text-sm">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty Search Results State */
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-500 text-sm">No products found matching your search.</p>
          </div>
        ) : (
          /* Active 4-Column Responsive Grid */
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
