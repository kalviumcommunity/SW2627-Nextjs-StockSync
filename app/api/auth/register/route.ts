import { NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';
import { hashPassword, signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const existing = await DataService.findManagerByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'A manager with this email already exists.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const newManager = await DataService.createManager(name, email, passwordHash);

    const token = signToken({
      id: newManager.id,
      name: newManager.name,
      email: newManager.email,
    });

    const response = NextResponse.json({
      success: true,
      manager: { id: newManager.id, name: newManager.name, email: newManager.email },
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
    return NextResponse.json({ error: 'Server error during registration.' }, { status: 500 });
  }
}
