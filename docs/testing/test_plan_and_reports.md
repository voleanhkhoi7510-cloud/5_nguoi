# V. Software Testing & Quality Assurance
## Test Plan & Automated Test Reports (Kế Hoạch & Báo Cáo Kiểm Thử Tự Động)

---

### 1. Chiến lược & Kế hoạch kiểm thử (Testing Strategy)

Hệ thống **FamilyConnect** áp dụng chiến lược kiểm thử đa tầng (*Multi-tiered Testing Approach*), chú trọng vào việc tự động hóa kiểm thử để đảm bảo tính toàn vẹn dữ liệu phả hệ, an toàn bảo mật phân quyền và tính chính xác tuyệt đối của các thuật toán suy luận danh xưng:

```text
+-----------------------------------------------------------------------------------+
|                        TẦNG KIỂM THỬ TÍCH HỢP HỆ THỐNG                            |
|             (End-to-End API Routes, Controllers & Database Transactions)          |
+-----------------------------------------------------------------------------------+
                                         ▲
                                         │
+-----------------------------------------------------------------------------------+
|                        TẦNG KIỂM THỬ PHÂN QUYỀN & BẢO MẬT                         |
|     (Role-Based Access Control, Family Hierarchy, Resource Ownership Guards)      |
+-----------------------------------------------------------------------------------+
                                         ▲
                                         │
+-----------------------------------------------------------------------------------+
|                     TẦNG KIỂM THỬ THUẬT TOÁN ĐỒ THỊ & TRÍ TUỆ NHÂN TẠO            |
|       (BFS Pathfinding, LCA Ancestry, Vietnamese Kinship Rules, RAG Engine)       |
+-----------------------------------------------------------------------------------+
```

1. **Kiểm thử Phân quyền (RBAC Test Suite):** Kiểm chứng ma trận vai trò hệ thống (`ADMIN`, `MODERATOR`, `MEMBER`), cấp bậc vai trò gia đình (`OWNER`, `ADMIN`, `EDITOR`, `MEMBER`, `VIEWER`), và quyền sở hữu tài nguyên nhằm ngăn ngừa việc truy cập trái phép.
2. **Kiểm thử Khung Trí tuệ Nhân tạo & Cây gia phả (AI & Genealogy Test Suite):** Kiểm thử cấu trúc cây phả hệ 4 thế hệ, thuật toán tìm kiếm đường đi ngắn nhất (BFS), thuật toán tìm Tổ tiên chung gần nhất (LCA), giải thuật tính toán danh xưng thuần Việt theo phong tục truyền thống, cơ chế tìm kiếm ngữ nghĩa và động cơ hỏi đáp RAG.
3. **Kiểm thử Nghiệp vụ Phân hệ (Modules Test Suite):** Kiểm chứng toàn diện vòng đời bài viết bản tin cộng đồng (tạo bài, bình luận, thả cảm xúc, kiểm duyệt), vòng đời sự kiện giỗ chạp (tạo lịch, điểm danh RSVP thời gian thực), và tủ sách di sản phả ký số.

---

### 2. Môi trường thực thi kiểm thử (Test Environment)

- **Hệ điều hành:** Windows 10/11 (64-bit).
- **Môi trường Runtime:** Node.js v20+, TypeScript 5.9, trình thực thi `tsx` v4.23.
- **Cơ sở dữ liệu:** PostgreSQL 16 (kết hợp In-Memory Mock Connector độc lập khi chạy test cách ly).
- **Cơ chế Test Runner:** Bộ kiểm thử TypeScript tự động không phụ thuộc thư viện bên ngoài cồng kềnh, có thể chạy trực tiếp bằng dòng lệnh chỉ trong vài giây.

---

### 3. Chi tiết kết quả thực thi kiểm thử tự động (Execution Results)

Toàn bộ 73 ca kiểm thử tự động của dự án đã được chạy và đạt tỷ lệ thành công tuyệt đối (**100% PASS**):

#### 3.1. Bộ kiểm thử Phân quyền RBAC & Access Control (`backend/tests/rbac.test.ts`)
- **Lệnh thực thi:** `cd backend && npm run test:rbac`
- **Kết quả:** 14/14 tests PASSED (100%)

