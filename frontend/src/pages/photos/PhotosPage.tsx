import PhotoGallery from './PhotoGallery'
import { samplePhotos } from './photoData'

export default function PhotosPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Thư viện ảnh</h1>
      <p className="mt-1 text-sm text-slate-500">Tải ảnh của gia đình lên và xem lại tại đây.</p>
      <div className="mt-6">
        <PhotoGallery initialPhotos={samplePhotos} />
      </div>
    </div>
  )
}
