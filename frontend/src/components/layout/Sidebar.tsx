import { NavLink } from 'react-router-dom'
import { X, HeartHandshake } from 'lucide-react'
import { navItems } from '../../config/nav'

interface Props {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-300 transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-sm text-sm">
              FC
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-wide">FamilyConnect</span>
              <span className="block text-[10px] text-indigo-400 font-medium">Gia tộc Lê Văn</span>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1 hover:bg-slate-800 lg:hidden" aria-label="Đóng menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3" aria-label="Menu chính">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-indigo-600 font-semibold text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Clan Badge */}
        <div className="p-4 border-t border-slate-800">
          <div className="rounded-xl bg-slate-800/60 p-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <HeartHandshake size={15} />
              <span>Gia đình Sum Vầy</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              4 thế hệ • 16 thành viên gia phả
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