| STT | Tên ca kiểm thử (Test Case) | Phân loại | Trạng thái |
| :-: | :--- | :---: | :---: |
| 1 | Vai trò ADMIN có đầy đủ quyền quản trị hệ thống (`MANAGE_USERS`, `VIEW_AUDIT_LOGS`,...) | System RBAC | ✅ PASS |
| 2 | Vai trò MODERATOR có quyền duyệt bài nhưng không có quyền quản lý tài khoản người dùng | System RBAC | ✅ PASS |
| 3 | Vai trò MEMBER chỉ có quyền thành viên cơ bản, bị chặn khỏi các quyền kiểm duyệt | System RBAC | ✅ PASS |
| 4 | Middleware `requireRole`: Cho phép ADMIN truy cập tài nguyên yêu cầu vai trò ADMIN | Middleware | ✅ PASS |
| 5 | Middleware `requireRole`: Chặn người dùng vai trò MEMBER (Mã lỗi 403 Forbidden) khi vào khu vực ADMIN | Middleware | ✅ PASS |
| 6 | Middleware `requireRole`: Cho phép MODERATOR truy cập các tài nguyên dành cho [ADMIN, MODERATOR] | Middleware | ✅ PASS |
| 7 | Middleware `requirePermission`: Cho phép người dùng sở hữu quyền `MANAGE_USERS` đi tiếp | Middleware | ✅ PASS |
| 8 | Middleware `requirePermission`: Chặn người dùng thiếu quyền `VIEW_AUDIT_LOGS` | Middleware | ✅ PASS |
| 9 | Cấp bậc vai trò gia tộc: Vai trò OWNER có quyền hạn cao hơn ADMIN gia đình | Family RBAC | ✅ PASS |
| 10 | Cấp bậc vai trò gia tộc: Vai trò ADMIN có quyền hạn cao hơn EDITOR | Family RBAC | ✅ PASS |
| 11 | Cấp bậc vai trò gia tộc: Vai trò EDITOR có quyền hạn cao hơn MEMBER | Family RBAC | ✅ PASS |
| 12 | Cấp bậc vai trò gia tộc: Vai trò MEMBER có quyền hạn cao hơn VIEWER | Family RBAC | ✅ PASS |
| 13 | Bảo vệ quyền sở hữu tài nguyên: ADMIN hệ thống được phép can thiệp bất kỳ bài viết nào | Resource Guard | ✅ PASS |
| 14 | Bảo vệ quyền sở hữu tài nguyên: MODERATOR được phép can thiệp bài viết bị khiếu nại | Resource Guard | ✅ PASS |

---

#### 3.2. Bộ kiểm thử Khung AI Service & Đồ thị Phả hệ (`AI/tests/ai.test.ts`)
- **Lệnh thực thi:** `cd backend && npm run test:ai`
- **Kết quả:** 34/34 tests PASSED (100%)

