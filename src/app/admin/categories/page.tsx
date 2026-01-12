import Link from 'next/link'
import Image from 'next/image'
import { prisma, Category } from '@/lib/prisma'

type CategoryWithCount = NonNullable<Category> & { _count: { designs: number } }

async function getCategories(): Promise<CategoryWithCount[]> {
  return await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { designs: true }
      }
    }
  }) as CategoryWithCount[]
}

export const metadata = {
  title: 'ຈັດການໝວດໝູ່ - Hi Sports Admin'
}

export default async function CategoriesPage() {
  const categories = await getCategories()

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
              className="py-3 px-4 text-white border-b-2 border-pink-500 font-medium"
            >
              ໝວດໝູ່
            </Link>
            <Link 
              href="/admin/designs" 
              className="py-3 px-4 text-gray-400 hover:text-white transition-colors"
            >
              ຜົນງານ
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">📁 ໝວດໝູ່ທັງໝົດ</h2>
          <Link
            href="/admin/categories/add"
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg 
                      font-medium transition-colors"
          >
            ➕ ເພີ່ມໝວດໝູ່
          </Link>
        </div>

        <div className="bg-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">ລຳດັບ</th>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">ຮູບ</th>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">ຊື່ໝວດໝູ່</th>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">Slug</th>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">ຜົນງານ</th>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">ສະຖານະ</th>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">ຈັດການ</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-t border-gray-700 hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-white">{category.sortOrder}</td>
                  <td className="px-4 py-3">
                    {category.imagePath && category.imagePath.startsWith('/') ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                        <Image
                          src={category.imagePath}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center text-2xl">
                        📁
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{category.name}</td>
                  <td className="px-4 py-3 text-gray-400">{category.slug}</td>
                  <td className="px-4 py-3 text-white">{category._count.designs}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${category.isActive 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'}`}>
                      {category.isActive ? 'ເປີດໃຊ້' : 'ປິດ'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        ✏️ ແກ້ໄຂ
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {categories.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              ຍັງບໍ່ມີໝວດໝູ່
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
