import { NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';
import { verifyPassword, signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const manager = await DataService.findManagerByEmail(email.trim().toLowerCase());
    if (!manager) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    if (!manager.emailVerifiedAt) {
      return NextResponse.json(
        { error: 'Please verify your email address before logging in.' },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, manager.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = signToken({
      id: manager.id,
      name: manager.name,
      email: manager.email,
    });

    const response = NextResponse.json({
      success: true,
      manager: { id: manager.id, name: manager.name, email: manager.email },
    });

    response.cookies.set('stocksync_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Server error during login.' }, { status: 500 });
  }
}
