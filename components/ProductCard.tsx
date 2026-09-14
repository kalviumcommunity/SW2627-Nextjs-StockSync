'use client';

import React, { useState, useEffect } from 'react';
import { ProductItem } from '@/lib/dataService';
import { Plus, Minus, XCircle, Loader2 } from 'lucide-react';

/**
 * ============================================================================
 * ProductCard Component
 * ============================================================================
 * An interactive product tile that enables real-time, concurrency-safe inventory
 * adjustments (+ Add Stock / - Remove Stock).
 * 
 * Features & Requirements:
 *  - FR-05: Product Catalog display with high-res thumbnails and categories.
 *  - FR-06 & FR-07: Real-time validation preventing negative stock counts.
 *  - FR-08: Optimistic UI updates with instant visual feedback.
 *  - FR-12: Automated rollback and error alerting if the server/DB transaction fails.
 */
interface ProductCardProps {
  product: ProductItem;
  onStockUpdated?: (updatedProduct: ProductItem) => void;
}

export default function ProductCard({ product, onStockUpdated }: ProductCardProps) {
  // ==========================================================================
  // SECTION 1: Local State Management
  // ==========================================================================
  const [qty, setQty] = useState<number>(0);                          // Custom delta amount entered by manager
  const [localStock, setLocalStock] = useState<number>(product.stock); // Optimistic stock state
  const [errorMessage, setErrorMessage] = useState<string>('');        // Client & server error warning banner
  const [isUpdating, setIsUpdating] = useState<boolean>(false);        // Loading indicator during async POST

  // Synchronize local optimistic stock whenever parent passes an updated product
  useEffect(() => {
    setLocalStock(product.stock);
  }, [product.stock]);

  // ==========================================================================
  // SECTION 2: Real-time Input Validation
  // ==========================================================================
  
  /**
   * Handles user input changes in the 'Qty' number field.
   * Performs instant client-side boundary checks.
   */
  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    const newQty = isNaN(val) ? 0 : Math.max(0, val);
    setQty(newQty);

    // Immediate warning if quantity exceeds available stock for removal
    if (newQty > localStock && newQty > 0) {
      setErrorMessage('Cannot remove more stock than currently available.');
    } else {
      setErrorMessage('');
    }
  };

  // ==========================================================================
  // SECTION 3: Concurrency-Safe Stock Transaction Handler
  // ==========================================================================
  
  /**
   * Submits stock modifications to the backend controller.
   * 1. Applies optimistic UI state update.
   * 2. Issues POST /api/products/[id]/stock.
   * 3. Confirms new state or triggers automatic rollback on failure.
   */
  const handleUpdate = async (changeType: 'add' | 'remove') => {
    if (qty <= 0) return;

    // Validate that removal does not exceed current stock
    if (changeType === 'remove' && qty > localStock) {
      setErrorMessage('Cannot remove more stock than currently available.');
      return;
    }

    const changeAmount = changeType === 'add' ? qty : -qty;
    const previousStock = localStock;
    const optimisticNewStock = localStock + changeAmount;

    // 1. FR-08: Optimistic UI update (immediate sub-50ms visual response)
    setLocalStock(optimisticNewStock);
    setErrorMessage('');
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/products/${product.id}/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ change: changeAmount }),
      });

      const data = await res.json();

      if (!res.ok) {
        // FR-12: Server rollback on conflict or invalid state
        setLocalStock(previousStock);
        setErrorMessage(data.error || 'Update failed.');
        setIsUpdating(false);
        return;
      }

      // 2. Confirm authoritative stock returned from DB transaction
      setLocalStock(data.newStock);
      setQty(0);
      setIsUpdating(false);
      
      // Notify parent component to refresh aggregate metrics
      if (onStockUpdated) {
        onStockUpdated(data.product);
      }
    } catch {
      // 3. Network Failure Rollback
      setLocalStock(previousStock);
      setErrorMessage('Network error. Rolled back to previous confirmed stock.');
      setIsUpdating(false);
    }
  };

  // ==========================================================================
  // SECTION 4: Derived Status & Button Disabled Logic
  // ==========================================================================
  const isOutOfStock = localStock <= 0;
  const canAdd = qty > 0 && !isUpdating;
  const canRemove = qty > 0 && qty <= localStock && !isUpdating;

  // ==========================================================================
  // SECTION 5: Card Layout & JSX Rendering
  // ==========================================================================
  return (
    <div
      className={`bg-white rounded-2xl p-5 border transition-all shadow-sm ${
        isOutOfStock
          ? 'border-rose-200 bg-rose-50/10'
          : 'border-slate-100 hover:border-slate-200'
      }`}
    >
      {/* -------------------------------------------------------------------- */}
      {/* Product Header: Thumbnail, Name, Category & Stock Status Badge      */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex items-start gap-3.5 mb-4">
        {/* Product Thumbnail */}
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-900 truncate">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500">{product.category}</p>

          {/* Stock Status Badge (In Stock / Out of Stock) */}
          <div className="mt-1.5">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200/60">
                <XCircle className="w-3 h-3" />
                Out of Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                In Stock
              </span>
            )}
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Current Inventory Count Display                                      */}
      {/* -------------------------------------------------------------------- */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`text-3xl font-extrabold tracking-tight ${
              isOutOfStock ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {localStock}
          </span>
          <span className="text-xs font-semibold text-slate-500">units</span>
          {isUpdating && (
            <Loader2 className="w-3.5 h-3.5 text-brand-600 animate-spin ml-2" />
          )}
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Quantity Input Field & Real-time Error Message                       */}
      {/* -------------------------------------------------------------------- */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-600 w-7">Qty</span>
          <input
            type="number"
            min="0"
            value={qty === 0 ? '' : qty}
            onChange={handleQtyChange}
            placeholder="0"
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-center text-slate-800 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </div>

        {/* Real-time removal error message */}
        {errorMessage && (
          <p className="text-[11px] text-rose-600 font-medium leading-tight pt-0.5">
            {errorMessage}
          </p>
        )}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Stock Adjustment Action Buttons (+ Add Stock / - Remove Stock)       */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Button: + Add Stock */}
        <button
          type="button"
          onClick={() => handleUpdate('add')}
          disabled={!canAdd}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            canAdd
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20 active:scale-[0.98]'
              : 'bg-emerald-100 text-emerald-800 opacity-60 cursor-not-allowed'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Stock</span>
        </button>

        {/* Button: - Remove Stock */}
        <button
          type="button"
          onClick={() => handleUpdate('remove')}
          disabled={!canRemove}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            canRemove
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-500/20 active:scale-[0.98]'
              : 'bg-rose-100 text-rose-800 opacity-60 cursor-not-allowed'
          }`}
        >
          <Minus className="w-3.5 h-3.5" />
          <span>Remove Stock</span>
        </button>
      </div>
    </div>
  );
}
