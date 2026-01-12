'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { uploadToHostinger } from '@/lib/upload'

interface Category {
  id: number
  name: string
  slug: string
}

export default function AddDesignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [generatedCode, setGeneratedCode] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err))
  }, [])

  async function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const categoryId = e.target.value
    if (categoryId) {
      try {
        const res = await fetch(`/api/designs/generate-code?categoryId=${categoryId}`)
        const data = await res.json()
        setGeneratedCode(data.code)
      } catch (err) {
        console.error(err)
      }
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Upload file to Hostinger
      if (!selectedFile) {
        throw new Error('ກະລຸນາເລືອກຮູບ')
      }

      const uploadResult = await uploadToHostinger(selectedFile, 'designs', generatedCode)
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed')
      }

      // 2. Save to database via API
      const formData = new FormData(e.currentTarget)
      const body = {
        categoryId: parseInt(formData.get('categoryId') as string),
        code: formData.get('code') as string,
        year: parseInt(formData.get('year') as string),
        note: formData.get('note') as string,
        imageUrl: uploadResult.url
      }

      const res = await fetch('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'ເກີດຂໍ້ຜິດພາດ')
      }

      router.push('/admin/designs')
      router.refresh()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'ເກີດຂໍ້ຜິດພາດ'
      setError(errorMessage)
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
            href="/admin/designs"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← ກັບຄືນ
          </Link>
          <h2 className="text-2xl font-bold text-white">🖼️ ເພີ່ມຜົນງານໃໝ່</h2>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-6 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-white font-medium mb-2">ໝວດໝູ່ *</label>
            <select
              name="categoryId"
              required
              onChange={handleCategoryChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white 
                        focus:outline-none focus:border-pink-500 transition-colors"
            >
              <option value="">-- ເລືອກໝວດໝູ່ --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">ລະຫັດຜົນງານ (ສ້າງອັດຕະໂນມັດ)</label>
            <input
              type="text"
              name="code"
              value={generatedCode}
              readOnly
              className="w-full bg-gray-600 border border-gray-600 rounded-lg px-4 py-3 text-white 
                        placeholder-gray-400"
              placeholder="ເລືອກໝວດໝູ່ກ່ອນ"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">ປີ</label>
            <input
              type="number"
              name="year"
              defaultValue={new Date().getFullYear()}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white 
                        focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">ໝາຍເຫດ</label>
            <textarea
              name="note"
              rows={3}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white 
                        placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
              placeholder="ລາຍລະອຽດເພີ່ມເຕີມ (ຖ້າມີ)"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">ຮູບຜົນງານ *</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              required
              onChange={handleFileChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white 
                        file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                        file:bg-pink-500 file:text-white file:cursor-pointer"
            />
            {preview && (
              <div className="mt-3">
                <img src={preview} alt="Preview" className="max-h-48 rounded-lg" />
              </div>
            )}
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
              href="/admin/designs"
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
