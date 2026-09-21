/**
 * File task: Manager account creation endpoint with email verification handling.
 * Used by: app/register/page.tsx during the sign-up flow.
 * Important code snippets:
 *   1. email normalization and duplicate user checks.
 *   2. hashPassword() and database creation logic.
 *   3. Verification token generation and sendVerificationEmail().
 */

import { NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';
import { hashPassword, signToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

// Task: Registration API for creating a manager account and sending verification email.
// Used by: Used by the registration page.
// Important code snippets:
// 1. Duplicate email checks and validation
// 2. Password hashing and manager creation
// 3. Verification email token generation and send logic

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
    await sendVerificationEmail(newManager.email, newManager.name, verificationToken);

    const response = NextResponse.json({
      success: true,
      message: 'Account created. Check your email to verify your account before logging in.',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Server error during registration.' }, { status: 500 });
  }
}
