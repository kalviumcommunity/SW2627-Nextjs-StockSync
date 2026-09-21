/**
 * File task: API endpoint that verifies the email token after a user clicks the confirmation link.
 * Used by: app/verify-email/page.tsx.
 * Important code snippets:
 *   1. token extraction from the request URL.
 *   2. manager lookup and verification timestamp update.
 *   3. success or error response payload.
 */

import { NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

export const dynamic = 'force-dynamic';

// Task: Email verification endpoint for validating the signup token.
// Used by: Used by the verify-email page.
// Important code snippets:
// 1. Token extraction from the URL
// 2. Manager verification update in the database
// 3. Success or failure JSON response

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Verification token is required.' }, { status: 400 });
  }

  try {
    const manager = await DataService.verifyEmail(token);
    return NextResponse.json({
      success: true,
      message: `Email verified for ${manager.email}. You can now log in.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Email verification failed.' },
      { status: 400 }
    );
  }
}