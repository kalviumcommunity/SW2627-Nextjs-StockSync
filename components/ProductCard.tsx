'use client';

import React, { useState } from 'react';
import { ProductItem } from '@/lib/dataService';
import { Plus, Minus, XCircle, Loader2, CheckCircle2 } from 'lucide-react';

interface ProductCardProps {
  product: ProductItem;
  onStockUpdated?: (updatedProduct: ProductItem) => void;
}

export default function ProductCard({ product, onStockUpdated }: ProductCardProps) {
  const [qty, setQty] = useState<number>(0);
  const [localStock, setLocalStock] = useState<number>(product.stock);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateNotice, setUpdateNotice] = useState<{
    change: number;
    previousStock: number;
  } | null>(null);
  const [isUndoing, setIsUndoing] = useState<boolean>(false);

  // Sync if parent updates product
  React.useEffect(() => {
    setLocalStock(product.stock);
  }, [product.stock]);

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    const newQty = isNaN(val) ? 0 : Math.max(0, val);
    setQty(newQty);

    if (newQty > localStock && newQty > 0) {
      setErrorMessage('Cannot remove more stock than currently available.');
    } else {
      setErrorMessage('');
    }
  };

  const handleUpdate = async (changeType: 'add' | 'remove') => {
    if (qty <= 0) return;

    if (changeType === 'remove' && qty > localStock) {
      setErrorMessage('Cannot remove more stock than currently available.');
      return;
    }

    const changeAmount = changeType === 'add' ? qty : -qty;
    const previousStock = localStock;
    const optimisticNewStock = localStock + changeAmount;

    // 1. Optimistic UI update (FR-08)
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
        // Rollback to confirmed state on error (FR-12)
        setLocalStock(previousStock);
        setErrorMessage(data.error || 'Update failed.');
        setIsUpdating(false);
        return;
      }

      // Confirm with server response
      setLocalStock(data.newStock);
      setQty(0);
      setIsUpdating(false);
      setUpdateNotice({ change: changeAmount, previousStock });
      if (onStockUpdated) {
        onStockUpdated(data.product);
      }
    } catch {
      // Network rollback
      setLocalStock(previousStock);
      setErrorMessage('Network error. Rolled back to previous confirmed stock.');
      setIsUpdating(false);
    }
  };

  const handleUndo = async () => {
    if (!updateNotice || isUndoing) return;

    setIsUndoing(true);
    try {
      const res = await fetch(`/api/products/${product.id}/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ change: -updateNotice.change }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Unable to undo the update.');
        return;
      }

      setLocalStock(data.newStock);
      setUpdateNotice(null);
      if (onStockUpdated) {
        onStockUpdated(data.product);
      }
    } catch {
      setErrorMessage('Network error. The update could not be undone.');
    } finally {
      setIsUndoing(false);
    }
  };

  const isOutOfStock = localStock <= 0;
  const canAdd = qty > 0 && !isUpdating;
  const canRemove = qty > 0 && qty <= localStock && !isUpdating;

  return (
    <div
      className={`bg-white rounded-2xl p-5 border transition-all shadow-sm ${
        isOutOfStock
          ? 'border-rose-200 bg-rose-50/10'
          : 'border-slate-100 hover:border-slate-200'
      }`}
    >
      {/* Product Top Info */}
      <div className="flex items-start gap-3.5 mb-4">
        {/* Product Thumbnail */}
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Name & Category */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-900 truncate">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500">{product.category}</p>

          {/* Status Badge */}
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

      {/* Current Stock Display */}
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

      {/* Quantity Input */}
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

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* + Add Stock */}
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

        {/* - Remove Stock */}
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

      {updateNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[2px]">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`updated-title-${product.id}`}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/5"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h2 id={`updated-title-${product.id}`} className="text-base font-bold text-slate-900">
                  The product has been updated
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Stock changed from {updateNotice.previousStock} to {localStock} units.
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleUndo}
                disabled={isUndoing}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUndoing ? 'Undoing...' : 'Undo'}
              </button>
              <button
                type="button"
                onClick={() => setUpdateNotice(null)}
                disabled={isUndoing}
                className="rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
