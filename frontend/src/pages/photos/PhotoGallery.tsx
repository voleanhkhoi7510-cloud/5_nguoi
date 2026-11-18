import { useEffect, useRef, useState } from 'react'
import { Trash2 } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import { btnDanger, btnSecondary } from '../../components/ui/styles'
import PhotoLightbox from './PhotoLightbox'
import PhotoUploader from './PhotoUploader'
import type { Photo } from './photoData'

// Component dùng lại được: khung tải ảnh lên và lưới ảnh. Ảnh chỉ nằm trong bộ nhớ của trang.
// Khi có backend, thay addFiles và removePhoto bằng lời gọi API tải lên và xóa ảnh.
export default function PhotoGallery({ initialPhotos = [] }: { initialPhotos?: Photo[] }) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<Photo | null>(null)

  // Giải phóng bộ nhớ của ảnh vừa tải lên khi rời trang
  const photosRef = useRef(photos)
  photosRef.current = photos
  useEffect(() => {
    return () => {
      photosRef.current.forEach((p) => {
        if (p.url.startsWith('blob:')) URL.revokeObjectURL(p.url)
      })
    }
  }, [])

  function addFiles(files: File[]) {
    const added: Photo[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
    }))
    setPhotos((ps) => [...added, ...ps]) // ảnh mới lên đầu
  }

  function removePhoto(photo: Photo) {
    if (photo.url.startsWith('blob:')) URL.revokeObjectURL(photo.url)
    setPhotos((ps) => ps.filter((p) => p.id !== photo.id))
    setDeleting(null)
  }

  return (
    <div>
      <PhotoUploader onAdd={addFiles} />

      <p className="mb-3 mt-6 text-sm text-slate-500">{photos.length} ảnh</p>

      {photos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          Chưa có ảnh nào. Kéo ảnh vào khung phía trên hoặc bấm “Chọn ảnh”.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p, i) => (
            <li key={p.id} className="group relative">
              <button
                onClick={() => setOpenIndex(i)}
                className="block w-full overflow-hidden rounded-lg bg-slate-100"
                aria-label={`Xem ảnh ${p.name}`}
              >
                <img
                  src={p.url}
                  alt={p.name}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform group-hover:scale-105 motion-reduce:transition-none"
                />
              </button>
              <p className="mt-1.5 truncate text-sm text-slate-600">{p.name}</p>
              <button
                onClick={() => setDeleting(p)}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-slate-700 shadow hover:text-red-600 focus:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label={`Xóa ảnh ${p.name}`}
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {openIndex !== null && (
        <PhotoLightbox photos={photos} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}

      {deleting && (
        <Modal title="Xác nhận xóa" onClose={() => setDeleting(null)}>
          <p className="text-sm text-slate-600">Xóa ảnh “{deleting.name}”?</p>
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => setDeleting(null)} className={btnSecondary}>Hủy</button>
            <button onClick={() => removePhoto(deleting)} className={btnDanger}>Xóa</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
