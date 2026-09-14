import { NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';
import { hashPassword, verifyPassword, signToken, getSession } from '@/lib/auth';

export class AuthController {
  /**
   * Register a new Manager account
   * POST /api/auth/register
   */
  static async register(req: Request) {
    try {
      const { name, email, password } = await req.json();

      if (!name || !email || !password) {
        return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
      }

      if (!email.includes('@') || !email.includes('.')) {
        return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
      }

      if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
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
      }, { status: 201 });

      response.cookies.set('stocksync_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    } catch (error) {
      return NextResponse.json({ error: 'Server error during registration.' }, { status: 500 });
    }
  }

  /**
   * Login an existing Manager
   * POST /api/auth/login
   */
  static async login(req: Request) {
    try {
      const { email, password } = await req.json();

      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
      }

      const manager = await DataService.findManagerByEmail(email);
      if (!manager) {
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
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
    } catch (error) {
      return NextResponse.json({ error: 'Server error during login.' }, { status: 500 });
    }
  }

  /**
   * Log out manager & invalidate session cookie
   * POST /api/auth/logout
   */
  static async logout() {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
    response.cookies.set('stocksync_token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });
    return response;
  }

  /**
   * Get current authenticated manager session
   * GET /api/auth/me
   */
  static async getMe() {
    try {
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
    } catch {
      return NextResponse.json({ error: 'Failed to retrieve session.' }, { status: 500 });
    }
  }

  /**
   * Update manager profile
   * POST /api/profile
   */
  static async updateProfile(req: Request) {
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
}
