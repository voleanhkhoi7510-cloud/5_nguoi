# Software Design Description (SDD)
## 1. System Architecture (Kiến Trúc Hệ Thống)

### 1.1. Mô hình tổng thể (3-Tier Local-First Architecture)

Hệ thống **FamilyConnect** được thiết kế theo mô hình kiến trúc phân tầng 3 lớp chuẩn mực (*3-Tier Client-Server Architecture*), kết hợp với nguyên lý **Local-First / On-Premise** nhằm bảo đảm tuyệt đối quyền riêng tư dữ liệu gia tộc, tốc độ phản hồi cực nhanh và khả năng vận hành trơn tru không phụ thuộc vào kết nối Internet bên ngoài.

```text
+---------------------------------------------------------------------------------------------------+
|                                  TẦNG TRÌNH DIỄN (PRESENTATION LAYER)                             |
|                                                                                                   |
|  React 19 + Vite SPA (Port 5173)                                                                  |
|  ├── Cổng thành viên & Quản trị (Responsive UI với Tailwind CSS, Lucide Icons)                   |
|  ├── Sơ đồ Phả hệ tương tác (React Flow Canvas: Zoom, Pan, Multi-generation View)                 |
|  ├── Phân hệ Cộng đồng & Lịch giỗ Âm lịch (Newsfeed, Comments, Reactions, RSVP Tracker)          |
|  └── Trợ lý AI Khung Chat (Kinship Pronoun Calculator, RAG Q&A, Member Recommendations)          |
+---------------------------------------------------------------------------------------------------+
                                                  │
                                                  │  HTTP RESTful API (JSON Payload) & JWT Bearer
                                                  ▼
+---------------------------------------------------------------------------------------------------+
|                           TẦNG XỬ LÝ NGHIỆP VỤ (APPLICATION LOGIC LAYER)                         |
|                                                                                                   |
|  Node.js (ESM) + Express 5 + TypeScript (Port 3000)                                               |
|  ├── Middlewares Bộ lọc: CORS, JSON Body Parser, JWT Authenticator, RBAC & Permission Enforcement|
|  ├── Audit Logger Middleware (Ghi nhận vết can thiệp vào bảng audit_logs)                         |
|  ├── Hệ thống RESTful Controllers:                                                                |
|  │    ├── auth.controller        (Đăng ký, Đăng nhập, Cấp JWT token)                             |
|  │    ├── genealogy.controller   (Cây gia phả, Thêm/Sửa nút, Quản lý chi phái, Hôn nhân)          |
|  │    ├── posts.controller       (Bản tin dòng họ, Bình luận, Thả cảm xúc, Kiểm duyệt)           |
|  │    ├── events.controller      (Lịch giỗ Âm lịch, Họp họ, Điểm danh RSVP)                       |
|  │    ├── heritage.controller    (Tài liệu phả ký số, Tiểu sử tiền nhân, Văn khấn cổ)             |
|  │    ├── ai.controller          (Cầu nối trung gian gọi FamilyAIService)                         |
|  │    └── admin.controller       (Quản trị tài khoản, Phân quyền RBAC, Xem audit logs)           |
|  └── Anti-Cycle Graph Validation Engine (Ngăn chặn tạo chu trình gia phả)                         |
+---------------------------------------------------------------------------------------------------+
                     │                                                │
                     │ Tích hợp trực tiếp / In-Process                │ Ánh xạ CSDL (Type-Safe ORM)
                     ▼                                                ▼
+-------------------------------------------------+  +----------------------------------------------+
|     KHUNG AI CHUYÊN BIỆT (AI SERVICE ENGINE)    |  |     TẦNG LƯU TRỮ DỮ LIỆU (DATABASE LAYER)    |
|                                                 |  |                                              |
|  FamilyAIService Module (`AI/src/`)             |  |  PostgreSQL 16 (Port 5432)                   |
|  ├── Hybrid Data Connector                      |  |  ├── 17 Bảng CSDL Chuẩn hóa 3NF:             |
|  │   (Prisma Database Client + Mock Fallback)   |  |  │   • users, roles, family_members          |
|  ├── Relationship Graph Engine                  |  |  │   • families, family_branches, members    |
|  │   • Breadth-First Search (BFS) shortest path |  |  │   • member_profiles, marriages            |
|  │   • Lowest Common Ancestor (LCA)             |  |  │   • parent_child_relationships            |
|  │   • Vietnamese Kinship Pronoun Deducer       |  |  │   • posts, post_comments, post_reactions   |
|  ├── Knowledge Retrieval & Semantic Search      |  |  │   • events, event_rsvps                   |
|  ├── Family Knowledge Q&A Engine (RAG)          |  |  │   • family_documents, ai_chat_histories   |
|  └── Recommendation & Summarization Service     |  |  │   • audit_logs                            |
|                                                 |  |  ├── Prisma ORM Client Generator             |
|                                                 |  |  └── Sẵn sàng mở rộng tiện ích `pgvector`    |
+-------------------------------------------------+  +----------------------------------------------+
```

