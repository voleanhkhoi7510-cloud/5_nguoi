import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { formatSize } from './photoData'
import type { Photo } from './photoData'

interface Props {
  photos: Photo[]
  index: number
  onChange: (index: number) => void
  onClose: () => void
}

const sideButton = 'absolute top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white hover:bg-white/30'

export default function PhotoLightbox({ photos, index, onChange, onClose }: Props) {
  const photo = photos[index]
  const prev = () => onChange((index - 1 + photos.length) % photos.length)
  const next = () => onChange((index + 1) % photos.length)

  // Không khai báo deps để prev và next luôn theo ảnh đang xem
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!photo) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90" role="dialog" aria-modal="true" aria-label="Xem ảnh" onClick={onClose}>
      <div className="flex items-center justify-between gap-4 p-4 text-sm text-white" onClick={(e) => e.stopPropagation()}>
        <span className="min-w-0 truncate">
          {photo.name}
          {photo.size ? ` (${formatSize(photo.size)})` : ''}
        </span>
        <div className="flex shrink-0 items-center gap-4">
          <span>
            {index + 1}/{photos.length}
          </span>
          <button autoFocus onClick={onClose} className="rounded p-1 hover:bg-white/20" aria-label="Đóng">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-16 pb-6">
        {photos.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            className={`${sideButton} left-3`}
            aria-label="Ảnh trước"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <img
          src={photo.url}
          alt={photo.name}
          className="max-h-full max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        {photos.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            className={`${sideButton} right-3`}
            aria-label="Ảnh sau"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  )
}
