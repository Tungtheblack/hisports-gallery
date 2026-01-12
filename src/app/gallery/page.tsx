import Link from 'next/link'
import Image from 'next/image'
import { prisma, Category, Design } from '@/lib/prisma'
import GalleryGrid from '@/components/GalleryGrid'

export const dynamic = 'force-dynamic'

type DesignWithCategory = NonNullable<Design> & { category: NonNullable<Category> }

async function getAllDesigns(): Promise<DesignWithCategory[]> {
  return await prisma.design.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  }) as DesignWithCategory[]
}

async function getCategories(): Promise<Category[]> {
  return await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  })
}

export const metadata = {
  title: 'ທຸກຜົນງານ - Hi Sports',
  description: 'ເບິ່ງຜົນງານອອກແບບເສື້ອກິລາທັງໝົດຂອງ Hi Sports'
}

export default async function GalleryPage() {
  const [designs, categories] = await Promise.all([
    getAllDesigns(),
    getCategories()
  ])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-white hover:text-pink-300 transition-colors">
              <span className="text-xl">← ໜ້າຫຼັກ</span>
            </Link>
            <div className="text-center">
              <h1 className="text-xl md:text-2xl font-bold text-white">
                🎨 ທຸກຜົນງານ
              </h1>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="sticky top-16 z-30 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Link
              href="/gallery"
              className="flex-shrink-0 px-4 py-2 rounded-full bg-white/20 text-white 
                        text-sm font-medium hover:bg-white/30 transition-colors"
            >
              ທັງໝົດ ({designs.length})
            </Link>
            {categories.filter((c): c is NonNullable<typeof c> => c !== null).map((category) => (
              <Link
                key={category.id}
                href={`/gallery/${category.slug}`}
                className="flex-shrink-0 px-4 py-2 rounded-full bg-white/10 text-white/80 
                          text-sm font-medium hover:bg-white/20 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <main className="container mx-auto px-4 py-6">
        {designs.length > 0 ? (
          <GalleryGrid designs={designs} />
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-white/60 text-lg">ຍັງບໍ່ມີຜົນງານເທື່ອ</p>
          </div>
        )}
      </main>
    </div>
  )
}
