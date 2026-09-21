/**
 * File task: Shared data access layer for inventory products, logs, managers, and database-safe stock updates.
 * Used by: app/api/products/route.ts, app/api/history/route.ts, app/api/auth/register/route.ts, app/api/auth/login/route.ts, app/api/profile/route.ts, app/api/products/[id]/stock/route.ts.
 * Important code snippets:
 *   1. Product and log TypeScript interfaces for inventory data contracts.
 *   2. globalStore fallback for in-memory development data.
 *   3. getProducts(), getLogs(), updateStock(), and createManager() service methods.
 */

import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { createHash } from 'crypto';

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
  emailVerifiedAt?: Date | null;
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

// Shared inventory and manager service used by API routes.

export const DataService = {
  // Return products from Prisma or the in-memory fallback.
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

  // Update stock safely with a transaction and inventory log.
  async updateStock(productId: string, change: number, managerId: string, managerName: string) {
    if (change === 0) {
      throw new Error('Stock change amount cannot be zero.');
    }

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not configured. Inventory updates require a Supabase database connection.');
    }

    try {
      // 1. Prisma atomic transaction for Concurrency Safety (FR-11)
      const result = await prisma.$transaction(async (tx) => {
        const current = await tx.product.findUnique({ where: { id: productId } });
        if (!current) throw new Error('Product not found');
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
            managerId,
            change,
            previousStock: current.stock,
            newStock: updated.stock,
          },
        });

        return { product: updated, log };
      });

      return {
        product: {
          id: result.product.id,
          name: result.product.name,
          category: result.product.category,
          image: result.product.image,
          stock: result.product.stock,
        },
        previousStock: result.log.previousStock,
        newStock: result.log.newStock,
      };
    } catch (err: any) {
      if (err.message === 'Cannot remove more stock than currently available.') {
        throw err;
      }
      throw new Error(`Inventory update failed: ${err.message || 'database request failed.'}`);
    }
  },

  // Return recent inventory activity logs for the history page.
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

  // Count managers for the dashboard KPI totals.
  async getManagersCount(): Promise<number> {
    try {
      const count = await prisma.manager.count();
      if (count > 0) return count;
    } catch {
      // Fallback
    }
    return globalStore._managers.length;
  },

  // Look up a manager by email for login and auth checks.
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

  // Create a new manager account during registration.
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

  // Create a hashed email verification token for a manager.
  async createEmailVerificationToken(managerId: string, token: string, expiresAt: Date) {
    return prisma.emailVerificationToken.create({
      data: {
        managerId,
        tokenHash: createHash('sha256').update(token).digest('hex'),
        expiresAt,
      },
    });
  },

  // Verify a manager email token and mark the account as confirmed.
  async verifyEmail(token: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    return prisma.$transaction(async (tx) => {
      const record = await tx.emailVerificationToken.findUnique({
        where: { tokenHash },
        include: { manager: true },
      });

      if (!record || record.usedAt || record.expiresAt < new Date()) {
        throw new Error('This verification link is invalid or has expired.');
      }

      const manager = await tx.manager.update({
        where: { id: record.managerId },
        data: { emailVerifiedAt: new Date() },
      });

      await tx.emailVerificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      });

      return manager;
    });
  },

  // Update manager profile name and email.
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
