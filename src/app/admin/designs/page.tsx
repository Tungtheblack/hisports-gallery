import Link from 'next/link'
import Image from 'next/image'
import { prisma, Category, Design } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

type DesignWithCategory = NonNullable<Design> & { category: NonNullable<Category> }

async function getDesigns(): Promise<DesignWithCategory[]> {
  return await prisma.design.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  }) as DesignWithCategory[]
}

export const metadata = {
  title: 'ຈັດການຜົນງານ - Hi Sports Admin'
}

export default async function DesignsPage() {
  const designs = await getDesigns()

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">🛠️ Admin Dashboard</h1>
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              ← ກັບໜ້າເວັບ
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800/50 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            <Link 
              href="/admin" 
              className="py-3 px-4 text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/categories" 
              className="py-3 px-4 text-gray-400 hover:text-white transition-colors"
            >
              ໝວດໝູ່
            </Link>
            <Link 
              href="/admin/designs" 
              className="py-3 px-4 text-white border-b-2 border-pink-500 font-medium"
            >
              ຜົນງານ
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">🎨 ຜົນງານທັງໝົດ ({designs.length})</h2>
          <Link
            href="/admin/designs/add"
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg 
                      font-medium transition-colors"
          >
            ➕ ເພີ່ມຜົນງານ
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {designs.map((design) => (
            <div key={design.id} className="bg-gray-800 rounded-xl overflow-hidden group">
              <div className="relative aspect-square">
                <Image
                  src={design.imagePath.startsWith('/') ? design.imagePath : `/${design.imagePath}`}
                  alt={design.code}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                              transition-opacity flex items-center justify-center gap-2">
                  <Link
                    href={`/admin/designs/${design.id}/edit`}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    ✏️
                  </Link>
                </div>
              </div>
              <div className="p-3">
                <p className="text-white font-medium text-sm truncate">{design.code}</p>
                <p className="text-gray-400 text-xs truncate">{design.category.name}</p>
              </div>
            </div>
          ))}
        </div>
        
        {designs.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">📭</div>
            <p>ຍັງບໍ່ມີຜົນງານ</p>
          </div>
        )}
      </main>
    </div>
  )
}
