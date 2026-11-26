# Bảng Kiểm Tra Tiến Độ & Nghiệm Thu Dự Án (Project Checklist)
## Dự án: FamilyConnect - AI-powered Digital Family Community Platform

> Bảng checklist này tổng hợp toàn diện các hạng mục từ khâu **Tài liệu học thuật**, **Hạ tầng & Cấu hình**, **9 Phân hệ chức năng**, **Kiểm thử tự động**, cho đến **Chuẩn bị nghiệm thu/bảo vệ đồ án**.

---

## 📑 PHẦN 1: HỒ SƠ TÀI LIỆU DỰ ÁN (DOCUMENTATION CHECKLIST)

- [x] **1.1. Bìa báo cáo & Giới thiệu tổng quan (`docs/00_cover_and_introduction.md`)**
  - [x] Thông tin dự án, mã định danh FC-2026, tên nhóm 5_nguoi.
  - [x] Bảng phân công nhiệm vụ và email 4 thành viên (Anh Khôi, Thanh Bình, Quang Huy, Tuấn Hùng).
  - [x] Bối cảnh thực tiễn, phân tích nhu cầu số hóa gia phả gia tộc.
  - [x] Bảng đối sánh chi tiết 5 hệ thống trên thị trường (Gramps, Webtrees, MyHeritage, Mạng xã hội, FamilyConnect).
  - [x] 4 trụ cột tầm nhìn chiến lược & cơ hội kinh doanh.
- [x] **1.2. Tổng quan sản phẩm & Nền tảng kỹ thuật (`docs/product_overview.md`)**
  - [x] Kiến trúc Local-First / On-Premise bảo mật dữ liệu gia đình.
  - [x] Nền tảng Web App React 19, Vite, Tailwind CSS.
  - [x] Bộ dựng phả hệ tương tác React Flow đồ họa vector.
  - [x] Máy chủ ứng dụng Express 5 TypeScript và CSDL PostgreSQL 16 + Prisma ORM.
  - [x] Khung dịch vụ AI chuyên biệt `AI/`.
- [x] **1.3. Danh mục tác nhân hệ thống (`docs/system_actors.md`)**
  - [x] Định nghĩa 6 tác nhân: Sys Admin, Trưởng họ/Hội đồng, Trưởng chi, Thành viên chính thức, Khách, Local AI Agent.
  - [x] Ma trận phân định thẩm quyền thao tác trên từng phân hệ nghiệp vụ.
- [x] **1.4. Yêu cầu chung CR-01 đến CR-10 (`docs/common_requirements.md`)**
  - [x] CR-01: Kiểm thực dữ liệu đầu vào (Validation 2 phía Client & Server).
  - [x] CR-02: Định dạng chuẩn (Email, SĐT 10 số, Dương lịch, Âm lịch can chi, Tiền tệ VND).
  - [x] CR-03: Xác thực Bearer JWT & Phân quyền bảo mật RBAC.
  - [x] CR-04: Nhật ký kiểm toán hệ thống `audit_logs` truy vết IP, thay đổi.
  - [x] CR-05: Sinh mã định danh tự động (`MB-`, `BR-`, `EV-`, `CLM-`, `ANN-`).
  - [x] CR-06: Đóng gói phản hồi và xử lý lỗi tập trung chuẩn hóa JSON.
  - [x] CR-07: Kiểm soát cập nhật đồng thời (Concurrency Control).
  - [x] CR-08: Kiểm soát định dạng tệp tải lên (ảnh <= 10MB, PDF <= 50MB, UUID hash).
  - [x] CR-09: Cơ chế dự phòng AI (Timeout 30s, Fallback In-Memory Mock).
  - [x] CR-10: Thiết kế đáp ứng (Responsive Layout) & khả năng tiếp cận người cao tuổi.
- [x] **1.5. Quản lý cấu hình & Quy chuẩn Git (`docs/configuration_management.md`)**
  - [x] Quy trình Docs-as-Code.
  - [x] Cấu trúc phân nhánh `main`, `feat/*`, `fix/*`.
  - [x] Quy chuẩn thông điệp Conventional Commits 1.0.
  - [x] Bảng danh mục công cụ, thư viện và hạ tầng kỹ thuật thực tế.
- [x] **1.6. Quy tắc nghiệp vụ (`docs/requirement/business_rules.md`)**
  - [x] Đầy đủ 50 quy tắc nghiệp vụ (**BR-01** đến **BR-50**) thuộc 9 nhóm logic.
  - [x] Ràng buộc tuổi phụ mẫu (>= 15 năm), hôn nhân đơn vị thời gian, kế thừa chi phái, thứ bậc ưu tiên hơn tuổi tác, cành trên cành dưới.
