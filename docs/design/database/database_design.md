# IV. Software Design Description (SDD)

## 2. Database Design (Thiết Kế Cơ Sở Dữ Liệu)

### 2.1. Tổng quan kiến trúc dữ liệu (Database Architecture Overview)

Hệ thống **FamilyConnect** sử dụng hệ quản trị cơ sở dữ liệu quan hệ **PostgreSQL 16** kết hợp với tiện ích mở rộng **pgvector**. Cấu trúc CSDL được thiết kế theo chuẩn hóa bậc 3 (3NF), đảm bảo tính toàn vẹn tham chiếu, tối ưu hóa truy vấn quan hệ phả hệ đa thế hệ và hỗ trợ vận hành hoàn toàn độc lập trên môi trường máy chủ cục bộ (Localhost).

Hệ thống gồm 17 thực thể được chia thành 4 nhóm nghiệp vụ chính:
1. **Nhóm Xác thực & Phân quyền (Security & RBAC):** `users`, `roles`, `family_members`.
2. **Nhóm Phả hệ Cốt lõi (Genealogy Graph Core):** `families`, `family_branches`, `members`, `member_profiles`, `parent_child_relationships`, `marriages`.
3. **Nhóm Cộng đồng & Tương tác (Community & Events):** `posts`, `post_comments`, `post_reactions`, `events`, `event_rsvps`.
4. **Nhóm Di sản & Hỗ trợ AI (Heritage & Local AI Services):** `family_documents`, `ai_chat_histories`, `audit_logs`.

---

### 2.2. Sơ đồ thực thể liên kết (Entity Relationship Diagram - ERD)

#### Sơ đồ phân hệ phả hệ cốt lõi (Genealogy Core ERD)
*(Xem chi tiết file ảnh sơ đồ tại `docs/diagrams/database_erd_core.png`)*

```text
[FAMILIES] 1 ────────── N [FAMILY_BRANCHES]
    │ 1                            │ 1
    │                              │
    │ N                            │ N
    ├─────────────────────── [MEMBERS] 1 ────────── 1 [MEMBER_PROFILES]
    │ 1                            │
    │                              ├────── 1:N ──── [PARENT_CHILD_RELATIONSHIPS]
    │ N                            │                (parent_id, child_id)
[FAMILY_DOCUMENTS]                 │
    │                              ├────── 1:N ──── [MARRIAGES]
    │ N                            │                (partner1_id, partner2_id)
    └────────── N:1 ───────────────┘
```

---

### 2.3. Từ điển dữ liệu chi tiết (Data Dictionary)

#### NHÓM I: XÁC THỰC & PHÂN QUYỀN (SECURITY & RBAC)

##### 1. Bảng `users` (Tài khoản người dùng)
*Lưu trữ thông tin xác thực và tài khoản đăng nhập hệ thống.*

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `user_id` | BIGINT | PK, Identity | Định danh duy nhất của người dùng |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Địa chỉ email đăng nhập |
| `password_hash` | VARCHAR(255) | NOT NULL | Mật khẩu băm (BCrypt) |
| `full_name` | VARCHAR(150) | NOT NULL | Họ và tên người dùng |
| `role` | VARCHAR(30) | DEFAULT 'MEMBER' | Vai trò hệ thống (ADMIN, MODERATOR, MEMBER) |
| `avatar_url` | TEXT | Nullable | Đường dẫn ảnh đại diện cục bộ |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời gian khởi tạo tài khoản |

##### 2. Bảng `roles` (Vai trò nội bộ dòng họ)
*Quản lý các cấp bậc vai trò trong ban liên lạc và gia đình.*

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `role_id` | BIGINT | PK, Identity | Mã định danh vai trò |
| `name` | VARCHAR(50) | UNIQUE, NOT NULL | Tên vai trò (ADMIN, MODERATOR, MEMBER) |
| `description` | TEXT | Nullable | Mô tả quyền hạn của vai trò |

