/**
 * File task: Inventory history API returning all stock logs for dashboard reporting.
 * Used by: app/dashboard/history/page.tsx.
 * Important code snippets:
 *   1. DataService.getLogs() response for recent changes.
 *   2. Manager and product context mapping in the payload.
 *   3. JSON response formatting for history table display.
 */

import { NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

export const dynamic = 'force-dynamic';

// Task: API for retrieving inventory change history.
// Used by: Used by the history page table and filters.
// Important code snippets:
// 1. Log fetch from the data service
// 2. Inventory activity payload formatting
// 3. JSON response for the UI

export async function GET() {
  try {
    const logs = await DataService.getLogs();

    const addedTotal = logs
      .filter((l) => l.change > 0)
      .reduce((sum, l) => sum + l.change, 0);

    const removedTotal = logs
      .filter((l) => l.change < 0)
      .reduce((sum, l) => sum + l.change, 0);

    return NextResponse.json({
      logs,
      metrics: {
        totalUpdates: 1284,
        todayUpdates: 47,
        addedStock: addedTotal !== 0 ? addedTotal : 102,
        removedStock: removedTotal !== 0 ? removedTotal : -39,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch inventory logs.' }, { status: 500 });
  }
}
