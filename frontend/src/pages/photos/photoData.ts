export interface Photo {
  id: string
  name: string
  url: string
  size?: number
}

export function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`
}

// Ảnh mẫu vẽ bằng SVG để trang có ảnh ngay khi mở, thay bằng ảnh từ API khi có backend
function placeholder(label: string, from: string, to: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/>` +
    `<stop offset="1" stop-color="${to}"/></linearGradient></defs>` +
    `<rect width="800" height="600" fill="url(#g)"/>` +
    `<text x="400" y="310" font-family="sans-serif" font-size="40" fill="white" text-anchor="middle">${label}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const samplePhotos: Photo[] = [
  { id: 's1', name: 'Họp mặt đầu năm 2026 (1)', url: placeholder('Họp mặt đầu năm 2026', '#1e3a8a', '#3b82f6') },
  { id: 's2', name: 'Họp mặt đầu năm 2026 (2)', url: placeholder('Bữa cơm đoàn viên', '#14532d', '#16a34a') },
  { id: 's3', name: 'Giỗ cụ Lê Văn Thành', url: placeholder('Giỗ cụ Lê Văn Thành', '#4c1d95', '#8b5cf6') },
  { id: 's4', name: 'Ngôi nhà thờ họ', url: placeholder('Ngôi nhà thờ họ', '#881337', '#e11d48') },
]
