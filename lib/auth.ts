/**
 * File task: Authentication helpers for hashing, verifying passwords, creating JWT tokens, and reading session cookies.
 * Used by: app/api/auth/login/route.ts, app/api/auth/register/route.ts, app/api/auth/me/route.ts, app/api/products/[id]/stock/route.ts, app/api/profile/route.ts.
 * Important code snippets:
 *   1. hashPassword() and verifyPassword() using bcrypt.
 *   2. signToken() and verifyToken() for JWT session handling.
 *   3. getSession() reading the auth cookie from Next.js server actions.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'stocksync-super-secret-key-2026';
const COOKIE_NAME = 'stocksync_token';

export interface ManagerSession {
  id: string;
  name: string;
  email: string;
}

// Task: Authentication helpers for hashing, JWT tokens, and session validation.
// Used by: Used by login, register, profile, and protected stock update routes.
// Important code snippets:
// 1. Password hashing and verification
// 2. JWT creation and validation
// 3. Session cookie reading for protected APIs

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: ManagerSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): ManagerSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as ManagerSession;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<ManagerSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