| STT | Nhóm kiểm thử | Tên ca kiểm thử (Test Case) | Trạng thái |
| :-: | :--- | :--- | :---: |
| 1 | **Genealogy Graph** | Lấy dữ liệu cây gia phả mẫu thành công từ Data Connector | ✅ PASS |
| 2 | **Genealogy Graph** | Cây gia phả đảm bảo đầy đủ số lượng nút thành viên (13 thành viên) | ✅ PASS |
| 3 | **Genealogy Graph** | Đảm bảo đầy đủ các cạnh liên kết quan hệ phụ mẫu (15 cạnh Cha/Mẹ - Con) | ✅ PASS |
| 4 | **Genealogy Graph** | Đảm bảo đầy đủ các cạnh liên kết quan hệ hôn phối (4 cặp Vợ - Chồng) | ✅ PASS |
| 5 | **Genealogy Graph** | Cây phả hệ bao phủ toàn diện 4 thế hệ liên tục (từ Cụ Tổ đến Chắt) | ✅ PASS |
| 6 | **Kinship Algorithm** | Cụ Cụ và Cụ Mai có mối quan hệ hôn nhân chuẩn: Vợ - Chồng | ✅ PASS |
| 7 | **Kinship Algorithm** | Ông An gọi Bình là Con trai | ✅ PASS |
| 8 | **Kinship Algorithm** | Bình gọi Ông An là Cha ruột | ✅ PASS |
| 9 | **Kinship Algorithm** | Bình gọi Cụ Cụ là Ông Nội | ✅ PASS |
| 10 | **Kinship Algorithm** | Bình gọi Cụ Mai là Bà Nội | ✅ PASS |
| 11 | **Kinship Algorithm** | Bình gọi Ông Đức (em trai của Cha) là Chú ruột | ✅ PASS |
| 12 | **Kinship Algorithm** | Bình gọi Linh là Em gái ruột | ✅ PASS |
| 13 | **Kinship Algorithm** | Bình và Cường là Anh Em họ đồng tộc (Bình gọi Cường là Em trai họ) | ✅ PASS |
| 14 | **Kinship Algorithm** | Hoàng Long (Thế hệ 4) gọi Cụ Cụ (Thế hệ 1) chuẩn mực là Cụ Ông | ✅ PASS |
| 15 | **Semantic Retrieval**| Tìm kiếm thành viên theo chuyên môn ngành công nghệ thông tin | ✅ PASS |
| 16 | **Semantic Retrieval**| Kết quả tìm kiếm phản ánh đúng hồ sơ chuyên gia Nguyễn Văn Bình | ✅ PASS |
| 17 | **Semantic Retrieval**| Truy xuất tài liệu văn bản gia quy và điều răn dòng họ thành công | ✅ PASS |
| 18 | **Semantic Retrieval**| Trích xuất chính xác tài liệu Gia quy Tộc Nguyễn Văn | ✅ PASS |
| 19 | **AI Q&A Engine** | Nhận diện chính xác ý định truy vấn quan hệ (`RELATIONSHIP_QUERY`) | ✅ PASS |
| 20 | **AI Q&A Engine** | Câu trả lời phân tích quan hệ chứa đầy đủ họ tên 2 thành viên đối sánh | ✅ PASS |
| 21 | **AI Q&A Engine** | Phản hồi của AI có dẫn chứng nguồn thông tin phả hệ minh bạch | ✅ PASS |
| 22 | **AI Q&A Engine** | Nhận diện chính xác ý định hỏi về quy ước gia tộc (`HERITAGE_RULES`) | ✅ PASS |
| 23 | **AI Q&A Engine** | Câu trả lời trích xuất đúng nội dung các điều răn trong Gia quy | ✅ PASS |
| 24 | **AI Q&A Engine** | Dẫn chứng chính xác nguồn tài liệu di sản số (`DOCUMENT`) | ✅ PASS |
| 25 | **AI Q&A Engine** | Nhận diện chính xác ý định hỏi về sự kiện dòng họ (`EVENT_INFO`) | ✅ PASS |
| 26 | **AI Q&A Engine** | Cung cấp thông tin ngày giờ, địa điểm các sự kiện lớn (Lễ giỗ tổ) | ✅ PASS |
| 27 | **AI Q&A Engine** | Cung cấp danh sách người phụ trách và thành viên tham gia sự kiện | ✅ PASS |
| 28 | **AI Q&A Engine** | Nhận diện chính xác ý định yêu cầu thống kê (`STATISTICS_SUMMARY`) | ✅ PASS |
| 29 | **AI Q&A Engine** | Báo cáo chính xác tổng số thành viên và số thế hệ hiện diện | ✅ PASS |
| 30 | **Recommendations** | Tạo danh sách đề xuất kết nối con cháu cùng ngành nghề thành công | ✅ PASS |
| 31 | **Recommendations** | Tạo danh sách gợi ý sự kiện sắp diễn ra để nhắc nhở con cháu | ✅ PASS |
| 32 | **Recommendations** | Đề xuất danh mục tài liệu di sản tiêu biểu để giáo dục truyền thống | ✅ PASS |
| 33 | **Recommendations** | Tóm tắt nội dung văn bản phả ký dài thành các ý cô đọng | ✅ PASS |
| 34 | **Recommendations** | Trích xuất danh sách các điểm then chốt (Key Points) thành công | ✅ PASS |

---

#### 3.3. Bộ kiểm thử Nghiệp vụ Cộng đồng, Sự kiện & Di sản (`backend/tests/modules.test.ts`)
- **Lệnh thực thi:** `cd backend && npm run test:modules`
- **Kết quả:** 25/25 tests PASSED (100%)

