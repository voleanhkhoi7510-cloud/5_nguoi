import { useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { Menu, Bell, User, LogOut, Shield, ChevronDown, Check } from 'lucide-react'
import { navItems } from '../../config/nav'

export default function Topbar({ onMenu }: { onMenu: () => void }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const title = navItems.find((item) => item.to === pathname)?.label ?? 'FamilyConnect'

  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)

  const notifications = [
    { id: 1, title: 'Ngày giỗ cụ Lê Văn Thành', desc: 'Ngày 20/11 âm lịch tại nhà thờ tổ Hà Tĩnh', time: '1 giờ trước', unread: true },
    { id: 2, title: 'Mẹ Yêu vừa đăng bài viết', desc: 'Cuối tuần này cả nhà mình tập trung ăn lẩu thái...', time: '2 giờ trước', unread: true },
    { id: 3, title: 'Ảnh kỷ niệm mới', desc: '3 bức ảnh họp mặt chi họ vừa được tải lên', time: 'Hôm qua', unread: true },
  ]

  const handleMarkRead = () => {
    setUnreadCount(0)
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Mở menu"
        >
          <Menu size={20} />
        </button>
        <span className="font-semibold text-slate-900 text-base sm:text-lg">{title}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowUserMenu(false)
            }}
            className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 transition"
            aria-label="Thông báo"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-30">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-semibold text-slate-900 text-sm">Thông báo gia tộc</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkRead}
                    className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                  >
                    <Check size={14} /> Đánh dấu đã đọc
                  </button>
                )}
              </div>

              <div className="mt-3 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-slate-600">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2 rounded-xl border border-slate-200 p-1.5 sm:px-3 sm:py-1.5 hover:bg-slate-50 transition"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-bold text-white text-xs shadow-xs">
              M
            </div>
            <div className="hidden sm:block text-left text-xs">
              <p className="font-semibold text-slate-900 leading-tight">Lê Văn Minh</p>
              <p className="text-[11px] text-slate-400">Admin</p>
            </div>
            <ChevronDown size={14} className="hidden sm:block text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-30 text-xs">
              <div className="p-2 border-b border-slate-100">
                <p className="font-bold text-slate-900">Lê Văn Minh</p>
                <p className="text-slate-400 text-[11px]">Kỹ sư phần mềm (m09)</p>
              </div>

              <div className="py-1">
                <Link
                  to="/bao-mat"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50"
                >
                  <Shield size={15} className="text-slate-500" />
                  <span>Cài đặt bảo mật</span>
                </Link>
                <Link
                  to="/dang-nhap"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50"
                >
                  <User size={15} className="text-slate-500" />
                  <span>Chuyển tài khoản</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    navigate('/dang-nhap')
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-rose-600 hover:bg-rose-50 font-medium"
                >
                  <LogOut size={15} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
