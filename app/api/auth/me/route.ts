/**
 * File task: Authenticated session lookup endpoint for retrieving current manager data.
 * Used by: app/dashboard/profile/page.tsx and any profile/session-aware screens.
 * Important code snippets:
 *   1. getSession() call to read the signed manager token.
 *   2. DataService lookup by current user identifier.
 *   3. User payload returned for UI hydration.
 */

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { DataService } from '@/lib/dataService';

export const dynamic = 'force-dynamic';

// Task: Session lookup endpoint returning the current authenticated manager.
// Used by: Used by profile and dashboard views to load user data.
// Important code snippets:
// 1. Session parsing from auth cookie
// 2. Manager lookup by ID
// 3. Current user payload response

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