---

### 1.2. Phân tích chi tiết từng tầng kiến trúc

#### 1. Tầng Trình diễn (Presentation Layer - Frontend)
- **Công nghệ cốt lõi:** React 19 kết hợp công cụ đóng gói Vite cho tốc độ khởi động cực nhanh (< 300ms) và tính năng Hot Module Replacement (HMR) tức thì.
- **Quản lý điều hướng (Routing):** Sử dụng `react-router-dom` v7 với cấu trúc Route lồng nhau:
  - Route công khai: `/dang-nhap` (Login), `/dang-ky` (Register).
  - Route bảo vệ thuộc AppLayout chính: `/` (Dashboard tổng quan), `/gia-dinh` (Thông tin gia tộc), `/gia-pha` (Cây phả hệ React Flow), `/quan-he` (Thiết lập quan hệ), `/cong-dong` (Bản tin chia sẻ), `/su-kien` (Lịch giỗ Âm lịch & RSVP), `/anh` (Bộ sưu tập ảnh kỷ niệm), `/danh-ba` (Danh bạ & Khuyến học), `/di-san` (Tủ sách phả ký số), `/tro-ly-ai` (Hỏi đáp AI & Tính danh xưng), `/bao-mat` (Quản trị RBAC & Nhật ký kiểm toán).
- **Bộ hiển thị đồ thị gia phả:** Tích hợp `reactflow` (`^11.11.4`), xử lý các nút thành viên dạng Custom Nodes với màu sắc phân biệt thế hệ, hiển thị thông tin giới tính, trạng thái còn sống hay đã mất, liên kết hôn phối bằng đường nối ngang và liên kết phụ mẫu bằng đường nối phân cấp có hướng.

#### 2. Tầng Ứng dụng & Nghiệp vụ (Application Layer - Backend)
- **Nền tảng thực thi:** Node.js hỗ trợ chuẩn ECMAScript Modules (ESM) kết hợp framework Express 5 và trình thực thi TypeScript trực tiếp `tsx`.
- **Hệ thống Middleware bảo vệ:**
  - `cors`: Cấu hình cho phép các yêu cầu an toàn từ Frontend (`http://localhost:5173`).
  - `authenticateJWT`: Kiểm tra tính hợp lệ của mã thông báo Bearer JWT trong Header `Authorization`, giải mã thông tin `userId`, `email`, `role` gán vào đối tượng `req.user`.
  - `requireRole`: Chặn các hành vi truy cập trái thẩm quyền hệ thống (chỉ cho phép ADMIN, MODERATOR hoặc MEMBER).
  - `requirePermission`: Kiểm tra ma trận quyền hạn chi tiết (`MANAGE_USERS`, `MANAGE_GENEALOGY`, `AUDIT_LOGS_VIEW`).
  - `auditMiddleware`: Tự động ghi lại nhật ký mọi thao tác thêm/sửa/xóa phả hệ và sự kiện vào bảng `audit_logs`.
- **Bộ điều khiển nghiệp vụ (Controllers):** Đóng gói logic nghiệp vụ theo từng domain chuyên biệt, chuyển đổi an toàn các trường số nguyên lớn `BigInt` và `Date` sang chuỗi JSON hợp lệ.

#### 3. Tầng Dịch vụ Trí tuệ Nhân tạo (Family AI Service Layer)
- Đặt trọn vẹn trong thư mục `AI/`, được đóng gói độc lập theo chuẩn TypeScript:
  - **`dataConnector.ts`:** Cầu nối dữ liệu kép (Hybrid Data Connector). Tự động nạp dữ liệu từ PostgreSQL qua Prisma và có khả năng chuyển đổi tức thì sang Mock Store trong RAM khi chạy unit test độc lập.
  - **`relationshipGraph.ts`:** Khởi tạo đồ thị có hướng biểu diễn cây phả hệ. Cung cấp thuật toán tìm đường đi ngắn nhất (BFS) để xác định khoảng cách topo giữa 2 cá nhân bất kỳ; thuật toán tìm Tổ tiên chung gần nhất (LCA) để xác định điểm phân nhánh huyết thống; động cơ quy tắc xưng hô thuần Việt tính toán chuẩn xác danh xưng dựa trên đời thế hệ, nhánh trưởng/thứ và tuổi tác.
  - **`knowledgeRetrieval.ts`:** Thực hiện tìm kiếm ngữ nghĩa (Semantic Search) trên hồ sơ cá nhân, văn bản quy ước gia tộc và tư liệu lịch sử.
  - **`qaEngine.ts`:** Động cơ hỏi đáp RAG (Retrieval-Augmented Generation) nguyên mẫu: phân tích ý định câu hỏi (Intent Recognition: hỏi quan hệ, hỏi thông tin cá nhân, hỏi quy ước gia tộc, hỏi sự kiện, hỏi thống kê), trích xuất ngữ cảnh liên quan và sinh câu trả lời kính cẩn, chính xác, đính kèm dẫn chứng nguồn minh bạch.
  - **`recommendationService.ts`:** Thuật toán gợi ý kết nối con cháu cùng ngành nghề, đề xuất tài liệu di sản và tóm tắt văn bản.

