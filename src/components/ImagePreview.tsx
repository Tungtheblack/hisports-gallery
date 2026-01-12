'use client'

import Image from 'next/image'
import { useEffect, useCallback, useState } from 'react'

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
  design: Design
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
  currentIndex: number
  totalCount: number
}

// Helper to ensure image path starts with /
function getImageSrc(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

export default function ImagePreview({ 
  design, 
  onClose, 
  onPrevious, 
  onNext,
  currentIndex,
  totalCount 
}: Props) {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)

  // Minimum swipe distance
  const minSwipeDistance = 50

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft') onPrevious()
    if (e.key === 'ArrowRight') onNext()
  }, [onClose, onPrevious, onNext])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [handleKeyDown])

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe) {
      onNext()
    }
    if (isRightSwipe) {
      onPrevious()
    }
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 
                  flex items-center justify-center text-white hover:bg-white/20 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation Arrows */}
      <button
        onClick={onPrevious}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 
                  rounded-full bg-white/10 flex items-center justify-center text-white 
                  hover:bg-white/20 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={onNext}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 
                  rounded-full bg-white/10 flex items-center justify-center text-white 
                  hover:bg-white/20 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Image Container */}
      <div 
        className={`relative w-full h-full flex items-center justify-center p-4 md:p-16
                   ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
        onClick={toggleZoom}
      >
        <div className={`relative w-full h-full transition-transform duration-300
                        ${isZoomed ? 'scale-150' : 'scale-100'}`}>
          <Image
            src={getImageSrc(design.imagePath)}
            alt={design.code}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 md:p-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-white text-xl md:text-2xl font-bold mb-1">{design.code}</h2>
          <p className="text-white/70 text-sm md:text-base">
            {design.category.name} • {design.year}
          </p>
          {design.note && (
            <p className="text-white/50 text-sm mt-2">{design.note}</p>
          )}
          <p className="text-white/40 text-xs mt-3">
            {currentIndex + 1} / {totalCount} • ປັດຊ້າຍ-ຂວາເພື່ອເລື່ອນ
          </p>
        </div>
      </div>
    </div>
  )
}
