import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Export types for use in components
export type Category = Awaited<ReturnType<typeof prisma.category.findFirst>>
export type Design = Awaited<ReturnType<typeof prisma.design.findFirst>>
