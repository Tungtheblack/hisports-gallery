import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateDesignCode } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = parseInt(searchParams.get('categoryId') || '')

    if (!categoryId) {
      return NextResponse.json({ error: 'ກະລຸນາເລືອກໝວດໝູ່' }, { status: 400 })
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId } })
    if (!category) {
      return NextResponse.json({ error: 'ບໍ່ພົບໝວດໝູ່' }, { status: 400 })
    }

    const designCount = await prisma.design.count({ where: { categoryId } })
    const year = new Date().getFullYear()
    const code = generateDesignCode(category.slug, designCount + 1, year)

    return NextResponse.json({ code })
  } catch (error) {
    return NextResponse.json({ error: 'ເກີດຂໍ້ຜິດພາດ' }, { status: 500 })
  }
}
