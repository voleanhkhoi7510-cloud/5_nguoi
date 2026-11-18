# FamilyConnect - Nền Tảng Kết Nối & Quản Lý Phả Hệ Gia Tộc

Dự án Frontend hoàn chỉnh đã được gộp lại từ tất cả các gói phân tán (`familyconnect-frontend`, `familyconnect-web`, `SCRUM-25-26`, `SCRUM-32-35`) và hoàn thiện đầy đủ 100% các chức năng, giao diện, định tuyến và kiểm thử TypeScript.

---

## 🚀 Cách Chạy Ứng Dụng Nhanh

### Cách 1: Windows (Đơn giản nhất)
- Bấm đúp chuột vào tệp tin **`chay-windows.bat`**.
- Hệ thống sẽ tự kiểm tra môi trường và khởi động giao diện tại `http://localhost:5173`.

### Cách 2: Bằng dòng lệnh (Terminal / PowerShell / CMD)
```bash
# 1. Di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt thư viện (nếu chưa cài)
npm install

# 3. Khởi chạy máy chủ phát triển
npm run dev
```

### Cách 3: Kiểm tra Build dự án cho Production
```bash
npm run build
```

---

## 🌟 Tổng Hợp Các Chức Năng Đã Hoàn Thiện

| Tuyến Đường (Route) | Chức Năng | Chi Tiết Thực Hiện |
| :--- | :--- | :--- |
| **`/`** | **Tổng quan (Dashboard)** | Thống kê số lượng thành viên, thế hệ, sự kiện sắp tới, bài đăng bảng tin nổi bật, kho ảnh preview và các lối tắt thao tác nhanh. |
| **`/gia-dinh`** | **Gia đình & Thành viên** | Danh sách các hộ gia đình/nhánh họ, thêm/sửa/xóa hộ gia đình, quản lý thành viên, tìm kiếm theo tên. |
| **`/gia-pha`** | **Cây Gia Phả Tương Tác** | Hiển thị đồ họa cây gia phả 4 thế hệ, kéo rê (pan), thu phóng (zoom in/out/reset), bấm vào từng người để xem chi tiết và highlight quan hệ cha mẹ, vợ chồng, con cái. |
| **`/quan-he`** | **Quản lý Quan hệ Họ Hàng** | Thêm mới quan hệ phụ huynh - con cái, vợ - chồng; kiểm tra ràng buộc logic phả hệ để tránh quan hệ mâu thuẫn. |
| **`/cong-dong`** | **Bảng Tin Gia Tộc** | Mạng xã hội nội bộ: khung đăng bài viết mới kèm chủ đề, tương tác Thả tim (Like/Unlike), xem và gửi Bình luận thời gian thực, Chia sẻ liên kết bài viết, Lưu bài viết yêu thích. |
| **`/su-kien`** | **Sự Kiện & Ngày Giỗ** | Danh sách sự kiện gia đình (ngày giỗ tổ, tiệc sinh nhật, họp họ), chi tiết địa điểm, thời gian, cơ chế đăng ký tham gia (RSVP: Tham dự / Có thể / Không tham dự). |
| **`/anh`** | **Kho Ảnh Kỷ Niệm** | Album ảnh gia đình, lưới hiển thị ảnh sắc nét, trình xem phóng to toàn màn hình (Lightbox) chuyển ảnh trước/sau, công cụ tải ảnh mới lên. |
| **`/danh-ba`** | **Danh Bạ Liên Lạc** | Tra cứu thông tin danh bạ thế hệ F1 -> F4: số điện thoại gọi nhanh, email, nơi ở, nghề nghiệp; tìm kiếm và lọc theo thế hệ/thành phố. |
| **`/di-san`** | **Di Sản & Truyền Thống** | 5 điều Gia huấn dòng họ Lê, biên niên sử các mốc thời gian lớn, thông tin Nhà thờ tổ tại Hà Tĩnh và Quỹ khuyến học. |
| **`/tro-ly-ai`** | **Trợ Lý AI Gia Đình** | Chatbot AI thông minh trả lời cách xưng hô theo phả hệ truyền thống, gợi ý lễ vật cúng giỗ, lời chúc thọ và văn hóa gia đình. |
| **`/bao-mat`** | **Bảo Mật & Riêng Tư** | Đổi mật khẩu tài khoản, thiết lập ẩn thông tin số điện thoại với khách, cơ chế phê duyệt thành viên mới, nút xuất dữ liệu sao lưu SQL (`seed.sql`) và JSON. |
| **`/dang-nhap`** | **Đăng Nhập** | Form đăng nhập tài khoản thành viên với kiểm tra định dạng email và mật khẩu. |
| **`/dang-ky`** | **Đăng Ký** | Form đăng ký thành viên mới gia nhập dòng họ. |