- [x] **1.7. Danh mục ca sử dụng (`docs/requirement/use_case_catalog.md`)**
  - [x] Đầy đủ 45 Use Cases (**UC-01** đến **UC-45**) bao phủ trọn vẹn các tác nhân.
- [x] **1.8. Bảng phân rã công việc WBS & Dự toán nỗ lực (`docs/requirement/scope_and_estimation_wbs.md`)**
  - [x] Chi tiết 9 phân hệ chức năng từ mục 1.1 đến 9.5.
  - [x] Đầy đủ cột Độ phức tạp (Complexity) và Ngày công (Man-days) cho từng mục con.
  - [x] Tổng nỗ lực toàn dự án khớp chuẩn: **118 Man-days**.
- [x] **1.9. Hạng mục bàn giao dự án (`docs/requirement/project_deliverables.md`)**
  - [x] 6 mốc bàn giao (Milestones 1 đến 6) gắn liền với mã nguồn và tài liệu tương ứng.
- [x] **1.10. Thiết kế kiến trúc phần mềm SDD (`docs/design/architecture/system_architecture.md`)**
  - [x] Kiến trúc phân tầng 3 lớp (Presentation, Application, Data Layer, AI Engine).
  - [x] Sơ đồ kiến trúc tổng thể ASCII chi tiết.
  - [x] Luồng dữ liệu tuần tự (Sequence Diagram) cho Tra cứu danh xưng AI và Xác thực JWT.
  - [x] Thiết kế bảo mật đa tầng (Bcrypt salt rounds 12, JWT stateless, RBAC matrix).
- [x] **1.11. Luồng màn hình chi tiết (`docs/design/architecture/screen_flows_Web_Application.md`)**
  - [x] Luồng màn hình Quản trị (38 màn hình) và Thành viên (29 màn hình) = 67 màn hình.
- [x] **1.12. Thiết kế Cơ sở dữ liệu (`docs/design/database/database_design.md`)**
  - [x] Sơ đồ thực thể liên kết ERD.
  - [x] Từ điển dữ liệu chi tiết 17 bảng quan hệ chuẩn hóa 3NF khớp với Prisma Schema.
- [x] **1.13. Kế hoạch & Báo cáo kiểm thử (`docs/testing/test_plan_and_reports.md`)**
  - [x] Báo cáo chi tiết 73 ca kiểm thử tự động đạt tỷ lệ thành công 100% PASS.
- [x] **1.14. Hướng dẫn khởi động & Sử dụng (`README.md`)**
  - [x] Hướng dẫn chạy 1-chạm `chay-tat-ca.bat`.
  - [x] Hướng dẫn cài đặt thủ công từng bước (DB, Backend, Frontend).
  - [x] Danh sách URL, tài khoản đăng nhập mẫu và mẹo sửa lỗi thường gặp.

---

## 💻 PHẦN 2: HẠ TẦNG & CẤU HÌNH MÃ NGUỒN (ENVIRONMENT & GIT CHECKLIST)

- [x] **2.1. Cấu hình môi trường máy tính:**
  - [x] Đã cài đặt Node.js (phiên bản `>= 18.x`, khuyến nghị 20.x LTS).
  - [x] Đã cài đặt PostgreSQL (phiên bản 15 hoặc 16) đang chạy dịch vụ tại cổng `5432`.
  - [x] Đã cài đặt Git trên máy tính.
- [x] **2.2. Tệp biến môi trường & Bảo mật:**
  - [x] Có tệp `backend/.env` chứa cấu hình kết nối DB và JWT Secret nội bộ.
  - [x] Có tệp mẫu an toàn `backend/.env.example` không chứa mật khẩu thật để đưa lên Git.
  - [x] Tệp gốc `.gitignore` đã chặn toàn bộ: `node_modules/`, `backend/.env`, `dist/`, `*.log`, `Thumbs.db`.
- [x] **2.3. Cơ sở dữ liệu & Prisma ORM:**
  - [x] File `backend/prisma/schema.prisma` định nghĩa chuẩn xác 17 bảng.
  - [x] Đã sinh Prisma Client thành công (`npx prisma generate`).
  - [x] Có sẵn tệp nạp dữ liệu mẫu `frontend/src/seed.sql` 4 thế hệ dòng họ Nguyễn.
- [x] **2.4. Quản lý mã nguồn trên GitHub:**
  - [x] Đã khởi tạo Git repository nội bộ và commit sạch toàn bộ mã nguồn.
  - [x] Đã liên kết remote `origin` với repository `https://github.com/voleanhkhoi7510-cloud/5_nguoi`.
  - [x] Đã đẩy nhánh `update-familyconnect-full` lên GitHub sẵn sàng tạo Pull Request vào `main`.

---

## 🧩 PHẦN 3: TRIỂN KHAI 9 PHÂN HỆ NGHIỆP VỤ (FUNCTIONAL MODULES CHECKLIST)

