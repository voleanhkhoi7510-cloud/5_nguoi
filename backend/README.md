# 🌳 FamilyConnect Backend API

Hệ thống Backend RESTful API hoàn chỉnh cho nền tảng Gia đình số & Gia phả trực tuyến **FamilyConnect: AI-powered Digital Family Community Platform**, được phát triển dựa trên yêu cầu đề tài nghiên cứu và ứng dụng thực tiễn với Node.js, Express 5, TypeScript, Prisma ORM và PostgreSQL.

---

## 🚀 Hướng dẫn khởi chạy Local

### 1. Chuẩn bị cơ sở dữ liệu PostgreSQL (Local)
1. Tạo một cơ sở dữ liệu trên PostgreSQL cục bộ (ví dụ: `familyconnect`).
2. Chạy file SQL tạo cấu trúc và dữ liệu mẫu tại:  
   `backend/database/database.sql`

### 2. Cấu hình biến môi trường (`.env`)
Chỉnh sửa file `.env` tại thư mục `backend/`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=familyconnect
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=FamilyConnect_SuperSecret_JWT_Key_2026
DATABASE_URL="postgresql://postgres:your_postgres_password@localhost:5432/familyconnect?schema=public"
```

### 3. Cài đặt thư viện & Sinh Prisma Client
```bash
cd backend
npm install
npm run db:generate
```

### 4. Khởi chạy Server
- **Chế độ phát triển (Development tự động reload khi sửa file):**
  ```bash
  npm run dev
  ```
- **Biên dịch TypeScript sang JavaScript (Build):**
  ```bash
  npm run build
  ```
- **Chạy Production tại Local:**
  ```bash
  npm start
  ```

Server sẽ chạy tại địa chỉ: `http://localhost:3000`

---

## 📊 Bảng đối chiếu Tính năng với Đề bài (Requirements Compliance)

| Nhóm tính năng đề bài | Yêu cầu cụ thể | Trạng thái | Endpoint Backend |
|---|---|:---:|---|
| **1. User & Security** | Đăng ký & Đăng nhập JWT | ✅ | `POST /api/v1/auth/register`, `POST /api/v1/auth/login` |
| | Phân quyền RBAC (ADMIN, MODERATOR, MEMBER) | ✅ | Middleware `requireRole()`, `PUT /api/v1/admin/users/:id/role` |
| | Quản lý Profile cá nhân | ✅ | `GET /api/v1/users/me`, `PUT /api/v1/users/me` |
| | Xác minh thành viên gia đình (Verification) | ✅ | `POST /api/v1/users/join-family`, `PUT /api/v1/admin/family-members/:id/verify` |
| **2. Family & Genealogy** | Quản lý Gia tộc (Family CRUD) | ✅ | `/api/families` |
| | Quản lý Chi / Nhánh (Branch CRUD) | ✅ | `/api/family-branches` |
| | Quản lý Thành viên (Member CRUD) | ✅ | `GET/POST/PUT/DELETE /api/v1/genealogy/members` |
| | Quan hệ Cha/Mẹ - Con (Parent-Child) | ✅ | `/api/parent-child` |
| | Quan hệ Hôn nhân (Marriage) | ✅ | `/api/marriages` |
| | Cây gia phả tương tác (Graph Nodes & Edges) | ✅ | `GET /api/v1/genealogy/tree?familyId={id}` |
| | Truy vấn mối quan hệ giữa 2 người | ✅ | `GET /api/v1/genealogy/relationships/query` |
| **3. Community** | Đăng và quản lý bài viết / Thông báo | ✅ | `GET /api/v1/posts`, `POST /api/v1/posts`, `DELETE /api/v1/posts/:id` |
| | Bình luận & Thả cảm xúc (Reaction) | ✅ | `POST /api/v1/posts/:id/comments`, `POST /api/v1/posts/:id/reactions` |
| | Chia sẻ ảnh / Media đa phương tiện | ✅ | Trường `media_urls` trong bài viết |
| **4. Events** | Tạo và quản lý sự kiện gia tộc | ✅ | `GET /api/v1/events`, `POST /api/v1/events` |
| | Quản lý điểm danh (RSVP Management) | ✅ | `POST /api/v1/events/:id/rsvp` (`GOING`, `DECLINED`, `TENTATIVE`) |
| | Thư viện ảnh sự kiện | ✅ | Trường `media_urls` trong sự kiện |
| **5. Family Directory** | Danh bạ gia đình & Tra cứu đa tiêu chí | ✅ | `GET /api/v1/genealogy/directory?profession=&location=&generation=` |
| | Hồ sơ nghề nghiệp, học vấn, tiểu sử | ✅ | Bảng `member_profiles` (`occupation`, `education`, `biography`) |
| **6. Family Heritage** | Tài liệu di sản & Hồ sơ lịch sử | ✅ | `GET/POST/PUT/DELETE /api/v1/heritage/documents` |
| | Bộ sưu tập ảnh gia tộc (Photo Gallery) | ✅ | `GET /api/v1/heritage/gallery?familyId={id}` (tổng hợp bài viết, sự kiện, di sản) |
| **7. AI-assisted Services** | AI Semantic Search | ✅ | `POST /api/v1/ai/search` (tìm kiếm ngữ nghĩa theo nghề, thế hệ, địa phương) |
| | AI Family Knowledge Assistant | ✅ | `POST /api/v1/ai/chat` (trợ lý hỏi đáp quy ước, văn bản gia tộc) |
| | AI Relationship Explanation | ✅ | `POST /api/v1/ai/explain-relationship` (giải thích cách xưng hô chuẩn mực) |
| | AI Content Summarization | ✅ | `POST /api/v1/ai/summarize` (tóm tắt văn bản, bài viết, tiểu sử) |
| | AI Recommendation Services | ✅ | `GET /api/v1/ai/recommendations` (gợi ý kết nối thành viên và tài nguyên) |
| **8. Dashboard & Reporting** | Thống kê số liệu gia tộc & Dân số học | ✅ | `GET /api/v1/genealogy/dashboard/stats` (nam/nữ, thế hệ, độ tuổi) |
| | Thống kê hoạt động cộng đồng | ✅ | `GET /api/v1/genealogy/dashboard/community` (bài viết, bình luận, tương tác) |
| | Thống kê sự kiện gia tộc | ✅ | `GET /api/v1/genealogy/dashboard/events` (sắp tới, đã qua, tỷ lệ RSVP) |
| **9. Administration** | Quản lý người dùng hệ thống | ✅ | `GET /api/v1/admin/users`, `PUT /api/v1/admin/users/:id/role`, `DELETE /api/v1/admin/users/:id` |
| | Kiểm duyệt nội dung (Content Moderation) | ✅ | `PUT /api/v1/admin/posts/:id/moderate` (`ACTIVE`, `HIDDEN`, `FLAGGED`) |
| | Nhật ký kiểm toán (Audit Logging) | ✅ | `GET /api/v1/admin/audit-logs` (lưu vết IP, thao tác, thời gian) |
| | Sao lưu & Xuất dữ liệu (Backup & Export) | ✅ | `GET /api/v1/admin/export/:familyId` (xuất JSON toàn bộ gia phả) |
| | Kiểm tra trạng thái hệ thống (Health Check) | ✅ | `GET /api/v1/health` |
