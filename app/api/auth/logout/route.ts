/**
 * File task: API endpoint for logging the current manager out and clearing auth cookies.
 * Used by: Sidebar logout action and UI-level session cleanup.
 * Important code snippets:
 *   1. Cookie deletion from the session token.
 *   2. Response returning successful logout state.
 *   3. force-dynamic export for Next.js runtime behavior.
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Task: Logout endpoint clearing the manager session.
// Used by: Used by the sidebar logout action.
// Important code snippets:
// 1. Cookie removal logic
// 2. Logout response payload
// 3. force-dynamic route behavior

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
  response.cookies.set('stocksync_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}