### 1. Phân hệ FE1: Xác thực & Người dùng (User & Authentication)
- [x] Đăng ký tài khoản người dùng mới với Email, Mật khẩu, Họ tên (`/dang-ky`).
- [x] Đăng nhập hệ thống, băm mật khẩu Bcrypt và cấp mã phiên Bearer JWT (`/dang-nhap`).
- [x] Điều hướng giao diện theo vai trò (Admin, Moderator, Member).
- [x] Xem và cập nhật thông tin hồ sơ cá nhân.
- [x] Cài đặt quyền riêng tư (ẩn/hiện số điện thoại, địa chỉ nhà riêng).
- [x] Middleware bảo vệ đường dẫn (Protected Routes) chặn người chưa đăng nhập.

### 2. Phân hệ FE2: Phả hệ & Cây Gia Phả (Family Tree & Genealogy)
- [x] Cây gia phả tương tác đa thế hệ xây dựng bằng **React Flow** (`/gia-pha`).
- [x] Hỗ trợ thu phóng (Zoom), kéo rê (Pan), căn chỉnh vị trí tự động (treeLayout).
- [x] Hiển thị màu sắc trực quan theo từng bậc thế hệ (Đời 1, 2, 3, 4).
- [x] Phân biệt rõ nhánh Trưởng và nhánh Thứ trong dòng tộc.
- [x] Hộp thoại xem chi tiết thông tin một người (ngày sinh, mất, mộ phần, tiểu sử).
- [x] Quản lý mối quan hệ Cha/Mẹ - Con cái (Parent-Child) (`/quan-he`).
- [x] Quản lý mối quan hệ Hôn phối (Vợ - Chồng).
- [x] Thuật toán kiểm tra chống chu trình vòng lặp quan hệ (Anti-Cycle DAG).

### 3. Phân hệ FE3: Cộng đồng & Bản tin (Community & Newsfeed)
- [x] Bản tin dòng họ hiển thị dòng thời gian bài viết (`/cong-dong`).
- [x] Soạn thảo và đăng bài viết mới kèm chia sẻ ảnh kỷ niệm.
- [x] Phân biệt bài viết thông thường và "Thông cáo chính thức của Hội đồng gia tộc".
- [x] Thảo luận, gửi bình luận dưới từng bài viết.
- [x] Thả biểu tượng cảm xúc tôn kính (*Thích, Trân trọng, Tưởng nhớ*).
- [x] Tính năng ẩn/kiểm duyệt bài viết vi phạm dành cho Ban liên lạc.

### 4. Phân hệ FE4: Sự kiện & Lịch giỗ Âm lịch (Events & Milestone Management)
- [x] Lịch giỗ Âm lịch kết hợp song song Dương lịch (`/su-kien`).
- [x] Khởi tạo sự kiện ngày kỵ nhật (ngày giỗ), họp mặt đầu xuân, đại hội gia tộc.
- [x] Xem chi tiết sự kiện: thời gian âm/dương, địa điểm từ đường, kế hoạch tổ chức.
- [x] Tính năng xác nhận tham dự (**RSVP**) thời gian thực: Điểm danh *Tham gia / Vắng mặt / Đi cùng gia đình*.
- [x] Nhập số lượng người lớn và trẻ em đi kèm để ban tổ chức dự toán mâm cỗ.
- [x] Phân công nhiệm vụ hiếu hỉ (nấu cỗ, hành lễ, tiếp tân) cho các thành viên.

### 5. Phân hệ FE5: Danh bạ & Khuyến học (Family Directory & Mutual Aid)
- [x] Danh bạ điện tử lưu trữ toàn bộ thành viên đang sinh sống (`/danh-ba`).
- [x] Tìm kiếm nhanh theo họ tên, bậc thế hệ, chi phái, tỉnh thành nơi cư trú.
- [x] Hồ sơ chuyên môn nghề nghiệp hỗ trợ kết nối hướng nghiệp cho con cháu.
- [x] Hồ sơ học vấn, vinh danh con em đỗ đạt thủ khoa, đại học.
- [x] Báo cáo thu chi Quỹ khuyến học và Quỹ tương trợ dòng họ minh bạch.

### 6. Phân hệ FE6: Di sản & Phả ký số (Family Heritage & Digital Archives)
- [x] Tủ sách số hóa tài liệu lịch sử gia tộc (`/di-san`).
- [x] Lưu trữ bản scan phả ký cổ, văn bia, hương ước chữ Hán - Nôm và bản dịch.
- [x] Bài viết tiểu sử công đức của cụ tổ tiền nhân và các bậc tiền bối ưu tú.
- [x] Tuyển tập các bài văn khấn cổ truyền chuẩn mực (văn khấn tết, giỗ, chạp họ).
- [x] Thư viện hình ảnh kỷ niệm dòng họ phân loại theo năm và sự kiện (`/anh`).

