import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateDesignCode } from '@/lib/utils'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const designs = await prisma.design.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(designs)
  } catch (error) {
    return NextResponse.json({ error: 'ເກີດຂໍ້ຜິດພາດ' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const categoryId = parseInt(formData.get('categoryId') as string)
    const code = formData.get('code') as string
    const year = parseInt(formData.get('year') as string) || new Date().getFullYear()
    const note = formData.get('note') as string || null
    const imageFile = formData.get('image') as File

    if (!categoryId || !imageFile) {
      return NextResponse.json({ error: 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ' }, { status: 400 })
    }

    // Get category
    const category = await prisma.category.findUnique({ where: { id: categoryId } })
    if (!category) {
      return NextResponse.json({ error: 'ບໍ່ພົບໝວດໝູ່' }, { status: 400 })
    }

    // Generate code if not provided
    let designCode = code
    if (!designCode) {
      const designCount = await prisma.design.count({ where: { categoryId } })
      designCode = generateDesignCode(category.slug, designCount + 1, year)
    }

    // Check if code exists
    const existing = await prisma.design.findUnique({ where: { code: designCode } })
    if (existing) {
      return NextResponse.json({ error: 'ລະຫັດນີ້ມີແລ້ວ' }, { status: 400 })
    }

    // Save image
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'designs', category.slug)
    await mkdir(uploadDir, { recursive: true })

    const ext = imageFile.name.split('.').pop()
    const filename = `${designCode}.${ext}`
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    const imagePath = `/uploads/designs/${category.slug}/${filename}`

    const design = await prisma.design.create({
      data: {
        categoryId,
        code: designCode,
        year,
        note,
        imagePath,
        isActive: true
      }
    })

    return NextResponse.json(design, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'ເກີດຂໍ້ຜິດພາດ' }, { status: 500 })
  }
}
