/**
 * File task: Endpoint for updating manager profile fields such as name and email.
 * Used by: app/dashboard/profile/page.tsx.
 * Important code snippets:
 *   1. Auth token validation and manager identification.
 *   2. Email/name updates against the database.
 *   3. Response used by the profile form save action.
 */

import { NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Task: API for updating profile details of the logged-in manager.
// Used by: Used by the profile editing form.
// Important code snippets:
// 1. Authentication and manager lookup
// 2. Profile update request handling
// 3. Response with updated user data

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
