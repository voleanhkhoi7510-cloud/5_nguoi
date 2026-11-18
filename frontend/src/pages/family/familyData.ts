export interface Member {
  id: string
  name: string
  gender: 'Nam' | 'Nữ'
  birthYear: number
  deathYear?: number
  job: string
  city: string
}

export interface Family {
  id: string
  name: string
  address: string
  members: Member[]
}

// Dữ liệu mẫu (dữ liệu giả), sẽ thay bằng dữ liệu từ API khi có backend
export const initialFamilies: Family[] = [
  {
    id: 'f1', name: 'Gia đình ông Lê Văn Hùng', address: 'Hà Nội',
    members: [
      { id: 'm03', name: 'Lê Văn Hùng', gender: 'Nam', birthYear: 1958, job: 'Giáo viên (đã nghỉ hưu)', city: 'Hà Nội' },
      { id: 'm06', name: 'Trần Thị Hoa', gender: 'Nữ', birthYear: 1960, job: 'Kế toán', city: 'Hà Nội' },
      { id: 'm10', name: 'Lê Thị Ngọc', gender: 'Nữ', birthYear: 1988, job: 'Giáo viên', city: 'Hà Nội' },
    ],
  },
  {
    id: 'f2', name: 'Gia đình anh Lê Văn Minh', address: 'TP.HCM',
    members: [
      { id: 'm09', name: 'Lê Văn Minh', gender: 'Nam', birthYear: 1985, job: 'Kỹ sư phần mềm', city: 'TP.HCM' },
      { id: 'm14', name: 'Đặng Thị Hà', gender: 'Nữ', birthYear: 1986, job: 'Nhân viên ngân hàng', city: 'TP.HCM' },
      { id: 'm15', name: 'Lê Gia Bảo', gender: 'Nam', birthYear: 2015, job: 'Học sinh', city: 'TP.HCM' },
      { id: 'm16', name: 'Lê Minh Châu', gender: 'Nữ', birthYear: 2019, job: '', city: 'TP.HCM' },
    ],
  },
  {
    id: 'f3', name: 'Gia đình ông Lê Văn Đức', address: 'TP.HCM',
    members: [
      { id: 'm05', name: 'Lê Văn Đức', gender: 'Nam', birthYear: 1964, job: 'Kỹ sư xây dựng', city: 'TP.HCM' },
      { id: 'm08', name: 'Võ Thị Thu', gender: 'Nữ', birthYear: 1966, job: 'Dược sĩ', city: 'TP.HCM' },
      { id: 'm12', name: 'Lê Văn Khoa', gender: 'Nam', birthYear: 1991, job: 'Bác sĩ', city: 'TP.HCM' },
      { id: 'm13', name: 'Lê Thị Thảo', gender: 'Nữ', birthYear: 1994, job: 'Học viên cao học', city: 'Melbourne (Úc)' },
    ],
  },
  {
    id: 'f4', name: 'Gia đình ông Phạm Văn Nam', address: 'Đà Nẵng',
    members: [
      { id: 'm07', name: 'Phạm Văn Nam', gender: 'Nam', birthYear: 1959, job: 'Bác sĩ', city: 'Đà Nẵng' },
      { id: 'm04', name: 'Lê Thị Mai', gender: 'Nữ', birthYear: 1961, job: 'Y tá', city: 'Đà Nẵng' },
      { id: 'm11', name: 'Phạm Thị Lan Anh', gender: 'Nữ', birthYear: 1990, job: 'Kiến trúc sư', city: 'Đà Nẵng' },
    ],
  },
  {
    id: 'f5', name: 'Gia đình cụ Lê Văn Thành', address: 'Hà Tĩnh',
    members: [
      { id: 'm01', name: 'Lê Văn Thành', gender: 'Nam', birthYear: 1932, deathYear: 2015, job: 'Nông dân', city: 'Hà Tĩnh' },
      { id: 'm02', name: 'Nguyễn Thị Lan', gender: 'Nữ', birthYear: 1935, deathYear: 2020, job: 'Nội trợ', city: 'Hà Tĩnh' },
    ],
  },
]
