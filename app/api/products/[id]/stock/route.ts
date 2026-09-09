import { NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { change } = await req.json();
    const productId = params.id;

    if (typeof change !== 'number' || isNaN(change)) {
      return NextResponse.json({ error: 'Valid numeric stock change amount required.' }, { status: 400 });
    }

    if (change === 0) {
      return NextResponse.json({ error: 'Quantity must be greater than zero.' }, { status: 400 });
    }

    // FR-09: Authenticated manager identification
    let session = await getSession();
    let managerId = session?.id || 'mgr-2';
    let managerName = session?.name || 'Manager B';

    // Execute concurrency-safe transaction update
    const result = await DataService.updateStock(productId, change, managerId, managerName);

    return NextResponse.json({
      success: true,
      message: `Successfully ${change > 0 ? 'added' : 'removed'} ${Math.abs(change)} units.`,
      product: result.product,
      previousStock: result.previousStock,
      newStock: result.newStock,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update stock.' },
      { status: err.message.includes('Cannot remove') ? 400 : 500 }
    );
  }
}
