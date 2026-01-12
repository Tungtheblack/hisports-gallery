import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/lib/utils'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Categories GET error:', error)
    return NextResponse.json({ error: 'ເກີດຂໍ້ຜິດພາດ' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 0
    const imageUrl = formData.get('imageUrl') as string | null // ໃຊ້ external URL ແທນ file upload

    if (!name) {
      return NextResponse.json({ error: 'ກະລຸນາປ້ອນຊື່ໝວດໝູ່' }, { status: 400 })
    }

    const slug = createSlug(name)

    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'ໝວດໝູ່ນີ້ມີແລ້ວ' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        imagePath: imageUrl,
        sortOrder,
        isActive: true
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Categories POST error:', error)
    return NextResponse.json({ error: 'ເກີດຂໍ້ຜິດພາດ' }, { status: 500 })
  }
}
