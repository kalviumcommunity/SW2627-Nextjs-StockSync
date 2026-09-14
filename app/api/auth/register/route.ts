import { AuthController } from '@/controllers/authController';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  return AuthController.register(req);
}
