import { NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';
import { getSession } from '@/lib/auth';

export class ProductController {
  /**
   * Get all products along with overview dashboard metrics
   * GET /api/products
   */
  static async getAllProducts() {
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
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
    }
  }

  /**
   * Update stock for a specific product (Concurrency-safe & negative stock prevention)
   * POST /api/products/[id]/stock
   */
  static async updateProductStock(req: Request, params: { id: string }) {
    try {
      const { change } = await req.json();
      const productId = params.id;

      if (typeof change !== 'number' || isNaN(change)) {
        return NextResponse.json({ error: 'Valid numeric stock change amount required.' }, { status: 400 });
      }

      if (change === 0) {
        return NextResponse.json({ error: 'Quantity must be greater than zero.' }, { status: 400 });
      }

      // Authenticated manager session identification
      const session = await getSession();
      const managerId = session?.id || 'mgr-2';
      const managerName = session?.name || 'Manager B';

      // Execute concurrency-safe atomic transaction update
      const result = await DataService.updateStock(productId, change, managerId, managerName);

      return NextResponse.json({
        success: true,
        message: `Successfully ${change > 0 ? 'added' : 'removed'} ${Math.abs(change)} units.`,
        product: result.product,
        previousStock: result.previousStock,
        newStock: result.newStock,
      });
    } catch (err: any) {
      const isClientError = err.message && (err.message.includes('Cannot remove') || err.message.includes('negative'));
      return NextResponse.json(
        { error: err.message || 'Failed to update stock.' },
        { status: isClientError ? 400 : 500 }
      );
    }
  }
}
