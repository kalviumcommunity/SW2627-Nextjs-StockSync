import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { DataService } from '@/lib/dataService';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) {
    const defaultManager = await DataService.findManagerByEmail('manager@example.com');
    if (defaultManager) {
      return NextResponse.json({
        manager: { id: defaultManager.id, name: defaultManager.name, email: defaultManager.email },
      });
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const manager = await DataService.findManagerByEmail(session.email);
  return NextResponse.json({
    manager: manager
      ? { id: manager.id, name: manager.name, email: manager.email }
      : session,
  });
}
