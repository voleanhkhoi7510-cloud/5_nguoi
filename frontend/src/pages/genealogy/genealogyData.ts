export interface Person {
  id: string
  name: string
  gender: 'Nam' | 'Nữ'
  birthYear: number
  deathYear?: number
  job?: string
  city?: string
}

export type RelationType = 'parent' | 'spouse'

// type 'parent': fromId là cha hoặc mẹ của toId
// type 'spouse': fromId và toId là vợ chồng (thứ tự không quan trọng), year là năm kết hôn
export interface Relation {
  id: string
  type: RelationType
  fromId: string
  toId: string
  year?: number
}

export const lifeSpan = (p: Person) => (p.deathYear ? `${p.birthYear} – ${p.deathYear}` : `${p.birthYear}`)

// Dữ liệu mẫu (dữ liệu giả), sẽ thay bằng dữ liệu từ API khi có backend
export const initialPersons: Person[] = [
  { id: 'm01', name: 'Lê Văn Thành', gender: 'Nam', birthYear: 1932, deathYear: 2015, job: 'Nông dân', city: 'Hà Tĩnh' },
  { id: 'm02', name: 'Nguyễn Thị Lan', gender: 'Nữ', birthYear: 1935, deathYear: 2020, job: 'Nội trợ', city: 'Hà Tĩnh' },
  { id: 'm03', name: 'Lê Văn Hùng', gender: 'Nam', birthYear: 1958, job: 'Giáo viên (đã nghỉ hưu)', city: 'Hà Nội' },
  { id: 'm04', name: 'Lê Thị Mai', gender: 'Nữ', birthYear: 1961, job: 'Y tá', city: 'Đà Nẵng' },
  { id: 'm05', name: 'Lê Văn Đức', gender: 'Nam', birthYear: 1964, job: 'Kỹ sư xây dựng', city: 'TP.HCM' },
  { id: 'm06', name: 'Trần Thị Hoa', gender: 'Nữ', birthYear: 1960, job: 'Kế toán', city: 'Hà Nội' },
  { id: 'm07', name: 'Phạm Văn Nam', gender: 'Nam', birthYear: 1959, job: 'Bác sĩ', city: 'Đà Nẵng' },
  { id: 'm08', name: 'Võ Thị Thu', gender: 'Nữ', birthYear: 1966, job: 'Dược sĩ', city: 'TP.HCM' },
  { id: 'm09', name: 'Lê Văn Minh', gender: 'Nam', birthYear: 1985, job: 'Kỹ sư phần mềm', city: 'TP.HCM' },
  { id: 'm10', name: 'Lê Thị Ngọc', gender: 'Nữ', birthYear: 1988, job: 'Giáo viên', city: 'Hà Nội' },
  { id: 'm11', name: 'Phạm Thị Lan Anh', gender: 'Nữ', birthYear: 1990, job: 'Kiến trúc sư', city: 'Đà Nẵng' },
  { id: 'm12', name: 'Lê Văn Khoa', gender: 'Nam', birthYear: 1991, job: 'Bác sĩ', city: 'TP.HCM' },
  { id: 'm13', name: 'Lê Thị Thảo', gender: 'Nữ', birthYear: 1994, job: 'Học viên cao học', city: 'Melbourne (Úc)' },
  { id: 'm14', name: 'Đặng Thị Hà', gender: 'Nữ', birthYear: 1986, job: 'Nhân viên ngân hàng', city: 'TP.HCM' },
  { id: 'm15', name: 'Lê Gia Bảo', gender: 'Nam', birthYear: 2015, job: 'Học sinh', city: 'TP.HCM' },
  { id: 'm16', name: 'Lê Minh Châu', gender: 'Nữ', birthYear: 2019, city: 'TP.HCM' },
]

const parentLinks: [string, string[]][] = [
  ['m01', ['m03', 'm04', 'm05']], ['m02', ['m03', 'm04', 'm05']],
  ['m03', ['m09', 'm10']], ['m06', ['m09', 'm10']],
  ['m04', ['m11']], ['m07', ['m11']],
  ['m05', ['m12', 'm13']], ['m08', ['m12', 'm13']],
  ['m09', ['m15', 'm16']], ['m14', ['m15', 'm16']],
]
const marriages: [string, string, number][] = [
  ['m01', 'm02', 1955], ['m03', 'm06', 1983], ['m04', 'm07', 1987], ['m05', 'm08', 1988], ['m09', 'm14', 2012],
]

let n = 0
export const initialRelations: Relation[] = [
  ...parentLinks.flatMap(([p, kids]) =>
    kids.map((k) => ({ id: `r${++n}`, type: 'parent' as const, fromId: p, toId: k })),
  ),
  ...marriages.map(([a, b, year]) => ({ id: `r${++n}`, type: 'spouse' as const, fromId: a, toId: b, year })),
]
