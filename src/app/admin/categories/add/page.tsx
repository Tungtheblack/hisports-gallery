'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddCategoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'ເກີດຂໍ້ຜິດພາດ')
      }

      router.push('/admin/categories')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/admin/categories"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← ກັບຄືນ
          </Link>
          <h2 className="text-2xl font-bold text-white">➕ ເພີ່ມໝວດໝູ່ໃໝ່</h2>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-6 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-white font-medium mb-2">ຊື່ໝວດໝູ່ *</label>
            <input
              type="text"
              name="name"
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white 
                        placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
              placeholder="ເຊັ່ນ: ເສື້ອບານເຕະ"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">ລຳດັບການສະແດງ</label>
            <input
              type="number"
              name="sortOrder"
              defaultValue={0}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white 
                        placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">ຮູບພາບປົກ</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white 
                        file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                        file:bg-pink-500 file:text-white file:cursor-pointer"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-500/50 
                        text-white py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? 'ກຳລັງບັນທຶກ...' : '💾 ບັນທຶກ'}
            </button>
            <Link
              href="/admin/categories"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg 
                        font-medium transition-colors text-center"
            >
              ຍົກເລີກ
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
