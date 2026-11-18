export type Rsvp = 'yes' | 'maybe' | 'no' | 'pending'

export interface EventItem {
  id: string
  title: string
  date: string // yyyy-mm-dd
  time: string // HH:mm, có thể để trống
  place: string
  description: string
  rsvp: Record<string, Rsvp> // khóa là id người được mời
}

export const rsvpLabels: Record<Rsvp, string> = {
  yes: 'Tham dự',
  maybe: 'Có thể',
  no: 'Không tham dự',
  pending: 'Chưa trả lời',
}

// Người đang đăng nhập. Tạm cố định là anh Lê Văn Minh, sẽ lấy từ tài khoản khi có backend.
export const CURRENT_USER_ID = 'm09'

// Danh sách người được mời (dữ liệu giả)
export const invitees = [
  { id: 'm03', name: 'Lê Văn Hùng' },
  { id: 'm06', name: 'Trần Thị Hoa' },
  { id: 'm04', name: 'Lê Thị Mai' },
  { id: 'm07', name: 'Phạm Văn Nam' },
  { id: 'm05', name: 'Lê Văn Đức' },
  { id: 'm08', name: 'Võ Thị Thu' },
  { id: 'm09', name: 'Lê Văn Minh' },
  { id: 'm14', name: 'Đặng Thị Hà' },
  { id: 'm10', name: 'Lê Thị Ngọc' },
  { id: 'm12', name: 'Lê Văn Khoa' },
  { id: 'm13', name: 'Lê Thị Thảo' },
  { id: 'm11', name: 'Phạm Thị Lan Anh' },
]

const pad = (n: number) => String(n).padStart(2, '0')
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const todayIso = () => toIso(new Date())
const daysFromNow = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return toIso(d)
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export const allPending = (): Record<string, Rsvp> =>
  Object.fromEntries(invitees.map((p) => [p.id, 'pending' as Rsvp]))

export function countRsvp(event: EventItem): Record<Rsvp, number> {
  const counts: Record<Rsvp, number> = { yes: 0, maybe: 0, no: 0, pending: 0 }
  for (const p of invitees) counts[event.rsvp[p.id] ?? 'pending']++
  return counts
}

// Hai sự kiện sắp tới tính ngày theo hôm nay để luôn còn sự kiện mở đăng ký khi demo
export const initialEvents: EventItem[] = [
  {
    id: 'e1',
    title: 'Giỗ cụ Lê Văn Thành',
    date: daysFromNow(10),
    time: '09:00',
    place: 'Nhà thờ họ, Hà Nội',
    description: 'Cả họ về dâng hương và dùng cơm thân mật. Mời các gia đình thu xếp tham dự.',
    rsvp: {
      ...allPending(),
      m03: 'yes', m06: 'yes', m04: 'yes', m07: 'yes', m05: 'yes', m08: 'yes', m09: 'yes', m14: 'yes',
      m10: 'maybe', m12: 'no', m13: 'no',
    },
  },
  {
    id: 'e2',
    title: 'Họp mặt cuối năm 2026',
    date: daysFromNow(52),
    time: '18:00',
    place: 'Nhà hàng Hương Quê, TP.HCM',
    description: 'Tổng kết một năm và chúc mừng năm mới cùng cả gia đình.',
    rsvp: allPending(),
  },
  {
    id: 'e3',
    title: 'Họp mặt đầu năm 2026',
    date: '2026-02-17',
    time: '10:00',
    place: 'Nhà anh Minh, TP.HCM',
    description: 'Buổi họp mặt đầu năm của các gia đình trong họ.',
    rsvp: {
      ...allPending(),
      m03: 'yes', m06: 'yes', m04: 'yes', m07: 'yes', m05: 'yes', m08: 'yes', m09: 'yes', m14: 'yes', m10: 'yes', m12: 'yes',
      m13: 'no',
    },
  },
]
