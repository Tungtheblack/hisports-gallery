import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/lib/utils'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: 'ເກີດຂໍ້ຜິດພາດ' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 0
    const imageFile = formData.get('image') as File | null

    if (!name) {
      return NextResponse.json({ error: 'ກະລຸນາປ້ອນຊື່ໝວດໝູ່' }, { status: 400 })
    }

    const slug = createSlug(name)

    // Check if slug exists
    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'ໝວດໝູ່ນີ້ມີແລ້ວ' }, { status: 400 })
    }

    let imagePath = null

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create uploads directory
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'categories')
      await mkdir(uploadDir, { recursive: true })

      // Save file
      const ext = imageFile.name.split('.').pop()
      const filename = `${slug}-${Date.now()}.${ext}`
      const filePath = path.join(uploadDir, filename)
      await writeFile(filePath, buffer)

      imagePath = `/uploads/categories/${filename}`
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        imagePath,
        sortOrder,
        isActive: true
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'ເກີດຂໍ້ຜິດພາດ' }, { status: 500 })
  }
}
