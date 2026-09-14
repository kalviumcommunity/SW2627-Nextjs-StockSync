import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  image: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryLogItem {
  id: string;
  productId: string;
  productName: string;
  managerId: string;
  managerName: string;
  change: number;
  previousStock: number;
  newStock: number;
  createdAt: string;
  status: 'Successful' | 'Failed';
}

export interface ManagerUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt?: string | Date;
}

// Initial 12 Products matching exact doc screenshots
const initialProducts: ProductItem[] = [
  { id: 'prod-1', name: 'Maggi Noodles', category: 'Food', image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300&q=80', stock: 60 },
  { id: 'prod-2', name: 'Milk (1L)', category: 'Dairy', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80', stock: 8 },
  { id: 'prod-3', name: 'Brown Bread', category: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80', stock: 24 },
  { id: 'prod-4', name: 'Olive Oil', category: 'Cooking', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80', stock: 0 },
  { id: 'prod-5', name: 'Greek Yogurt', category: 'Dairy', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80', stock: 42 },
  { id: 'prod-6', name: 'Basmati Rice', category: 'Grains', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80', stock: 5 },
  { id: 'prod-7', name: 'Orange Juice', category: 'Beverages', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&q=80', stock: 31 },
  { id: 'prod-8', name: 'Cheddar Cheese', category: 'Dairy', image: 'https://images.unsplash.com/photo-1618164435735-413d3b066f9a?w=300&q=80', stock: 18 },
  { id: 'prod-9', name: 'Pasta (500g)', category: 'Food', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=300&q=80', stock: 55 },
  { id: 'prod-10', name: 'Tomato Sauce', category: 'Condiments', image: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=300&q=80', stock: 3 },
  { id: 'prod-11', name: 'Corn Flakes', category: 'Breakfast', image: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=300&q=80', stock: 22 },
  { id: 'prod-12', name: 'Black Tea', category: 'Beverages', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&q=80', stock: 67 },
];

const initialLogs: InventoryLogItem[] = [
  { id: 'log-1', productId: 'prod-1', productName: 'Maggi Noodles', managerId: 'mgr-2', managerName: 'Manager B', change: 5, previousStock: 60, newStock: 65, createdAt: new Date(Date.now() - 1000 * 60 * 2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'Successful' },
  { id: 'log-2', productId: 'prod-1', productName: 'Maggi Noodles', managerId: 'mgr-1', managerName: 'Manager A', change: 10, previousStock: 50, newStock: 60, createdAt: new Date(Date.now() - 1000 * 60 * 15).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'Successful' },
  { id: 'log-3', productId: 'prod-2', productName: 'Milk (1L)', managerId: 'mgr-1', managerName: 'Manager A', change: -5, previousStock: 30, newStock: 25, createdAt: new Date(Date.now() - 1000 * 60 * 30).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'Successful' },
  { id: 'log-4', productId: 'prod-3', productName: 'Brown Bread', managerId: 'mgr-3', managerName: 'Manager C', change: 12, previousStock: 12, newStock: 24, createdAt: new Date(Date.now() - 1000 * 60 * 45).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'Successful' },
  { id: 'log-5', productId: 'prod-4', productName: 'Olive Oil', managerId: 'mgr-2', managerName: 'Manager B', change: -8, previousStock: 8, newStock: 0, createdAt: new Date(Date.now() - 1000 * 60 * 60).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'Successful' },
];

// Fallback in-memory state stored globally to persist during dev server hot reloads
const globalStore = globalThis as unknown as {
  _products: ProductItem[];
  _logs: InventoryLogItem[];
  _managers: ManagerUser[];
};

if (!globalStore._products) {
  globalStore._products = JSON.parse(JSON.stringify(initialProducts));
}
if (!globalStore._logs) {
  globalStore._logs = JSON.parse(JSON.stringify(initialLogs));
}
if (!globalStore._managers) {
  globalStore._managers = [
    {
      id: 'mgr-1',
      name: 'Manager A',
      email: 'manager.a@example.com',
      passwordHash: bcrypt.hashSync('password', 10),
    },
    {
      id: 'mgr-2',
      name: 'Manager B',
      email: 'manager@example.com',
      passwordHash: bcrypt.hashSync('password', 10),
    },
    {
      id: 'mgr-3',
      name: 'Manager C',
      email: 'manager.c@example.com',
      passwordHash: bcrypt.hashSync('password', 10),
    },
  ];
}

export const DataService = {
  async getProducts(): Promise<ProductItem[]> {
    try {
      const dbProducts = await prisma.product.findMany({ orderBy: { name: 'asc' } });
      if (dbProducts && dbProducts.length > 0) {
        return dbProducts.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          image: p.image,
          stock: p.stock,
        }));
      }
    } catch {
      // Use in-memory fallback
    }
    return globalStore._products;
  },

  async updateStock(
    productId: string,
    change: number,
    managerId: string,
    managerName: string
  ): Promise<{ product: ProductItem; previousStock: number; newStock: number }> {
    if (change === 0) {
      throw new Error('Stock change amount cannot be zero.');
    }

    try {
      // 1. Resolve or ensure manager exists in PostgreSQL database to prevent Foreign Key violation
      let effectiveManagerId = managerId;
      try {
        const existingManager = await prisma.manager.findUnique({ where: { id: managerId } });
        if (!existingManager) {
          const firstMgr = await prisma.manager.findFirst();
          if (firstMgr) {
            effectiveManagerId = firstMgr.id;
          } else {
            const passwordHash = bcrypt.hashSync('password', 10);
            const created = await prisma.manager.create({
              data: {
                id: managerId,
                name: managerName || 'Manager B',
                email: 'manager@example.com',
                passwordHash,
              },
            });
            effectiveManagerId = created.id;
          }
        }
      } catch (mgrErr: any) {
        console.warn('[StockSync DB Notice] Manager check notice:', mgrErr?.message || mgrErr);
      }

      // 2. Perform atomic update in DB
      let updatedProduct: any = null;
      let createdLog: any = null;

      try {
        // Try interactive transaction
        const result = await prisma.$transaction(async (tx) => {
          const current = await tx.product.findUnique({ where: { id: productId } });
          if (!current) throw new Error('Product not found in database');
          if (current.stock + change < 0) {
            throw new Error('Cannot remove more stock than currently available.');
          }

          const updated = await tx.product.update({
            where: { id: productId },
            data: { stock: { increment: change } },
          });

          const log = await tx.inventoryLog.create({
            data: {
              productId,
              managerId: effectiveManagerId,
              change,
              previousStock: current.stock,
              newStock: updated.stock,
            },
          });

          return { product: updated, log };
        });

        updatedProduct = result.product;
        createdLog = result.log;
      } catch (txErr: any) {
        if (txErr.message === 'Cannot remove more stock than currently available.') {
          throw txErr;
        }
        console.warn('[StockSync DB Transaction Warning] Interactive tx failed (possibly Supabase pooler). Retrying direct queries:', txErr?.message || txErr);

        // Fallback to direct queries with Prisma atomic increment
        const current = await prisma.product.findUnique({ where: { id: productId } });
        if (!current) throw new Error('Product not found in database');
        if (current.stock + change < 0) {
          throw new Error('Cannot remove more stock than currently available.');
        }

        updatedProduct = await prisma.product.update({
          where: { id: productId },
          data: { stock: { increment: change } },
        });

        try {
          createdLog = await prisma.inventoryLog.create({
            data: {
              productId,
              managerId: effectiveManagerId,
              change,
              previousStock: current.stock,
              newStock: updatedProduct.stock,
            },
          });
        } catch (logErr: any) {
          console.error('[StockSync DB Error] Failed to write inventory log in PostgreSQL:', logErr?.message || logErr);
        }
      }

      if (updatedProduct) {
        // Synchronize in-memory cache as well
        const memProd = globalStore._products.find((p) => p.id === productId);
        if (memProd) {
          memProd.stock = updatedProduct.stock;
        }

        return {
          product: {
            id: updatedProduct.id,
            name: updatedProduct.name,
            category: updatedProduct.category,
            image: updatedProduct.image,
            stock: updatedProduct.stock,
          },
          previousStock: createdLog ? createdLog.previousStock : (updatedProduct.stock - change),
          newStock: updatedProduct.stock,
        };
      }

      throw new Error('Failed to update product in database');
    } catch (err: any) {
      if (err.message === 'Cannot remove more stock than currently available.') {
        throw err;
      }
      console.error('[StockSync DB Error in updateStock]:', err?.message || err);

      // Fallback to memory store
      const prod = globalStore._products.find((p) => p.id === productId);
      if (!prod) throw new Error('Product not found');
      if (prod.stock + change < 0) {
        throw new Error('Cannot remove more stock than currently available.');
      }

      const prev = prod.stock;
      prod.stock += change;

      const newLog: InventoryLogItem = {
        id: `log-${Date.now()}`,
        productId: prod.id,
        productName: prod.name,
        managerId,
        managerName,
        change,
        previousStock: prev,
        newStock: prod.stock,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Successful',
      };

      globalStore._logs.unshift(newLog);

      return {
        product: { ...prod },
        previousStock: prev,
        newStock: prod.stock,
      };
    }
  },

  async getLogs(): Promise<InventoryLogItem[]> {
    try {
      const logs = await prisma.inventoryLog.findMany({
        include: { product: true, manager: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      if (logs && logs.length > 0) {
        return logs.map((l) => ({
          id: l.id,
          productId: l.productId,
          productName: l.product.name,
          managerId: l.managerId,
          managerName: l.manager.name,
          change: l.change,
          previousStock: l.previousStock,
          newStock: l.newStock,
          createdAt: new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Successful',
        }));
      }
    } catch {
      // Fallback
    }
    return globalStore._logs;
  },

  async getManagersCount(): Promise<number> {
    try {
      const count = await prisma.manager.count();
      if (count > 0) return count;
    } catch {
      // Fallback
    }
    return globalStore._managers.length;
  },

  async findManagerByEmail(email: string): Promise<ManagerUser | null> {
    try {
      const mgr = await prisma.manager.findUnique({ where: { email } });
      if (mgr) return mgr;
    } catch {
      // Fallback
    }
    const found = globalStore._managers.find((m) => m.email.toLowerCase() === email.toLowerCase());
    return found || null;
  },

  async createManager(name: string, email: string, passwordHash: string): Promise<ManagerUser> {
    try {
      const created = await prisma.manager.create({
        data: { name, email, passwordHash },
      });
      return created;
    } catch {
      // Fallback
      const newMgr: ManagerUser = {
        id: `mgr-${Date.now()}`,
        name,
        email,
        passwordHash,
      };
      globalStore._managers.push(newMgr);
      return newMgr;
    }
  },

  async updateManager(id: string, name: string, email: string): Promise<ManagerUser> {
    try {
      const updated = await prisma.manager.update({
        where: { id },
        data: { name, email },
      });
      return updated;
    } catch {
      const mgr = globalStore._managers.find((m) => m.id === id);
      if (mgr) {
        mgr.name = name;
        mgr.email = email;
        return mgr;
      }
      throw new Error('Manager not found');
    }
  },
};
