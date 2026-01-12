export const categoryIcons: Record<string, string> = {
  'football': '⚽',
  'basketball': '🏀',
  'running': '🏃',
  'polo': '👔',
  'school-sports': '🏫',
  'company-sports': '🏢',
}

export const categoryPrefixes: Record<string, string> = {
  'football': 'FT',
  'basketball': 'BK',
  'running': 'RN',
  'polo': 'PL',
  'school-sports': 'SC',
  'company-sports': 'CP',
}

export function generateDesignCode(slug: string, number: number, year?: number): string {
  const prefix = categoryPrefixes[slug] || slug.substring(0, 2).toUpperCase()
  const yearSuffix = year ? `-${String(year).slice(-2)}` : ''
  return `${prefix}-${String(number).padStart(3, '0')}${yearSuffix}`
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Helper to ensure image path starts with /
export function getImageSrc(path: string | null): string | null {
  if (!path) return null
  return path.startsWith('/') ? path : `/${path}`
}
