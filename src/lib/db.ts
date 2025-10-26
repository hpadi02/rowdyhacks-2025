import { PrismaClient } from '@prisma/client';
import { MockDB } from './mock-db';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Try to create Prisma client, fallback to mock if it fails
let prismaClient: PrismaClient | null = null;
let useMockDB = false;

try {
  prismaClient = new PrismaClient({
    log: ['query'],
  });
} catch (error) {
  console.log('⚠️  Prisma connection failed, using mock database');
  useMockDB = true;
}

export const db = prismaClient || MockDB as any;

if (process.env.NODE_ENV !== 'production' && prismaClient) {
  globalForPrisma.prisma = prismaClient;
}

// Export mock flag for API routes to know when to use mock data
export const isUsingMockDB = useMockDB;