| STT | Phân hệ nghiệp vụ | Tên ca kiểm thử (Test Case) | Trạng thái |
| :-: | :--- | :--- | :---: |
| 1 | **Community Posts** | Tạo bài viết chia sẻ tin tức trên bảng tin cộng đồng thành công | ✅ PASS |
| 2 | **Community Posts** | Bài viết được gắn cờ Thông báo chính thức của dòng họ (`is_announcement = true`) | ✅ PASS |
| 3 | **Community Posts** | Trạng thái hiển thị bài viết mặc định là `ACTIVE` | ✅ PASS |
| 4 | **Community Posts** | Thêm bình luận tương tác dưới bài viết thành công | ✅ PASS |
| 5 | **Community Posts** | Nội dung bình luận hiển thị chính xác và toàn vẹn dữ liệu | ✅ PASS |
| 6 | **Community Posts** | Ghi nhận phản ứng cảm xúc từ 2 thành viên khác nhau trên cùng bài viết | ✅ PASS |
| 7 | **Community Posts** | Thả biểu tượng cảm xúc yêu thích (`HEART`) thành công | ✅ PASS |
| 8 | **Community Posts** | Cho phép người dùng cập nhật thay đổi loại cảm xúc đã thả | ✅ PASS |
| 9 | **Community Posts** | Điều hành viên chuyển trạng thái bài viết vi phạm sang `FLAGGED` | ✅ PASS |
| 10 | **Community Posts** | Khôi phục bài viết về trạng thái `ACTIVE` sau khi đã kiểm duyệt hợp lệ | ✅ PASS |
| 11 | **Events & RSVP** | Khởi tạo sự kiện ngày giỗ tổ tiên theo ngày Âm lịch thành công | ✅ PASS |
| 12 | **Events & RSVP** | Tiêu đề và mô tả kế hoạch tổ chức sự kiện hợp lệ | ✅ PASS |
| 13 | **Events & RSVP** | Ghi nhận 4 lượt xác nhận tham dự (RSVP) từ các gia đình thành viên | ✅ PASS |
| 14 | **Events & RSVP** | Tổng số phản hồi điểm danh chính xác là 4 lượt | ✅ PASS |
| 15 | **Events & RSVP** | Đếm chính xác số người xác nhận Chắc chắn tham gia (`GOING` = 2) | ✅ PASS |
| 16 | **Events & RSVP** | Đếm chính xác số người Có thể tham gia (`TENTATIVE` = 1) | ✅ PASS |
| 17 | **Events & RSVP** | Đếm chính xác số người Bận việc vắng mặt (`DECLINED` = 1) | ✅ PASS |
| 18 | **Events & RSVP** | Danh sách người tham gia hiển thị đầy đủ họ tên và email liên lạc | ✅ PASS |
| 19 | **Events & RSVP** | Cập nhật trạng thái tham dự thành công (số người `GOING` tăng lên 3) | ✅ PASS |
| 20 | **Heritage & Archives** | Lưu trữ hồ sơ tài liệu di sản văn hóa dòng họ thành công | ✅ PASS |
| 21 | **Heritage & Archives** | Phân loại chính xác tài liệu thuộc danh mục Quy ước / Gia quy | ✅ PASS |
| 22 | **Heritage & Archives** | Cập nhật tiêu đề và mô tả tài liệu di sản thành công | ✅ PASS |
| 23 | **Heritage & Archives** | Tổng hợp Bộ sưu tập ảnh (Photo Gallery) đa nguồn thành công | ✅ PASS |
| 24 | **Heritage & Archives** | Thư viện ảnh trích xuất thành công ảnh từ phân hệ Di sản | ✅ PASS |
| 25 | **Heritage & Archives** | Thư viện ảnh trích xuất thành công ảnh từ phân hệ Sự kiện giỗ chạp | ✅ PASS |

---

### 4. Tổng kết đánh giá chất lượng (Summary & Quality Conclusion)

- **Tổng số ca kiểm thử đã thực thi:** 73 ca test tự động.
- **Số ca kiểm thử thành công (PASS):** 73 / 73 (100%).
- **Số ca kiểm thử thất bại (FAIL):** 0 (0%).
- **Thời gian chạy toàn bộ kiểm thử:** $\approx 4.5$ giây.
- **Kết luận:** Hệ thống đạt độ ổn định cao, logic nghiệp vụ phân quyền an toàn, các giải thuật tính toán danh xưng họ tộc Việt Nam hoạt động chính xác tuyệt đối và sẵn sàng vận hành thực tế.
