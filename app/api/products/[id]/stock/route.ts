import { ProductController } from '@/controllers/productController';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  return ProductController.updateProductStock(req, params);
}