---

## 📁 Cấu Trúc Thư Mục Chuẩn Hóa

```text
frontend/
├── index.html                   # HTML gốc chuẩn tiếng Việt với favicon
├── chay-windows.bat             # File thực thi chạy nhanh trên Windows
├── package.json                 # Khai báo dependencies & scripts
├── tsconfig.json                # Cấu hình TypeScript nghiêm ngặt
├── vite.config.ts               # Cấu hình Vite & Tailwind plugin
├── postcss.config.js            # PostCSS
├── tailwind.config.js           # Cấu hình Tailwind CSS
├── public/                      # Tài nguyên tĩnh
│   ├── favicon.svg              # Favicon FamilyConnect
│   └── icons.svg                # Bộ icons SVG
└── src/
    ├── main.tsx                 # Điểm khởi đầu React 19 + BrowserRouter
    ├── App.tsx                  # Thiết lập định tuyến Routes & Layout
    ├── index.css                # CSS toàn cục Tailwind
    ├── seed.sql                 # Kịch bản cơ sở dữ liệu và dữ liệu mẫu SQL
    ├── assets/                  # Hình ảnh minh họa (hero.png, v.v.)
    ├── components/
    │   ├── layout/
    │   │   ├── AppLayout.tsx    # Khung giao diện chính
    │   │   ├── Sidebar.tsx      # Thanh điều hướng trái đầy đủ 11 mục
    │   │   └── Topbar.tsx       # Thanh tiêu đề, thông báo, avatar tài khoản
    │   └── ui/
    │       ├── Field.tsx        # Thành phần Form Field tái sử dụng
    │       ├── Modal.tsx        # Thành phần Modal hộp thoại
    │       └── styles.ts        # Style nút bấm, ô nhập liệu chuẩn
    ├── config/
    │   └── nav.ts               # Cấu hình danh mục thanh menu chính
    └── pages/
        ├── auth/                # Trang Đăng nhập & Đăng ký
        ├── dashboard/           # Trang Tổng quan
        ├── family/              # Trang Quản lý Hộ gia đình
        ├── genealogy/           # Trang Cây Gia Phả & Quản lý Quan hệ
        ├── community/           # Trang Bảng Tin & Mạng xã hội gia đình
        ├── events/              # Trang Sự Kiện & Lễ Giỗ
        ├── photos/              # Trang Kho Ảnh Kỷ Niệm
        ├── directory/           # Trang Danh Bạ Thành Viên
        ├── heritage/            # Trang Di Sản & Gia Huấn
        ├── ai/                  # Trang Trợ Lý AI Phả Hệ
        └── security/            # Trang Bảo Mật & Xuất Dữ Liệu
```

---

## 🛠️ Công Nghệ Sử Dụng
- **React 19** + **TypeScript 5.9**
- **Vite 7** siêu nhanh
- **React Router 7**
- **Tailwind CSS 3.4**
- **Lucide React** (Bộ biểu tượng đồng bộ)
- Cây gia phả thuật toán bố cục tương tác thông minh (hỗ trợ Pan/Zoom mượt mà không giật lag).
