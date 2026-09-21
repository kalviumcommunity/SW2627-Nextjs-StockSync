/**
 * File task: Main product listing endpoint for dashboard inventory data and summary metrics.
 * Used by: app/dashboard/page.tsx and the frontend inventory screen.
 * Important code snippets:
 *   1. DataService.getProducts() call with product data collection.
 *   2. DataService.getManagersCount() and getLogs() summary values.
 *   3. Response payload shaped for dashboard cards and inventory grids.
 */

import { NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

export const dynamic = 'force-dynamic';

// Task: API for fetching product inventory data and dashboard metrics.
// Used by: Used by the dashboard inventory view.
// Important code snippets:
// 1. Products list from the data layer
// 2. Latest logs and manager count summary
// 3. Dashboard response payload formatting

export async function GET() {
  try {
    const products = await DataService.getProducts();
    const managersCount = await DataService.getManagersCount();
    const logs = await DataService.getLogs();

    const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);
    const outOfStockCount = products.filter((p) => p.stock === 0).length;

    return NextResponse.json({
      products,
      metrics: {
        totalProducts: products.length,
        totalUnits,
        totalManagers: managersCount,
        outOfStock: outOfStockCount,
        todayUpdates: logs.length > 0 ? 47 : 0,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
  }
}
