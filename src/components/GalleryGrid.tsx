'use client'

import Image from 'next/image'
import { useState, useCallback } from 'react'
import ImagePreview from '@/components/ImagePreview'

interface Design {
  id: number
  code: string
  year: number
  note: string | null
  imagePath: string
  category: {
    name: string
    slug: string
  }
}

interface Props {
  designs: Design[]
}

// Helper to ensure image path starts with /
function getImageSrc(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

export default function GalleryGrid({ designs }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const openPreview = useCallback((index: number) => {
    setSelectedIndex(index)
  }, [])

  const closePreview = useCallback(() => {
    setSelectedIndex(null)
  }, [])

  const goToPrevious = useCallback(() => {
    setSelectedIndex(prev => 
      prev !== null ? (prev === 0 ? designs.length - 1 : prev - 1) : null
    )
  }, [designs.length])

  const goToNext = useCallback(() => {
    setSelectedIndex(prev => 
      prev !== null ? (prev === designs.length - 1 ? 0 : prev + 1) : null
    )
  }, [designs.length])

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {designs.map((design, index) => (
          <div
            key={design.id}
            onClick={() => openPreview(index)}
            className="group relative aspect-square bg-white/10 rounded-xl overflow-hidden cursor-pointer
                      hover:ring-2 hover:ring-pink-400 transition-all duration-300"
          >
            <Image
              src={getImageSrc(design.imagePath)}
              alt={design.code}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-semibold text-sm">{design.code}</p>
                <p className="text-white/70 text-xs">{design.category.name}</p>
              </div>
            </div>

            {/* Design Code Badge */}
            <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
              <span className="text-white text-xs font-medium">{design.code}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {selectedIndex !== null && (
        <ImagePreview
          design={designs[selectedIndex]}
          onClose={closePreview}
          onPrevious={goToPrevious}
          onNext={goToNext}
          currentIndex={selectedIndex}
          totalCount={designs.length}
        />
      )}
    </>
  )
}
