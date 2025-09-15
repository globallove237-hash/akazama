import { PrismaClient } from "@/lib/generated/prisma";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Add better error handling for Prisma client initialization
let prismaInstance: PrismaClient;

try {
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient();
} catch (error) {
  console.error("Failed to initialize Prisma Client:", error);
  // Fallback to a new instance if global instance fails
  prismaInstance = new PrismaClient();
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;