### 7. Phân hệ FE7: Trí tuệ Nhân tạo Gia tộc (AI-powered Assistant)
- [x] Khung dịch vụ AI chuyên biệt cấu trúc độc lập trong thư mục `AI/`.
- [x] **Thuật toán BFS:** Tìm đường đi ngắn nhất giữa 2 nút bất kỳ trên đồ thị phả hệ.
- [x] **Thuật toán LCA:** Tìm Tổ tiên chung gần nhất để xác định phân nhánh dòng họ.
- [x] **Suy luận danh xưng thuần Việt:** Tự động tính toán chuẩn xác cách xưng hô theo lễ nghi truyền thống Việt Nam (Cụ, Ông/Bà, Bác, Chú, Cô, Cậu, Dì, Anh/Chị/Em họ, Con, Cháu, Chắt) (`/tro-ly-ai`).
- [x] **Khung hỏi đáp RAG (Knowledge Q&A):** Trả lời câu hỏi về lịch sử gia đình, gia quy dòng họ, sự kiện và trích dẫn nguồn tài liệu minh bạch.
- [x] **Gợi ý kết nối thông minh:** Đề xuất con cháu cùng ngành nghề và tài liệu nổi bật.
- [x] **Cầu nối dữ liệu kép (Hybrid Data Connector):** Chạy trực tiếp với PostgreSQL/Prisma và tự động fallback sang In-Memory Mock Store khi test độc lập.

### 8. Phân hệ FE8: Báo cáo & Thống kê (Dashboard & Analytics)
- [x] Bảng điều khiển KPI trung tâm (`/`).
- [x] Thống kê tổng số thành viên, số thế hệ hiện diện, số chi nhánh gia tộc.
- [x] Biểu đồ phân tích nhân khẩu học: tháp độ tuổi, tỷ lệ nam/nữ, tỷ lệ còn sống/đã mất.
- [x] Báo cáo tỷ lệ điểm danh tham gia sự kiện giỗ chạp.

### 9. Phân hệ FE9: Quản trị Hệ thống & Bảo mật (System Administration & Security)
- [x] Quản trị danh sách tài khoản người dùng (`/bao-mat`).
- [x] Ma trận phân quyền đa cấp RBAC (Admin, Moderator, Member, Guest).
- [x] Tra cứu nhật ký kiểm toán hệ thống (`audit_logs`) ghi nhận IP, người thực hiện, thao tác và dữ liệu thay đổi.
- [x] Công cụ sao lưu và khôi phục CSDL cục bộ.

---

## 🧪 PHẦN 4: KIỂM THỬ TỰ ĐỘNG & ĐẢM BẢO CHẤT LƯỢNG (TESTING CHECKLIST)

- [x] **4.1. Bộ kiểm thử Phân quyền RBAC (`backend/tests/rbac.test.ts`):**
  - [x] Chạy lệnh: `npm run test:rbac` trong thư mục `backend`.
  - [x] Kết quả: **14/14 tests PASSED (100%)**.
  - [x] Đã kiểm thử: Quyền Admin, Moderator, Member, Middleware `requireRole`, `requirePermission`, Cấp bậc vai trò gia đình, Quyền sở hữu tài nguyên.
- [x] **4.2. Bộ kiểm thử Khung AI & Đồ thị Phả hệ (`AI/tests/ai.test.ts`):**
  - [x] Chạy lệnh: `npm run test:ai` trong thư mục `backend`.
  - [x] Kết quả: **34/34 tests PASSED (100%)**.
  - [x] Đã kiểm thử: Cây gia phả 4 thế hệ, Quan hệ hôn nhân & phụ mẫu, Thuật toán BFS & LCA, Hệ luật xưng hô thuần Việt (9 ca test xưng hô chuẩn mực), Tìm kiếm ngữ nghĩa, Động cơ RAG Q&A, Gợi ý kết nối & Tóm tắt văn bản.
- [x] **4.3. Bộ kiểm thử Nghiệp vụ Cộng đồng, Sự kiện & Di sản (`backend/tests/modules.test.ts`):**
  - [x] Chạy lệnh: `npm run test:modules` trong thư mục `backend`.
  - [x] Kết quả: **25/25 tests PASSED (100%)**.
  - [x] Đã kiểm thử: Vòng đời bài viết (tạo bài, thông báo, bình luận, cảm xúc, kiểm duyệt), Vòng đời sự kiện giỗ Âm lịch & điểm danh RSVP, Tủ sách di sản & Bộ sưu tập ảnh.
- [x] **4.4. Chạy toàn bộ kiểm thử hệ thống:**
  - [x] Chạy lệnh: `npm test` trong thư mục `backend`.
  - [x] Tổng số: **73/73 tests PASSED (100% tỷ lệ thành công)**, thời gian chạy dưới 5 giây.

---

