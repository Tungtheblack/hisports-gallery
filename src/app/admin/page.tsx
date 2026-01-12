import Link from 'next/link'
import { prisma } from '@/lib/prisma'

async function getStats() {
  const [categoriesCount, designsCount] = await Promise.all([
    prisma.category.count({ where: { isActive: true } }),
    prisma.design.count({ where: { isActive: true } })
  ])
  return { categoriesCount, designsCount }
}

export const metadata = {
  title: 'Admin Dashboard - Hi Sports'
}

export default async function AdminDashboard() {
  const stats = await getStats()

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
              className="py-3 px-4 text-white border-b-2 border-pink-500 font-medium"
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
              className="py-3 px-4 text-gray-400 hover:text-white transition-colors"
            >
              ຜົນງານ
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="text-4xl mb-2">📁</div>
            <div className="text-3xl font-bold">{stats.categoriesCount}</div>
            <div className="text-white/80">ໝວດໝູ່ທັງໝົດ</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white">
            <div className="text-4xl mb-2">🎨</div>
            <div className="text-3xl font-bold">{stats.designsCount}</div>
            <div className="text-white/80">ຜົນງານທັງໝົດ</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="text-4xl mb-2">📈</div>
            <div className="text-3xl font-bold">{new Date().getFullYear()}</div>
            <div className="text-white/80">ປີປະຈຸບັນ</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">⚡ ດຳເນີນການດ່ວນ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/categories/add"
              className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 rounded-xl p-4 transition-colors"
            >
              <span className="text-2xl">➕</span>
              <div>
                <div className="text-white font-medium">ເພີ່ມໝວດໝູ່ໃໝ່</div>
                <div className="text-gray-400 text-sm">ສ້າງໝວດໝູ່ໃໝ່ສຳລັບຜົນງານ</div>
              </div>
            </Link>
            
            <Link
              href="/admin/designs/add"
              className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 rounded-xl p-4 transition-colors"
            >
              <span className="text-2xl">🖼️</span>
              <div>
                <div className="text-white font-medium">ເພີ່ມຜົນງານໃໝ່</div>
                <div className="text-gray-400 text-sm">ອັບໂຫລດຜົນງານອອກແບບໃໝ່</div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
