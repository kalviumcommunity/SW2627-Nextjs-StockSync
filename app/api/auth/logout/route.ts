import { AuthController } from '@/controllers/authController';

export const dynamic = 'force-dynamic';

export async function POST() {
  return AuthController.logout();
}
