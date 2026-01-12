import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma, Category, Design } from '@/lib/prisma'
import { categoryIcons } from '@/lib/utils'
import GalleryGrid from '@/components/GalleryGrid'

interface Props {
  params: Promise<{ category: string }>
}

type CategoryWithDesigns = NonNullable<Category> & { designs: NonNullable<Design>[] }

async function getCategory(slug: string): Promise<CategoryWithDesigns | null> {
  return await prisma.category.findUnique({
    where: { slug, isActive: true },
    include: {
      designs: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  }) as CategoryWithDesigns | null
}

async function getCategories(): Promise<Category[]> {
  return await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  })
}

export async function generateMetadata({ params }: Props) {
  const { category: slug } = await params
  const category = await getCategory(slug)
  if (!category) return { title: 'ບໍ່ພົບຫມວດໝູ່' }
  
  return {
    title: `${category.name} - Hi Sports`,
    description: `ເບິ່ງຜົນງານອອກແບບ${category.name}ຂອງ Hi Sports`
  }
}

export default async function CategoryGalleryPage({ params }: Props) {
  const { category: slug } = await params
  const [category, categories] = await Promise.all([
    getCategory(slug),
    getCategories()
  ])

  if (!category) {
    notFound()
  }

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
              <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <span>{categoryIcons[category.slug] || '👕'}</span>
                <span>{category.name}</span>
              </h1>
            </div>
            <div className="w-20 text-right text-white/60 text-sm">
              {category.designs.length} ແບບ
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="sticky top-16 z-30 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Link
              href="/gallery"
              className="flex-shrink-0 px-4 py-2 rounded-full bg-white/10 text-white/80 
                        text-sm font-medium hover:bg-white/20 transition-colors"
            >
              ທັງໝົດ
            </Link>
            {categories.filter((cat): cat is NonNullable<typeof cat> => cat !== null).map((cat) => (
              <Link
                key={cat.id}
                href={`/gallery/${cat.slug}`}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${cat.slug === category.slug 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <main className="container mx-auto px-4 py-6">
        {category.designs.length > 0 ? (
          <GalleryGrid designs={category.designs.map((d: NonNullable<Design>) => ({ ...d, category }))} />
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-white/60 text-lg">ຍັງບໍ່ມີຜົນງານໃນຫມວດນີ້</p>
          </div>
        )}
      </main>
    </div>
  )
}
