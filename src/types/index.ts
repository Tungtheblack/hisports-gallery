export interface Category {
  id: number
  name: string
  slug: string
  imagePath: string | null
  sortOrder: number
  isActive: boolean
  _count?: {
    designs: number
  }
}

export interface Design {
  id: number
  categoryId: number
  code: string
  year: number
  note: string | null
  imagePath: string
  isActive: boolean
  category?: Category
}
