import type { ReactNode } from 'react'

interface Props {
  title: string
  subtitle: string
  children: ReactNode
}

// Khung chung cho trang đăng nhập và đăng ký (không có sidebar)
export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-slate-900 p-12 text-slate-300 lg:flex">
        <span className="text-lg font-semibold text-white">FamilyConnect</span>
        <p className="max-w-sm text-3xl font-semibold leading-snug text-white">
          Giữ gìn cội nguồn, kết nối các thế hệ trong gia đình.
        </p>
        <span className="text-sm">Nền tảng cộng đồng gia đình số</span>
      </aside>

      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <span className="mb-8 block text-lg font-semibold text-slate-900 lg:hidden">FamilyConnect</span>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
