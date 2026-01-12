import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateDesignCode } from '@/lib/utils'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const designs = await prisma.design.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(designs)
  } catch (error) {
    console.error('Designs GET error:', error)
    return NextResponse.json({ error: 'ເກີດຂໍ້ຜິດພາດ' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { categoryId, code, year, note, imageUrl } = body

    if (!categoryId || !imageUrl) {
      return NextResponse.json({ error: 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ' }, { status: 400 })
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId } })
    if (!category) {
      return NextResponse.json({ error: 'ບໍ່ພົບໝວດໝູ່' }, { status: 400 })
    }

    let designCode = code
    if (!designCode) {
      const designCount = await prisma.design.count({ where: { categoryId } })
      designCode = generateDesignCode(category.slug, designCount + 1, year || new Date().getFullYear())
    }

    const existing = await prisma.design.findUnique({ where: { code: designCode } })
    if (existing) {
      return NextResponse.json({ error: 'ລະຫັດນີ້ມີແລ້ວ' }, { status: 400 })
    }

    const design = await prisma.design.create({
      data: {
        categoryId,
        code: designCode,
        year: year || new Date().getFullYear(),
        note: note || null,
        imagePath: imageUrl,
        isActive: true
      }
    })

    return NextResponse.json(design, { status: 201 })
  } catch (error) {
    console.error('Designs POST error:', error)
    return NextResponse.json({ error: 'ເກີດຂໍ້ຜິດພາດ' }, { status: 500 })
  }
}