##### 3. Bảng `family_members` (Liên kết tài khoản & Gia đình)
*Bảng trung gian liên kết giữa tài khoản `users` và dòng họ `families`, gán vai trò theo dòng họ.*

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `family_member_id` | BIGINT | PK, Identity | Định danh bản ghi liên kết |
| `user_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `users(user_id)` |
| `family_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `families(family_id)` |
| `role_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `roles(role_id)` |
| `status` | VARCHAR(20) | DEFAULT 'APPROVED' | Trạng thái (PENDING, APPROVED, REJECTED) |
| `joined_at` | TIMESTAMP | DEFAULT NOW() | Ngày tham gia dòng họ |

* **Ràng buộc bổ sung:** `UNIQUE(user_id, family_id)` - Mỗi tài khoản chỉ liên kết 1 lần vào 1 gia đình.

---

#### NHÓM II: PHẢ HỆ CỐT LÕI (GENEALOGY GRAPH CORE)

##### 4. Bảng `families` (Gia tộc / Dòng họ)
*Quản lý thông tin cấp cao nhất của một dòng họ hoặc họ tộc.*

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `family_id` | BIGINT | PK, Identity | Khóa chính định danh gia tộc |
| `name` | VARCHAR(150) | NOT NULL | Tên dòng họ (ví dụ: Dòng họ Nguyễn Văn) |
| `description` | TEXT | Nullable | Giới thiệu khái quát nguồn cội, quê quán |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày khởi tạo dữ liệu |

##### 5. Bảng `family_branches` (Chi / Nhánh dòng họ)
*Quản lý các chi phái được tách ra từ dòng họ chính.*

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `branch_id` | BIGINT | PK, Identity | Khóa chính định danh chi họ |
| `family_id` | BIGINT | FK, NOT NULL | Tham chiếu tới `families(family_id)` |
| `name` | VARCHAR(150) | NOT NULL | Tên chi nhánh (ví dụ: Chi 2 miền Nam) |
| `description` | TEXT | Nullable | Mô tả về chi nhánh |

##### 6. Bảng `members` (Nút thành viên trên cây gia phả)
*Thực thể trung tâm biểu diễn từng cá nhân trong cây phả hệ đa thế hệ.*

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `member_id` | BIGINT | PK, Identity | Khóa chính của nút thành viên |
| `family_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `families(family_id)` |
| `branch_id` | BIGINT | FK, Nullable | Khóa ngoại trỏ về `family_branches(branch_id)` |
| `user_id` | BIGINT | FK, Nullable | Liên kết tài khoản `users(user_id)` (nếu có) |
| `full_name` | VARCHAR(150) | NOT NULL | Tên đầy đủ trong phả ký |
| `gender` | VARCHAR(20) | CHECK in ('male', 'female', 'other') | Giới tính |
| `generation` | INT | NOT NULL, DEFAULT 1 | Đời thứ mấy trong dòng họ |
| `birth_date` | DATE | Nullable | Ngày sinh |
| `death_date` | DATE | Nullable | Ngày tạ thế (nếu đã mất) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời gian tạo hồ sơ |

##### 7. Bảng `parent_child_relationships` (Quan hệ Cha/Mẹ - Con)
*Thiết lập cạnh có hướng (Directed Edges) trên đồ thị gia phả.*

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `relationship_id` | BIGINT | PK, Identity | Định danh quan hệ |
| `parent_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `members(member_id)` (Bậc cha/mẹ) |
| `child_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `members(member_id)` (Bậc con) |
| `relationship_type` | VARCHAR(30) | DEFAULT 'father' | Phân loại quan hệ (`father`, `mother`, `adopted`) |

* **Ràng buộc bổ sung:** `UNIQUE(parent_id, child_id)` và `CHECK (parent_id <> child_id)` - Ngăn chặn trùng lặp và tự làm cha/mẹ chính mình.

