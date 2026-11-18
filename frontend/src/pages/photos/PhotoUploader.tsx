import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { ImagePlus } from 'lucide-react'
import { btnPrimary } from '../../components/ui/styles'
import { formatSize } from './photoData'

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// Kiểm tra ở trình duyệt chỉ để báo lỗi sớm. Backend vẫn phải kiểm tra lại loại tệp và dung lượng.
export default function PhotoUploader({ onAdd }: { onAdd: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  function handle(list: FileList | null) {
    if (!list || list.length === 0) return
    const accepted: File[] = []
    const problems: string[] = []
    for (const file of Array.from(list)) {
      if (!ALLOWED.includes(file.type)) problems.push(`“${file.name}”: chỉ nhận ảnh JPG, PNG, WebP hoặc GIF.`)
      else if (file.size > MAX_SIZE) problems.push(`“${file.name}”: ảnh nặng ${formatSize(file.size)}, vượt quá 5 MB.`)
      else accepted.push(file)
    }
    setErrors(problems)
    if (accepted.length > 0) onAdd(accepted)
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    handle(e.dataTransfer.files)
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    handle(e.target.files)
    e.target.value = '' // cho phép chọn lại đúng tệp vừa chọn
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 text-center ${
          dragging ? 'border-slate-900 bg-slate-50' : 'border-slate-300 bg-white'
        }`}
      >
        <ImagePlus size={28} className="text-slate-400" />
        <p className="text-sm text-slate-600">Kéo ảnh vào đây hoặc</p>
        <button type="button" onClick={() => inputRef.current?.click()} className={btnPrimary}>
          Chọn ảnh
        </button>
        <p className="text-xs text-slate-500">JPG, PNG, WebP hoặc GIF, tối đa 5 MB mỗi ảnh. Chọn được nhiều ảnh cùng lúc.</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={onChange}
        />
      </div>

      {errors.length > 0 && (
        <ul role="alert" className="mt-3 space-y-1 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
