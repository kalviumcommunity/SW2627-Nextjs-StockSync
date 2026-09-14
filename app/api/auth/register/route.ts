import { NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';
import { hashPassword, signToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const existing = await DataService.findManagerByEmail(normalizedEmail);
    if (existing) {
      return NextResponse.json({ error: 'A manager with this email already exists.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const newManager = await DataService.createManager(name.trim(), normalizedEmail, passwordHash);
    const verificationToken = randomBytes(32).toString('hex');
    await DataService.createEmailVerificationToken(
      newManager.id,
      verificationToken,
      new Date(Date.now() + 24 * 60 * 60 * 1000)
    );
    try {
      await sendVerificationEmail(newManager.email, newManager.name, verificationToken);
    } catch (emailError) {
      await DataService.deleteManager(newManager.id);
      throw emailError;
    }

    const response = NextResponse.json({
      success: true,
      message: 'Account created. Check your email to verify your account before logging in.',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error during registration.' },
      { status: 500 }
    );
  }
}
