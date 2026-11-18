import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import AuthLayout from './AuthLayout'
import Field from '../../components/ui/Field'
import { inputClass, btnPrimary } from '../../components/ui/styles'

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface Errors {
  email?: string
  password?: string
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next: Errors = {}
    if (!email.trim()) next.email = 'Vui lòng nhập email.'
    else if (!emailRe.test(email.trim())) next.email = 'Email chưa đúng định dạng, ví dụ: ten@email.com.'
    if (!password) next.password = 'Vui lòng nhập mật khẩu.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    // TODO: gọi API đăng nhập khi backend sẵn sàng. Tạm thời chuyển về trang chủ.
    navigate('/')
  }

  return (
    <AuthLayout title="Đăng nhập" subtitle="Chào mừng bạn quay lại với gia đình.">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby="email-error"
            placeholder="ten@email.com"
            className={inputClass}
          />
        </Field>

        <Field label="Mật khẩu" htmlFor="password" error={errors.password}>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby="password-error"
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-900"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" className="size-4 rounded border-slate-300" />
          Ghi nhớ đăng nhập
        </label>

        <button type="submit" className={`${btnPrimary} w-full`}>
          Đăng nhập
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Chưa có tài khoản?{' '}
        <Link to="/dang-ky" className="font-medium text-slate-900 underline">
          Đăng ký
        </Link>
      </p>
    </AuthLayout>
  )
}
