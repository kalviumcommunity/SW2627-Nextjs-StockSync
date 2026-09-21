/**
 * File task: Prisma database client singleton for application-wide data access.
 * Used by: lib/dataService.ts and all API routes that read or write database records.
 * Important code snippets:
 *   1. PrismaClient singleton initialization.
 *   2. Global guard against multiple client instances in dev mode.
 *   3. Exported prisma object for all repository operations.
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Task: Prisma database client singleton.
// Used by: Used by the data service and all database-backed routes.
// Important code snippets:
// 1. Global Prisma client initialization
// 2. Development-safe singleton pattern
// 3. Shared prisma export

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
