import Link from 'next/link'
import Image from 'next/image'
import { prisma, Category } from '@/lib/prisma'
import { categoryIcons } from '@/lib/utils'

export const dynamic = 'force-dynamic'

type CategoryWithCount = NonNullable<Category> & { _count: { designs: number } }

async function getCategories(): Promise<CategoryWithCount[]> {
  return await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { designs: { where: { isActive: true } } }
      }
    }
  }) as CategoryWithCount[]
}

export default async function HomePage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                🏆 Hi Sports
              </h1>
              <p className="text-white/70 text-sm mt-1">ຜົນງານອອກແບບເສື້ອກິລາ</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">ເລືອກຫມວດຫມູ່ຜົນງານ</h2>
          <p className="text-white/60">ກົດເພື່ອເບິ່ງຜົນງານອອກແບບໃນແຕ່ລະຫມວດ</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/gallery/${category.slug}`}
              className="group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden text-center 
                        hover:bg-white/20 transition-all duration-300 hover:scale-105 
                        border border-white/20 hover:border-white/40"
            >
              {/* Category Image */}
              {category.imagePath && category.imagePath.startsWith('/') ? (
                <>
                  <div className="aspect-square overflow-hidden relative">
                    <Image
                      src={category.imagePath}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {category.name}
                    </h3>
                    <span className="inline-block bg-white/20 rounded-full px-3 py-1 text-sm text-white/80">
                      {category._count.designs} ແບບ
                    </span>
                  </div>
                </>
              ) : (
                <div className="p-6">
                  <div className="text-4xl md:text-5xl mb-3">
                    {categoryIcons[category.slug] || '👕'}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {category.name}
                  </h3>
                  <span className="inline-block bg-white/20 rounded-full px-3 py-1 text-sm text-white/80">
                    {category._count.designs} ແບບ
                  </span>
                </div>
              )}

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 
                      text-white px-6 py-3 rounded-full font-medium hover:from-pink-600 
                      hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>🎨</span>
            <span>ເບິ່ງທຸກຜົນງານ</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-white/50 text-sm">
        <p>© {new Date().getFullYear()} Hi Sports - ອອກແບບເສື້ອກິລາຄຸນນະພາບ</p>
      </footer>
    </div>
  )
}
