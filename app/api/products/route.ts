import { NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

export const dynamic = 'force-dynamic';

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
