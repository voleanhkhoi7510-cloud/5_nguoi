import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import Field from '../../components/ui/Field'
import { inputClass, btnPrimary } from '../../components/ui/styles'

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface Errors {
  name?: string
  email?: string
  password?: string
  confirm?: string
}

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next: Errors = {}
    if (!name.trim()) next.name = 'Vui lòng nhập họ và tên.'
    if (!email.trim()) next.email = 'Vui lòng nhập email.'
    else if (!emailRe.test(email.trim())) next.email = 'Email chưa đúng định dạng, ví dụ: ten@email.com.'
    if (!password) next.password = 'Vui lòng nhập mật khẩu.'
    else if (password.length < 8) next.password = 'Mật khẩu cần có ít nhất 8 ký tự.'
    if (!confirm) next.confirm = 'Vui lòng nhập lại mật khẩu.'
    else if (confirm !== password) next.confirm = 'Mật khẩu nhập lại chưa khớp.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    // TODO: gọi API đăng ký khi backend sẵn sàng. Tạm thời chuyển sang trang đăng nhập.
    navigate('/dang-nhap')
  }

  return (
    <AuthLayout title="Tạo tài khoản" subtitle="Tham gia cộng đồng gia đình của bạn.">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Field label="Họ và tên" htmlFor="name" error={errors.name}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby="name-error"
            className={inputClass}
          />
        </Field>

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
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password}
            aria-describedby="password-error"
            placeholder="Ít nhất 8 ký tự"
            className={inputClass}
          />
        </Field>

        <Field label="Nhập lại mật khẩu" htmlFor="confirm" error={errors.confirm}>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={!!errors.confirm}
            aria-describedby="confirm-error"
            className={inputClass}
          />
        </Field>

        <button type="submit" className={`${btnPrimary} w-full`}>
          Tạo tài khoản
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Đã có tài khoản?{' '}
        <Link to="/dang-nhap" className="font-medium text-slate-900 underline">
          Đăng nhập
        </Link>
      </p>
    </AuthLayout>
  )
}