##### 8. Bảng `marriages` (Quan hệ Hôn nhân)
*Thiết lập cạnh liên kết ngang giữa hai bạn đời.*

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `marriage_id` | BIGINT | PK, Identity | Định danh cuộc hôn nhân |
| `partner1_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `members(member_id)` |
| `partner2_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `members(member_id)` |
| `start_date` | DATE | Nullable | Ngày kết hôn |
| `end_date` | DATE | Nullable | Ngày ly hôn hoặc kết thúc |
| `status` | VARCHAR(30) | DEFAULT 'MARRIED' | Trạng thái (MARRIED, DIVORCED) |

* **Ràng buộc bổ sung:** `CHECK (partner1_id <> partner2_id)` - Ngăn chặn kết hôn với chính mình.

##### 9. Bảng `member_profiles` (Hồ sơ cá nhân mở rộng)
*Lưu thông tin học vấn, nghề nghiệp; quan hệ 1-1 với `members`.*

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `member_id` | BIGINT | PK, FK | Khóa chính kiêm khóa ngoại trỏ về `members(member_id)` |
| `occupation` | VARCHAR(150) | Nullable | Ngành nghề chuyên môn |
| `education` | VARCHAR(150) | Nullable | Trình độ học vấn |
| `biography` | TEXT | Nullable | Tiểu sử, công đức cá nhân |

---

#### NHÓM III: CỘNG ĐỒNG & TƯƠNG TÁC (COMMUNITY & EVENTS)

##### 10. Bảng `posts` (Bài viết & Bản tin cộng đồng)
*Quản lý các tin tức, câu chuyện, thông cáo chia sẻ trong dòng họ.*

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `post_id` | BIGINT | PK, Identity | Định danh bài viết |
| `family_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `families(family_id)` |
| `author_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `users(user_id)` (Người đăng) |
| `content` | TEXT | NOT NULL | Nội dung bài viết |
| `is_announcement` | BOOLEAN | DEFAULT FALSE | Đánh dấu bài thông cáo chính thức |
| `status` | VARCHAR(20) | DEFAULT 'ACTIVE' | Trạng thái bài viết (ACTIVE, HIDDEN, FLAGGED) |
| `media_urls` | TEXT[] | Nullable | Mảng danh sách đường dẫn hình ảnh/video |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời gian đăng bài |

##### 11. Bảng `post_comments` (Bình luận bài viết)
*Lưu trữ các phản hồi, thảo luận của thành viên dưới mỗi bài viết.*

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `comment_id` | BIGINT | PK, Identity | Định danh bình luận |
| `post_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `posts(post_id)` |
| `author_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `users(user_id)` |
| `content` | TEXT | NOT NULL | Nội dung bình luận |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời gian bình luận |

##### 12. Bảng `post_reactions` (Cảm xúc bài viết)
*Lưu trữ lượt thả cảm xúc trên bài viết.*

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `reaction_id` | BIGINT | PK, Identity | Định danh cảm xúc |
| `post_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `posts(post_id)` |
| `user_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `users(user_id)` |
| `reaction_type` | VARCHAR(20) | DEFAULT 'LIKE' | Loại cảm xúc (LIKE, HEART, PRAY) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời gian tương tác |

* **Ràng buộc bổ sung:** `UNIQUE(post_id, user_id)` - Mỗi người dùng chỉ thả 1 cảm xúc trên 1 bài viết.

##### 13. Bảng `events` (Sự kiện gia tộc & Giỗ chạp)
*Quản lý lịch giỗ tổ, giỗ chi và các buổi họp mặt gia đình.*

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `event_id` | BIGINT | PK, Identity | Định danh sự kiện |
| `family_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `families(family_id)` |
| `creator_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `users(user_id)` (Người tạo) |
| `title` | VARCHAR(200) | NOT NULL | Tiêu đề sự kiện / Tên ngày giỗ |
| `description` | TEXT | Nullable | Mô tả chi tiết, kế hoạch tổ chức |
| `event_date` | TIMESTAMP | NOT NULL | Thời gian diễn ra sự kiện |
| `location` | VARCHAR(255) | Nullable | Địa điểm tổ chức (Từ đường, nhà chi trưởng) |
| `media_urls` | TEXT[] | Nullable | Danh sách ảnh tư liệu sự kiện |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời gian tạo sự kiện |

