import { NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const session = await getSession();
    const managerId = session?.id || 'mgr-2';

    const updated = await DataService.updateManager(managerId, name, email);

    return NextResponse.json({
      success: true,
      manager: { id: updated.id, name: updated.name, email: updated.email },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update profile.' }, { status: 500 });
  }
}
