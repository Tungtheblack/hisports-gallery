import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'unknown',
    database: 'unknown',
    error: null as string | null,
  }

  try {
    // Test database connection
    const startTime = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const dbTime = Date.now() - startTime

    checks.database = `connected (${dbTime}ms)`
    checks.status = 'healthy'
    
    // Get counts
    const categoryCount = await prisma.category.count()
    const designCount = await prisma.design.count()

    return NextResponse.json({
      ...checks,
      data: {
        categories: categoryCount,
        designs: designCount,
      }
    })
  } catch (error) {
    checks.status = 'unhealthy'
    checks.database = 'failed'
    checks.error = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(checks, { status: 500 })
  }
}
