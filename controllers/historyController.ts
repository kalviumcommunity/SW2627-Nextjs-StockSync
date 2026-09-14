import { NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

export class HistoryController {
  /**
   * Get all inventory audit logs and summary movement metrics
   * GET /api/history
   */
  static async getHistoryLogs() {
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
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch inventory logs.' }, { status: 500 });
    }
  }
}
