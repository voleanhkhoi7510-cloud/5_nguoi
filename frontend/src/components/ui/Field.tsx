import type { ReactNode } from 'react'

interface Props {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}

// Nhãn + ô nhập + dòng báo lỗi. Ô nhập đặt aria-describedby={`${htmlFor}-error`}
export default function Field({ label, htmlFor, error, children }: Props) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