#### 4. Tầng Dữ liệu & Lưu trữ (Data Persistence Layer)
- **PostgreSQL 16:** Lưu trữ cấu trúc quan hệ toàn vẹn với 17 bảng nghiệp vụ, sử dụng khóa chính tự tăng (Identity BigInt), các chỉ mục tối ưu hóa tìm kiếm (`INDEX`) và các ràng buộc toàn vẹn tham chiếu (`ON DELETE CASCADE`, `ON DELETE SET NULL`).
- **Prisma ORM 6:** Định nghĩa lược đồ dữ liệu tập trung tại `backend/prisma/schema.prisma`, tự động sinh Client TypeScript đảm bảo không phát sinh lỗi sai tên cột hay sai kiểu dữ liệu tại thời gian chạy (Runtime).

---

### 1.3. Luồng dữ liệu điển hình (Data Flow Sequences)

#### Luồng 1: Tra cứu và suy luận danh xưng họ tộc qua AI
```text
User (React Web)           Backend API (Express)        AI Service (Engine)       PostgreSQL (Prisma)
       │                            │                            │                        │
       │─── 1. POST /api/v1/ai/kinship ───►                      │                        │
       │    { member1Id, member2Id }│                            │                        │
       │                            │─── 2. Calculate Kinship ──►│                        │
       │                            │                            │─── 3. Query Members ──►│
       │                            │                            │◄── 4. Graph Nodes/Edges│
       │                            │                            │                        │
       │                            │                            │ [Chạy BFS & LCA Engine]│
       │                            │                            │ [Áp quy tắc Xưng Hô]   │
       │                            │◄── 5. Kinship Result ──────│                        │
       │                            │    (Danh xưng, Đời, Con đường quan hệ)               │
       │◄── 6. JSON Response ───────│                            │                        │
       │    (Render giao diện)      │                            │                        │
```

#### Luồng 2: Xác thực và Phân quyền truy cập (JWT & RBAC)
```text
User (React Web)           Backend API (Auth Route)     RBAC Middleware           PostgreSQL DB
       │                            │                            │                        │
       │─── 1. POST /api/v1/auth/login ──►                       │                        │
       │    { email, password }     │                            │                        │
       │                            │─── 2. Find User by Email ──────────────────────────►│
       │                            │◄── 3. Return user_hash ─────────────────────────────│
       │                            │    [Bcrypt Compare]        │                        │
       │                            │    [Ký JWT Token]          │                        │
       │◄── 4. Token & User Info ───│                            │                        │
       │                            │                            │                        │
       │─── 5. GET /api/v1/admin/* ─┼───────────────────────────►│                        │
       │    (Header: Bearer Token)  │                            │ [Verify Token]         │
       │                            │                            │ [Check Role/Permission]│
       │                            │◄── 6. Cho phép đi tiếp ────│                        │
       │                            │─── 7. Thực thi nghiệp vụ ──────────────────────────►│
```

---

### 1.4. Thiết kế bảo mật hệ thống (Security Architecture)

1. **Bảo vệ mật khẩu:** Mật khẩu người dùng được băm một chiều bằng giải thuật **Bcrypt** với hệ số muối (*salt rounds = 12*), ngăn ngừa tuyệt đối tấn công dò từ điển (Rainbow table).
2. **Kiểm soát phiên làm việc an toàn:** Cơ chế JSON Web Token (JWT) với khóa bí mật bảo mật cao, thời hạn sống hợp lý và cơ chế xác thực không lưu trạng thái (Stateless).
3. **Phân quyền đa tầng (Multi-layered Authorization):**
   - Tầng 1: System RBAC (`ADMIN`, `MODERATOR`, `MEMBER`).
   - Tầng 2: Family-level RBAC (`OWNER`, `ADMIN`, `EDITOR`, `MEMBER`, `VIEWER`).
   - Tầng 3: Quyền sở hữu tài nguyên (Resource Ownership: chỉ tác giả bài viết hoặc Admin mới có quyền sửa/xóa).
4. **Nhật ký kiểm toán truy vết (Audit Trail):** Mọi hành động nhạy cảm đều được ghi lại địa chỉ IP, người thao tác và thông tin dữ liệu thay đổi.
