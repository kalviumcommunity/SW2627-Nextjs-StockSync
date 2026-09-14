import { HistoryController } from '@/controllers/historyController';

export const dynamic = 'force-dynamic';

export async function GET() {
  return HistoryController.getHistoryLogs();
}
