import { useState } from 'react'
import { ShieldCheck, Lock, Key, Download, UserPlus, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'

export default function SecurityPage() {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Privacy toggles
  const [privacyPublicTree, setPrivacyPublicTree] = useState(false)
  const [requireApproval, setRequireApproval] = useState(true)
  const [hidePhoneFromGuests, setHidePhoneFromGuests] = useState(true)

  const showSuccess = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPw || !newPw || !confirmPw) {
      alert('Vui lòng nhập đầy đủ các trường mật khẩu.')
      return
    }
    if (newPw !== confirmPw) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp.')
      return
    }
    showSuccess('Đã đổi mật khẩu tài khoản thành công!')
    setCurrentPw('')
    setNewPw('')
    setConfirmPw('')
  }

  const handleExportBackup = (type: 'sql' | 'json') => {
    showSuccess(`Đã tạo bản sao lưu dữ liệu (${type.toUpperCase()}) thành công! Tệp tin đang được tải về...`)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bảo mật & Quyền riêng tư gia tộc</h1>
        <p className="text-sm text-slate-500">Quản lý an toàn dữ liệu phả hệ, quyền truy cập và bảo vệ thông tin các thành viên.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column: Password and Access control */}
        <div className="space-y-6">
          {/* Change Password Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-base pb-3 border-b border-slate-100">
              <Key size={18} className="text-indigo-600" />
              <span>Đổi mật khẩu tài khoản</span>
            </div>

            <form onSubmit={handleUpdatePassword} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Mật khẩu hiện tại</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Mật khẩu mới</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="Tối thiểu 8 ký tự"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
              >
                Cập nhật mật khẩu
              </button>
            </form>
          </div>

          {/* Backup & Export */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-base pb-3 border-b border-slate-100">
              <Download size={18} className="text-emerald-600" />
              <span>Sao lưu & Xuất dữ liệu</span>
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Tải toàn bộ cơ sở dữ liệu phả hệ, thông tin thành viên và quan hệ họ hàng về máy tính để lưu trữ an toàn dài lâu.
            </p>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => handleExportBackup('sql')}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                <Download size={14} />
                <span>Xuất tệp SQL (seed.sql)</span>
              </button>
              <button
                type="button"
                onClick={() => handleExportBackup('json')}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                <Download size={14} />
                <span>Xuất JSON Phả hệ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Family Privacy Rules */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-base pb-3 border-b border-slate-100">
              <ShieldCheck size={18} className="text-amber-600" />
              <span>Quyền riêng tư phả hệ</span>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              <div className="flex items-start justify-between py-3.5 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-900">Ẩn thông tin liên lạc với khách</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Số điện thoại và email cá nhân chỉ hiển thị cho thành viên đã xác thực trong gia đình.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={hidePhoneFromGuests}
                  onChange={(e) => {
                    setHidePhoneFromGuests(e.target.checked)
                    showSuccess('Đã cập nhật cài đặt bảo mật!')
                  }}
                  aria-label="Ẩn thông tin liên lạc với khách"
                  className="h-4 w-4 rounded text-indigo-600 mt-1 cursor-pointer"
                />
              </div>

              <div className="flex items-start justify-between py-3.5 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-900">Phê duyệt thành viên mới</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Khi có người đăng ký tài khoản tự nhận là con cháu dòng họ, quản trị viên chi họ phải duyệt trước khi xem cây phả hệ.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={requireApproval}
                  onChange={(e) => {
                    setRequireApproval(e.target.checked)
                    showSuccess('Đã cập nhật cài đặt bảo mật!')
                  }}
                  aria-label="Phê duyệt thành viên mới"
                  className="h-4 w-4 rounded text-indigo-600 mt-1 cursor-pointer"
                />
              </div>

              <div className="flex items-start justify-between py-3.5 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-900">Công khai Cây gia phả ra bên ngoài</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Cho phép chia sẻ liên kết xem cây gia phả chỉ đọc cho người họ hàng không đăng nhập.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={privacyPublicTree}
                  onChange={(e) => {
                    setPrivacyPublicTree(e.target.checked)
                    showSuccess('Đã cập nhật cài đặt bảo mật!')
                  }}
                  aria-label="Công khai Cây gia phả ra bên ngoài"
                  className="h-4 w-4 rounded text-indigo-600 mt-1 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Current Role Info */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6">
            <h3 className="text-sm font-bold text-indigo-950">Vai trò của bạn: Quản trị viên (Admin)</h3>
            <p className="text-xs text-indigo-900/80 mt-1 leading-relaxed">
              Bạn có toàn quyền thêm, sửa, xóa thành viên, cập nhật quan hệ gia phả và quản lý các sự kiện của dòng tộc.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-indigo-800 font-medium">
              <AlertCircle size={14} />
              <span>Tài khoản liên kết: long.nguyen@example.com (Lê Văn Minh / m09)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
