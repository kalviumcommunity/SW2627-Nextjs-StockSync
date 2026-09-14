import { NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

export const dynamic = 'force-dynamic';

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