##### 14. Bảng `event_rsvps` (Điểm danh & Xác nhận tham dự)
*Ghi nhận phản hồi tham gia sự kiện giỗ họ của các thành viên.*

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `rsvp_id` | BIGINT | PK, Identity | Định danh bản ghi RSVP |
| `event_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `events(event_id)` |
| `user_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `users(user_id)` |
| `status` | VARCHAR(20) | DEFAULT 'GOING' | Trạng thái (GOING, DECLINED, TENTATIVE) |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Thời gian xác nhận cập nhật |

* **Ràng buộc bổ sung:** `UNIQUE(event_id, user_id)` - Mỗi thành viên chỉ có 1 trạng thái RSVP cho 1 sự kiện.

---

#### NHÓM IV: DI SẢN & DỊCH VỤ AI (HERITAGE & LOCAL AI)

##### 15. Bảng `family_documents` (Tài liệu di sản số)
*Quản lý các tài liệu scan chữ Hán - Nôm, bản dịch phả ký, hương ước cổ.*

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `document_id` | BIGINT | PK, Identity | Định danh tài liệu di sản |
| `family_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `families(family_id)` |
| `member_id` | BIGINT | FK, Nullable | Gắn với nhân vật lịch sử cụ thể (nếu có) |
| `title` | VARCHAR(200) | NOT NULL | Tiêu đề tài liệu |
| `document_type` | VARCHAR(50) | Nullable | Phân loại (HISTORICAL_RECORD, GENEALOGY, WILL) |
| `file_url` | TEXT | Nullable | Đường dẫn lưu trữ tệp cục bộ |
| `description` | TEXT | Nullable | Tóm tắt nội dung tài liệu |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời gian tải lên |

##### 16. Bảng `ai_chat_histories` (Lịch sử hội thoại AI)
*Lưu trữ các câu hỏi tra cứu danh xưng, hỏi đáp phả ký với Trợ lý AI Ollama.*

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `chat_id` | BIGINT | PK, Identity | Định danh lượt chat |
| `user_id` | BIGINT | FK, NOT NULL | Khóa ngoại trỏ về `users(user_id)` |
| `family_id` | BIGINT | FK, Nullable | Khóa ngoại trỏ về `families(family_id)` |
| `conversation_id` | VARCHAR(100) | NOT NULL | Mã phiên hội thoại (Session/Thread ID) |
| `prompt` | TEXT | NOT NULL | Câu hỏi của người dùng |
| `response` | TEXT | NOT NULL | Phản hồi được sinh ra từ Local LLM |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời gian hội thoại |

##### 17. Bảng `audit_logs` (Nhật ký kiểm toán hệ thống)
*Ghi nhận toàn bộ hành vi nhạy cảm để truy vết bảo mật theo quy định kỹ thuật phần mềm.*

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `log_id` | BIGINT | PK, Identity | Định danh bản ghi log |
| `user_id` | BIGINT | FK, Nullable | ID người thực hiện (nếu đã đăng nhập) |
| `action` | VARCHAR(50) | NOT NULL | Thao tác (CREATE, UPDATE, DELETE, APPROVE) |
| `entity_type` | VARCHAR(50) | NOT NULL | Bảng/thực thể bị tác động (MEMBERS, POSTS,...) |
| `entity_id` | VARCHAR(50) | Nullable | Khóa chính của bản ghi bị tác động |
| `details` | TEXT | Nullable | Chi tiết thay đổi (JSON dạng chuỗi) |
| `ip_address` | VARCHAR(50) | Nullable | Địa chỉ IP máy trạm thực hiện |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời gian phát sinh hành động |
