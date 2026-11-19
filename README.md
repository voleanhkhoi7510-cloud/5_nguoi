# 🌿 FamilyConnect: AI-powered Digital Family Community Platform

> **Nền tảng Quản trị Gia phả số & Cộng đồng Dòng họ tích hợp Trí tuệ Nhân tạo**  
> Vận hành an toàn trên môi trường nội bộ (**Local-First / On-Premise**) – Bảo tồn cội nguồn, gắn kết tình thân và bảo vệ tuyệt đối dữ liệu gia tộc.

---

## 📖 Mục Lục
1. [Giới thiệu tổng quan](#-giới-thiệu-tổng-quan)
2. [Tính năng nổi bật](#-tính-năng-nổi-bật)
3. [Kiến trúc công nghệ](#-kiến-trúc-công-nghệ)
4. [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
5. [Yêu cầu môi trường](#-yêu-cầu-môi-trường)
6. [Hướng dẫn khởi động chương trình](#-hướng-dẫn-khởi-động-chương-trình)
   - [Cách 1: Khởi động 1-chạm với Batch Script (Khuyên dùng trên Windows)](#cách-1-khởi-động-1-chạm-nhanh-nhất-windows)
   - [Cách 2: Khởi động thủ công qua dòng lệnh (Manual)](#cách-2-khởi-động-thủ-công-qua-dòng-lệnh)
7. [Danh mục địa chỉ truy cập & Cổng dịch vụ](#-danh-mục-địa-chỉ-truy-cập--cổng-dịch-vụ)
8. [Tài khoản đăng nhập kiểm thử](#-tài-khoản-đăng-nhập-kiểm-thử)
9. [Chạy bộ kiểm thử tự động (Automated Testing)](#-chạy-bộ-kiểm-thử-tự-động-automated-testing)
10. [Xử lý lỗi thường gặp (Troubleshooting)](#-xử-lý-lỗi-thường-gặp-troubleshooting)

---

## 🌟 Giới thiệu tổng quan

**FamilyConnect** là giải pháp phần mềm toàn diện giúp các dòng họ và gia đình Việt Nam số hóa cây phả hệ, lưu truyền văn hóa cội nguồn và tăng cường giao lưu tương trợ giữa các thế hệ. 

Hệ thống giải quyết triệt để các hạn chế của gia phả giấy truyền thống (dễ rách hỏng, khó tra cứu) cũng như sự lỏng lẻo khi dùng mạng xã hội thông thường (thiếu tôn ti trật tự, nguy cơ rò rỉ dữ liệu riêng tư). 

---

## 🚀 Tính năng nổi bật

1. **🌳 Cây Gia Phả Tương Tác Đa Thế Hệ (Interactive Genealogy Tree):**
   - Dựng đồ thị phả hệ mượt mà bằng **React Flow**, hỗ trợ phóng to/thu nhỏ (Zoom), kéo rê (Pan), lọc theo từng chi phái.
   - Tự động phân biệt cành Trưởng, cành Thứ, hiển thị thông tin đời thứ mấy, trạng thái còn sống hay đã tạ thế.
   - Thuật toán đồ thị chống chu trình vòng lặp (Anti-Cycle DAG) đảm bảo tính toàn vẹn phả hệ.

2. **🧠 Trợ Lý Trí Tuệ Nhân Tạo Gia Tộc (Kinship AI Assistant):**
   - **Tính toán danh xưng thuần Việt:** Áp dụng thuật toán tìm đường đi ngắn nhất (BFS) và Tổ tiên chung gần nhất (LCA) để tính toán chính xác vai vế giữa 2 thành viên bất kỳ (Cụ, Ông/Bà, Bác, Chú, Cô, Cậu, Dì, Anh/Chị/Em họ, Con, Cháu, Chắt).
   - **Hỏi đáp tri thức gia đình (RAG Q&A):** Truy xuất thông tin lịch sử dòng họ, tiểu sử cụ tổ, điều răn gia quy và sự kiện.
   - **Gợi ý kết nối thông minh:** Gợi ý kết nối con cháu cùng ngành nghề, lĩnh vực để hỗ trợ học tập và hướng nghiệp.

3. **🗓️ Lịch Giỗ Chạp Âm Lịch & Điểm Danh (Events & RSVP):**
   - Quản lý ngày giỗ tổ tiên theo ngày Âm lịch, tự động tính toán ngày Dương lịch tương ứng từng năm.
   - Điểm danh và xác nhận tham dự (RSVP) kèm số lượng người đi cùng giúp ban tổ chức dự trù cỗ bàn chu đáo.
   - Phân công nhiệm vụ hiếu hỉ (nấu cỗ, hành lễ, tiếp tân) cho các chi nhánh phụ trách.

4. **📰 Bảng Tin & Chia Sẻ Khoảnh Khắc (Community & Feed):**
   - Đăng bài chia sẻ tin mừng, tin buồn, hình ảnh kỷ niệm của gia đình.
   - Thảo luận, bình luận và thả cảm xúc tôn kính (*Thích, Yêu thương, Tưởng nhớ*).
   - Ban hành thông cáo chính thức có huy hiệu của Hội đồng gia tộc.

5. **📚 Tủ Sách Di Sản Số & Văn Khấn (Digital Heritage & Archives):**
   - Lưu trữ bản scan phả ký cổ, văn bia, hương ước và sắc phong thời xưa.
   - Thư viện tuyển tập các bài văn khấn cổ truyền chuẩn mực giúp con cháu thực hành nghi lễ đúng truyền thống.

6. **🔒 An Ninh, Phân Quyền Đa Cấp & Nhật Ký Kiểm Toán (RBAC & Audit Logs):**
   - Phân quyền chặt chẽ: *Admin hệ thống, Trưởng họ, Trưởng chi, Thành viên chính thức, Khách*.
   - Ghi nhận nhật ký kiểm toán (`audit_logs`) mọi thay đổi dữ liệu gia phả để minh bạch và truy vết an toàn.

---

## 🛠️ Kiến trúc công nghệ

| Thành phần | Công nghệ sử dụng | Phiên bản |
| :--- | :--- | :--- |
| **Giao diện (Frontend)** | React, Vite, TypeScript, Tailwind CSS | React 19, Vite 7 |
| **Đồ thị Phả hệ** | React Flow (`reactflow`) | 11.11.4 |
| **Điều hướng (Routing)** | React Router DOM | 7.18.4 |
| **Biểu tượng (Icons)** | Lucide React | 1.61.0 |
| **Máy chủ API (Backend)** | Node.js (ES Modules), Express, TypeScript | Express 5.3, TypeScript 5.9 |
| **Bộ ánh xạ CSDL (ORM)** | Prisma Client & Prisma CLI | 6.19.3 |
| **Cơ sở dữ liệu (Database)** | PostgreSQL | 15 / 16 |
| **Trí tuệ nhân tạo (AI Engine)** | Module độc lập TypeScript, giải thuật BFS/LCA/RAG | Tích hợp sẵn trong `AI/` |
| **Xác thực & Bảo mật** | JSON Web Token (`jsonwebtoken`), `bcrypt` | JWT 9.0, Bcrypt 6.0 |
| **Trình chạy mã TypeScript** | `tsx` (TypeScript Execute) | 4.23.15 |

---

## 📂 Cấu trúc thư mục

```text
Family connect/
├── AI/                                # Khung dịch vụ Trí tuệ Nhân tạo độc lập
│   ├── src/
│   │   ├── relationshipGraph.ts       # Giải thuật đồ thị BFS, LCA & Xưng hô thuần Việt
│   │   ├── knowledgeRetrieval.ts      # Động cơ tìm kiếm ngữ nghĩa (Semantic Search)
│   │   ├── qaEngine.ts                # Khung hỏi đáp tri thức gia đình (RAG Q&A)
│   │   ├── recommendationService.ts   # Gợi ý kết nối nghề nghiệp & Tóm tắt văn bản
│   │   ├── dataConnector.ts           # Cầu nối dữ liệu kép (PostgreSQL + Mock Store)
│   │   └── index.ts                   # Lớp mặt tiền FamilyAIService
│   ├── tests/
│   │   └── ai.test.ts                 # Bộ 34 ca kiểm thử tự động cho AI & Phả hệ
│   └── package.json
│
├── backend/                           # Máy chủ ứng dụng RESTful API
│   ├── prisma/
│   │   └── schema.prisma              # Lược đồ cơ sở dữ liệu 17 bảng quan hệ
│   ├── src/
│   │   ├── controllers/               # Bộ điều khiển nghiệp vụ (auth, genealogy, ai, events,...)
│   │   ├── middlewares/               # Bộ lọc JWT, RBAC phân quyền, Audit logger
│   │   ├── routes/                    # Tuyến định tuyến API v1
│   │   ├── db.ts                      # Khởi tạo kết nối Prisma Client
│   │   ├── OpenAPI.yml                # Tài liệu đặc tả OpenAPI 3.0
│   │   └── server.ts                  # Điểm khởi chạy máy chủ Express Backend
│   ├── tests/                         # Bộ kiểm thử tự động RBAC và các Modules
│   │   ├── rbac.test.ts               # 14 ca test phân quyền và bảo mật
│   │   └── modules.test.ts            # 25 ca test bài viết, sự kiện, RSVP, di sản
│   ├── .env                           # Tệp biến môi trường kết nối CSDL và Port
│   └── package.json
│
├── frontend/                          # Giao diện người dùng Web Application
│   ├── src/
│   │   ├── components/layout/         # Khung giao diện AppLayout, Sidebar, Navbar
│   │   ├── pages/                     # Các màn hình chức năng:
│   │   │   ├── auth/                  # Đăng nhập (/dang-nhap), Đăng ký (/dang-ky)
│   │   │   ├── dashboard/             # Bảng điều khiển KPI & Thống kê (/)
│   │   │   ├── genealogy/             # Cây gia phả React Flow (/gia-pha, /quan-he)
│   │   │   ├── community/             # Bảng tin cộng đồng (/cong-dong)
│   │   │   ├── events/                # Lịch giỗ Âm lịch & RSVP (/su-kien)
│   │   │   ├── photos/                # Thư viện ảnh kỷ niệm (/anh)
│   │   │   ├── directory/             # Danh bạ họ tộc & Khuyến học (/danh-ba)
│   │   │   ├── heritage/              # Tủ sách phả ký số (/di-san)
│   │   │   ├── ai/                    # Khung chat AI & Tra cứu danh xưng (/tro-ly-ai)
│   │   │   └── security/              # Quản trị tài khoản & Audit logs (/bao-mat)
│   │   ├── seed.sql                   # Dữ liệu SQL mẫu ban đầu
│   │   ├── App.tsx                    # Cấu hình Router và điều hướng trang
│   │   └── main.tsx                   # Điểm nạp ứng dụng React
│   └── package.json
│
├── docs/                              # Toàn bộ tài liệu kỹ thuật & Báo cáo
│   ├── 00_cover_and_introduction.md   # Bìa và giới thiệu dự án
│   ├── product_overview.md            # Tổng quan sản phẩm & hạ tầng
│   ├── system_actors.md               # Danh mục tác nhân & ma trận quyền
│   ├── common_requirements.md         # Yêu cầu chung CR-01 đến CR-10
│   ├── configuration_management.md    # Quản lý cấu hình & quy chuẩn Git
│   ├── design/
│   │   ├── architecture/              # Kiến trúc hệ thống & luồng màn hình
│   │   └── database/                  # Thiết kế CSDL 17 bảng & Từ điển dữ liệu
│   ├── requirement/                   # Quy tắc nghiệp vụ (50 BRs), Use Cases (45 UCs), WBS
│   └── testing/                       # Kế hoạch và báo cáo 73 ca kiểm thử tự động
│
├── chay-tat-ca.bat                    # Kịch bản 1-chạm khởi động đồng thời Backend & Frontend
└── README.md                          # Tài liệu hướng dẫn sử dụng này
```

---

## 💻 Yêu cầu môi trường

Trước khi khởi động chương trình, máy tính của bạn cần được cài đặt sẵn:

1. **Node.js:** Phiên bản `>= 18.0.0` (Khuyến nghị **Node.js 20.x LTS** hoặc mới hơn).
   - Tải về tại: [https://nodejs.org](https://nodejs.org)
   - Kiểm tra bằng lệnh: `node -v` và `npm -v`
2. **PostgreSQL:** Phiên bản `>= 15.0` (Khuyến nghị **PostgreSQL 16**).
   - Tải về tại: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
   - Mặc định chạy tại cổng `5432`.

---

## 🚀 Hướng dẫn khởi động chương trình

### Cách 1: Khởi động 1-chạm nhanh nhất (Windows)

Đây là cách đơn giản và nhanh nhất dành cho hệ điều hành Windows:

1. Mở thư mục gốc của dự án: `Family connect/`.
2. **Nhấp đúp chuột (Double click)** vào tệp:
   ```text
   chay-tat-ca.bat
   ```
3. Hệ thống sẽ tự động bật **2 cửa sổ dòng lệnh riêng biệt**:
   - Cửa sổ 1: **FamilyConnect Backend** chạy tại `http://localhost:3000`.
   - Cửa sổ 2: **FamilyConnect Frontend** chạy tại `http://localhost:5173`.
4. Mở trình duyệt web bất kỳ (Chrome, Edge, Firefox) và truy cập:
   👉 **`http://localhost:5173`**

*(Để dừng chương trình, bạn chỉ cần đóng 2 cửa sổ dòng lệnh vừa được mở lên).*

---

### Cách 2: Khởi động thủ công qua dòng lệnh

Nếu bạn muốn khởi chạy từng thành phần độc lập trên Windows, macOS hoặc Linux:

#### Bước 1: Cấu hình Cơ sở dữ liệu PostgreSQL
Mở tệp `backend/.env` và điều chỉnh thông tin kết nối CSDL của bạn (nếu có thay đổi mật khẩu):
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=database
DB_USER=postgres
DB_PASSWORD=123456789

JWT_SECRET=FamilyConnect_SuperSecret_JWT_Key_2026
DATABASE_URL="postgresql://postgres:123456789@localhost:5432/familyconnect?schema=public"
```

*Ghi chú: Nếu cơ sở dữ liệu chưa có bảng, bạn có thể nạp dữ liệu mẫu nhanh bằng cách thực thi tệp `frontend/src/seed.sql` trong công cụ pgAdmin hoặc psql CLI.*

#### Bước 2: Cài đặt phụ thuộc & Tạo Prisma Client
Mở terminal tại thư mục `backend`:
```bash
cd backend
npm install
npx prisma generate
```

Mở terminal tại thư mục `frontend`:
```bash
cd frontend
npm install
```

#### Bước 3: Khởi chạy Backend API
Tại thư mục `backend`:
```bash
npm run dev
```
Khi thành công, màn hình sẽ hiển thị:
```text
🚀 FamilyConnect Server running at http://localhost:3000
📋 API v1: http://localhost:3000/api/v1
💚 Health: http://localhost:3000/api/v1/health
```

#### Bước 4: Khởi chạy Frontend Web App
Mở một cửa sổ terminal mới, chuyển đến thư mục `frontend`:
```bash
cd frontend
npm run dev
```
Khi thành công, màn hình sẽ hiển thị:
```text
  VITE v7.0.0  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Truy cập ngay: **`http://localhost:5173`**

---

## 🌐 Danh mục địa chỉ truy cập & Cổng dịch vụ

| Địa chỉ URL | Cổng (Port) | Mô tả phân hệ |
| :--- | :---: | :--- |
| **`http://localhost:5173`** | **5173** | **Cổng thông tin & Giao diện chính của FamilyConnect** |
| `http://localhost:5173/dang-nhap` | 5173 | Màn hình Đăng nhập tài khoản |
| `http://localhost:5173/dang-ky` | 5173 | Màn hình Đăng ký tài khoản người mới |
| `http://localhost:5173/` | 5173 | Bảng điều khiển (Dashboard) KPI & Thống kê nhân khẩu |
| `http://localhost:5173/gia-pha` | 5173 | Cây gia phả đồ họa tương tác (React Flow) |
| `http://localhost:5173/quan-he` | 5173 | Quản lý & Thiết lập các mối quan hệ gia phả |
| `http://localhost:5173/cong-dong` | 5173 | Bảng tin dòng họ, đăng bài, bình luận & thả cảm xúc |
| `http://localhost:5173/su-kien` | 5173 | Lịch giỗ Âm lịch, điểm danh tham dự RSVP |
| `http://localhost:5173/anh` | 5173 | Bộ sưu tập ảnh & Tư liệu kỷ niệm dòng tộc |
| `http://localhost:5173/danh-ba` | 5173 | Danh bạ người thân, kết nối nghề nghiệp & Khuyến học |
| `http://localhost:5173/di-san` | 5173 | Tủ sách di sản số, phả ký cổ & Tuyển tập văn khấn |
| `http://localhost:5173/tro-ly-ai` | 5173 | Trợ lý AI hỏi đáp phả ký & Tra cứu danh xưng thuần Việt |
| `http://localhost:5173/bao-mat` | 5173 | Quản trị tài khoản, ma trận phân quyền RBAC & Audit logs |
| **`http://localhost:3000`** | **3000** | **Backend API Server (Express RESTful API)** |
| `http://localhost:3000/api/v1/health` | 3000 | Kiểm tra trạng thái máy chủ & Kết nối PostgreSQL |

---

## 🔑 Tài khoản đăng nhập kiểm thử

Hệ thống được thiết lập sẵn các tài khoản kiểm thử đại diện cho các vai trò khác nhau trong dòng họ:

| Vai trò trong hệ thống | Email đăng nhập | Mật khẩu mẫu | Quyền hạn chính |
| :--- | :--- | :---: | :--- |
| **Quản trị viên / Trưởng họ (Admin)** | `admin@familyconnect.vn` | `Admin@123` | Toàn quyền quản trị hệ thống, duyệt thành viên, cấu hình phân quyền và xem audit logs. |
| **Trưởng chi họ (Moderator)** | `moderator@familyconnect.vn` | `Mod@123` | Quản lý sự kiện giỗ chi, duyệt bài viết và ảnh trong phạm vi chi họ. |
| **Thành viên gia tộc (Member)** | `member@familyconnect.vn` | `Member@123` | Xem cây gia phả, đăng bài viết, điểm danh RSVP, trò chuyện với Trợ lý AI. |

*(Bạn cũng có thể tự do nhấn vào nút **"Đăng ký"** tại trang `/dang-ky` để tạo thêm tài khoản mới bất kỳ lúc nào).*

---

## 🧪 Chạy bộ kiểm thử tự động (Automated Testing)

Dự án tích hợp bộ kiểm thử tự động toàn diện gồm **73 ca kiểm thử** bao phủ toàn bộ các tầng logic cốt lõi. Bạn có thể kiểm tra sức khỏe của toàn bộ hệ thống bằng các lệnh sau:

Mở terminal tại thư mục `backend`:

1. **Kiểm thử Phân quyền RBAC & Bảo mật (14 ca test):**
   ```bash
   npm run test:rbac
   ```
2. **Kiểm thử Khung AI Service & Đồ thị Phả hệ (34 ca test):**
   ```bash
   npm run test:ai
   ```
3. **Kiểm thử Nghiệp vụ Bài viết, Sự kiện, RSVP & Di sản (25 ca test):**
   ```bash
   npm run test:modules
   ```
4. **Chạy đồng thời toàn bộ 73 ca kiểm thử:**
   ```bash
   npm test
   ```

*Tất cả 73 ca kiểm thử đều đạt kết quả **100% PASS**.*

---

## 🔧 Xử lý lỗi thường gặp (Troubleshooting)

### 1. Báo lỗi `Cannot connect to PostgreSQL` tại `/api/v1/health`
- **Nguyên nhân:** Dịch vụ PostgreSQL chưa được bật hoặc mật khẩu trong `backend/.env` chưa trùng khớp với mật khẩu máy của bạn.
- **Cách xử lý:** 
  - Mở công cụ `Services` trên Windows, tìm `postgresql-x64-xx` và chọn **Start**.
  - Kiểm tra lại `DB_PASSWORD` trong tệp `backend/.env` xem đã khớp với tài khoản `postgres` trên máy chưa.

### 2. Báo lỗi xung đột cổng `Port 3000 is already in use` hoặc `Port 5173 is already in use`
- **Nguyên nhân:** Có một tiến trình Node.js trước đó vẫn đang chạy ngầm trên máy bạn.
- **Cách xử lý:** 
  - Mở PowerShell và chạy lệnh tìm tiến trình chiếm cổng:
    ```powershell
    Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
    ```
  - Hoặc khởi động lại máy tính rồi nhấp đúp lại vào `chay-tat-ca.bat`.

### 3. Giao diện Frontend hiển thị trang trắng hoặc lỗi module Prisma
- **Cách xử lý:** Chạy lệnh sinh lại client cho Prisma:
  ```bash
  cd backend
  npx prisma generate
  ```

---

