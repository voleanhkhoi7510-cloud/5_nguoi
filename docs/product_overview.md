# Software Requirement Specification (SRS)
## 1. Product Overview (Tổng Quan Sản Phẩm)

Hệ thống **FamilyConnect** được định hướng và thiết kế tối ưu hóa cho mô hình triển khai độc lập trong mạng nội bộ (*Intranet / Localhost / Private Cloud*), triệt tiêu hoàn toàn rủi ro rò rỉ dữ liệu phả hệ nhạy cảm lên các dịch vụ đám mây công cộng bên thứ ba.

---

### a. Nền tảng ứng dụng (Application Platform)

- **Cổng giao diện người dùng & Không gian quản trị (Frontend Client):**
  - Xây dựng dưới dạng ứng dụng đơn trang hiện đại (*Single Page Application - SPA*) sử dụng **React 19**, **Vite** siêu tốc và **Tailwind CSS**.
  - Thiết kế đáp ứng đa thiết bị (*Responsive Web Design*), hỗ trợ tối ưu trên cả màn hình máy tính để bàn (quản trị cây gia phả, phân tích nhân khẩu học, nhập liệu sự kiện) và màn hình điện thoại thông minh, máy tính bảng (cho con cháu tra cứu danh bạ, đọc tin tức, nhận nhắc nhở giỗ chạp và hỏi đáp với Trợ lý AI).
  - Tích hợp thư viện biểu tượng hiện đại **Lucide React** và hệ thống thông báo trạng thái trực quan.

- **Bộ dựng cây gia phả đồ họa tương tác (Interactive Genealogy Canvas):**
  - Tích hợp bộ thư viện chuyên dụng **React Flow** (`reactflow ^11.11.4`), cho phép kết xuất (render) đồ thị phả hệ nhiều thế hệ dưới dạng SVG và Canvas độ phân giải cao.
  - Hỗ trợ đầy đủ các thao tác đồ họa: phóng to/thu nhỏ (Zoom), kéo rê (Pan), căn chỉnh vị trí tự động (Auto-layout), thu gọn nhánh thế hệ, đánh dấu cành Trưởng / cành Thứ bằng màu sắc sinh động và nhấp chọn từng nút để xem hồ sơ chi tiết.

- **Máy chủ ứng dụng & Xử lý nghiệp vụ (Backend Application Server):**
  - Phát triển trên nền tảng **Node.js** và **Express 5** với ngôn ngữ **TypeScript** mạnh mẽ, đảm bảo tính chặt chẽ về kiểu dữ liệu (Strict Type-Safety).
  - Kiến trúc phân lớp theo chuẩn RESTful API, cung cấp hệ thống endpoint phong phú phục vụ xác thực JWT, quản lý thành viên, xử lý bài viết bản tin, sự kiện, điểm danh RSVP và phân quyền RBAC đa cấp bậc.

---

### b. Khung dịch vụ Trí tuệ Nhân tạo Gia tộc (Family AI Service Engine)

- **Module AI độc lập (`AI/`):**
  - Được thiết kế theo mô hình module hoá cao, có thể nhúng trực tiếp vào Backend hoặc triển khai thành vi dịch vụ độc lập.
  - **Thuật toán đồ thị phả hệ chuyên sâu:** Sử dụng thuật toán tìm đường đi ngắn nhất (Breadth-First Search - BFS) và tìm Tổ tiên chung gần nhất (Lowest Common Ancestor - LCA) để phân tích cấu trúc cây phả hệ phức tạp.
  - **Động cơ suy luận danh xưng thuần Việt:** Áp dụng hệ luật văn hóa truyền thống Việt Nam để tính toán chính xác vai vế giữa 2 thành viên bất kỳ dựa trên thứ bậc thế hệ (Đời thứ mấy), nhánh Trưởng/Thứ và thứ tự sinh; đưa ra danh xưng chính xác: *Cụ, Ông/Bà (Nội/Ngoại), Bác, Chú, Cô, Cậu, Dì, Thím, Mợ, Dượng, Anh/Chị/Em (ruột, họ), Con, Cháu, Chắt*.
  - **Cơ chế truy xuất tri thức ngữ nghĩa (Hybrid Data Connector & RAG):** Hỗ trợ nạp dữ liệu trực tiếp từ PostgreSQL thông qua Prisma Client và tự động chuyển sang In-Memory Mock Store khi chạy kiểm thử độc lập; hỗ trợ hỏi đáp tri thức gia đình, tìm kiếm ngữ nghĩa văn bản phả ký và tóm tắt tiểu sử công đức.
  - **Gợi ý kết nối thông minh (AI Recommendations):** Phân tích nghề nghiệp, học vấn và sở thích để gợi ý kết nối hướng nghiệp giữa con cháu trong dòng tộc.

---

### c. Môi trường kết nối mạng (Network Connectivity)

- **Mạng cục bộ (Localhost / LAN / Intranet):**
  - Hệ thống có khả năng vận hành hoàn toàn offline, không phụ thuộc vào đường truyền Internet ra bên ngoài.
  - Toàn bộ giao tiếp giữa các thành phần (`Frontend React (Port 5173) ↔ Backend API (Port 3000) ↔ PostgreSQL Database (Port 5432) ↔ AI Service Module`) diễn ra an toàn qua giao thức TCP/IP nội bộ với độ trễ cực thấp.
  - Tích hợp kịch bản khởi động một chạm `chay-tat-ca.bat` cho môi trường Windows, tự động bật đồng thời cả Backend và Frontend chỉ bằng một cú nhấp đúp.

---

### d. Hạ tầng lưu trữ và quản trị cơ sở dữ liệu (Database Infrastructure)

- **Hệ quản trị CSDL quan hệ:** Sử dụng **PostgreSQL 16**, đảm bảo tính toàn vẹn dữ liệu giao dịch ACID cho thông tin phả hệ đa thế hệ.
- **Tầng ánh xạ đối tượng (ORM):** Ứng dụng **Prisma ORM 6** (`@prisma/client`), tự động sinh mã truy vấn TypeScript an toàn kiểu dữ liệu, quản lý lịch sử dịch chuyển lược đồ cơ sở dữ liệu (Prisma Migrations).
- **Cơ chế lưu trữ tài liệu & hình ảnh:** Lưu trữ tệp tin đa phương tiện trực tiếp trong hệ thống tệp cục bộ (`/uploads`) với cơ chế băm tên tệp UUID chống trùng lặp và kiểm soát định dạng tệp nghiêm ngặt.
- **Sẵn sàng mở rộng Vector Database:** Hỗ trợ kích hoạt tiện ích mở rộng `pgvector` trên PostgreSQL để lưu trữ và lập chỉ mục các vector embedding phục vụ tìm kiếm ngữ nghĩa chuyên sâu khi tích hợp các mô hình LLM cục bộ như Ollama.
