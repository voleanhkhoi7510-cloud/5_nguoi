import {
  LayoutDashboard, House, Network, MessagesSquare, CalendarDays,
  Users, Archive, Sparkles, ShieldCheck, Link2, Images,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

// Muốn thêm trang mới: thêm một dòng vào đây
export const navItems: NavItem[] = [
  { to: '/', label: 'Tổng quan', icon: LayoutDashboard },
  { to: '/gia-dinh', label: 'Gia đình', icon: House },
  { to: '/gia-pha', label: 'Gia phả', icon: Network },
  { to: '/quan-he', label: 'Quan hệ', icon: Link2 },
  { to: '/cong-dong', label: 'Cộng đồng', icon: MessagesSquare },
  { to: '/su-kien', label: 'Sự kiện', icon: CalendarDays },
  { to: '/anh', label: 'Ảnh', icon: Images },
  { to: '/danh-ba', label: 'Danh bạ', icon: Users },
  { to: '/di-san', label: 'Di sản', icon: Archive },
  { to: '/tro-ly-ai', label: 'Trợ lý AI', icon: Sparkles },
  { to: '/quan-tri', label: 'Quản trị', icon: ShieldCheck },
]
