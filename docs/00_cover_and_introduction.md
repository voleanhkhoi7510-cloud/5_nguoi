# Project Report: FamilyConnect
## I. Project Introduction

### 1. Overview

#### 1.1. Project Information
- **Tên project:** FamilyConnect: AI-powered Digital Family Community Platform
- **Mã định danh dự án:** FC-2026
- **Tên nhóm:** 5_nguoi
- **Kiểu phần mềm:** Web Application (Single Page Application & RESTful API Architecture)
- **Công nghệ nền tảng:** React 19, Vite, TypeScript, Node.js, Express 5, Prisma ORM, PostgreSQL 16, React Flow, Local AI Engine.
- **Môi trường vận hành:** Localhost / Mạng nội bộ (Intranet On-Premise) - Đảm bảo tự chủ dữ liệu (Data Sovereignty) và bảo mật gia tộc.

#### 1.2. Thành viên nhóm và phân công vai trò
| STT | Họ và Tên | Email | Vai trò chính | Nhiệm vụ đảm nhiệm |
| :-: | :--- | :--- | :--- | :--- |
| 1 | **Võ Lê Anh Khôi** | khoivla792254@ut.edu.vn | Leader / Fullstack Engineer | Quản trị dự án, thiết kế kiến trúc hệ thống, phát triển Backend API, tích hợp CSDL PostgreSQL & Prisma ORM. |
| 2 | **Phan Thanh Bình** | binhpt.fc@gmail.com | Frontend Lead / UI-UX | Phát triển cổng giao diện React 19, thiết kế canvas Cây gia phả tương tác với React Flow, Responsive layout. |
| 3 | **Trần Quang Huy** | huytq.fc@gmail.com | AI & Algorithm Engineer | Nghiên cứu & xây dựng động cơ đồ thị phả hệ, thuật toán BFS/LCA, bộ giải thuật xưng hô thuần Việt và công cụ RAG. |
| 4 | **Lê Võ Tuấn Hùng** | hunglvt.fc@gmail.com | Backend & QA Engineer | Xây dựng các module nghiệp vụ Cộng đồng, Sự kiện, Lịch giỗ Âm lịch, phân quyền RBAC và viết bộ kiểm thử tự động. |

---

### 2. Project Background (Bối cảnh dự án)
Trong bối cảnh hội nhập quốc tế và đô thị hóa nhanh chóng, cấu trúc gia đình truyền thống Việt Nam đang trải qua những biến chuyển sâu sắc. Cơ hội học tập, việc làm và sự dịch chuyển dân cư khiến con cháu trong cùng một gia đình, dòng họ ngày càng sinh sống phân tán tại nhiều tỉnh thành và quốc gia khác nhau. 

Hệ quả tất yếu dẫn đến:
- **Tần suất giao tiếp trực tiếp sụt giảm:** Con cháu ít có cơ hội gặp gỡ, thăm hỏi họ hàng ngoài các dịp lễ tết lớn.
- **Mai một dữ liệu phả hệ:** Gia phả giấy truyền thống dễ bị ẩm mốc, thất lạc, rách hỏng và rất khó để cập nhật kịp thời khi có thế hệ mới sinh ra hay di cư.
- **Khoảng cách thế hệ & Phai nhạt danh xưng:** Giới trẻ ngày nay gặp nhiều lúng túng trong hệ thống tôn ti trật tự gia tộc, không nắm rõ cách xưng hô chuẩn mực thuần Việt (ai là Bác, Chú, Cô, Cậu, Dì, Thím, Thím dâu, Anh/Em họ cành trên cành dưới).
- **Rủi ro rò rỉ quyền riêng tư trên mạng xã hội đại chúng:** Việc trao đổi thông tin phả ký, danh bạ, ảnh gia đình trên các mạng xã hội công cộng tiềm ẩn nguy cơ lộ lọt dữ liệu định danh cá nhân nhạy cảm.

Sự bùng nổ của công nghệ Trí tuệ Nhân tạo (AI) và biểu diễn tri thức đồ thị (Knowledge Graphs) mở ra cơ hội đột phá. **FamilyConnect** ra đời để kết hợp giữa giá trị cội nguồn văn hóa thiêng liêng và công nghệ phần mềm tiên tiến, tạo nên một hệ sinh thái số hóa gia phả, kết nối tình thân, tương trợ nghề nghiệp và bảo tồn văn hóa dòng tộc bền vững.

---

### 3. Đánh giá các hệ thống hiện có trên thị trường

| Tiêu chí so sánh | Gramps | Webtrees | MyHeritage / Ancestry | Mạng xã hội (Zalo/FB) | **FamilyConnect** |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Cây gia phả trực quan** | Có (Phức tạp) | Có (Cơ bản) | Có (Hiện đại) | Không có | **Có (React Flow mượt mà)** |
| **Hệ thống xưng hô thuần Việt** | Không | Không | Không | Không | **Có (Thuật toán BFS & LCA)** |
| **Trợ lý AI hỏi đáp phả ký** | Không | Không | Có (Đắt đỏ trên Cloud) | Không | **Có (Local RAG & Q&A)** |
| **Bản tin & Tương tác cộng đồng** | Không | Rất hạn chế | Hạn chế | Có (Không chuyên biệt) | **Có (Đầy đủ bài viết, RSVP, ảnh)** |
| **Lịch giỗ Âm lịch tự động** | Không | Hạn chế | Không | Không | **Có (Nhắc giỗ & phân công việc)** |
| **Bảo mật & Tự chủ dữ liệu** | Offline đơn máy | Self-hosted | Lưu trữ Đám mây công cộng | Đám mây công cộng | **Local-First / On-Premise hoàn toàn** |
| **Chi phí sử dụng** | Miễn phí | Miễn phí | Thu phí cao hàng tháng | Miễn phí | **Mã nguồn mở, tự triển khai** |

---

### 4. Cơ hội kinh doanh & Giá trị thực tiễn
1. **Giải quyết khoảng trống thị trường:** Các phần mềm gia phả truyền thống chỉ ghi chép thông tin phả hệ một chiều (dữ liệu tĩnh), trong khi các mạng xã hội hiện đại lại thiếu vắng cơ chế quản lý phả hệ và bảo mật gia tộc. FamilyConnect lấp đầy khoảng trống này bằng cách kiến tạo một nền tảng "Tất cả trong một" (All-in-One Family Hub).
2. **Thúc đẩy sự tham gia của thế hệ trẻ:** Giao diện trực quan hiện đại kết hợp với Trợ lý AI giải thích xưng hô và gợi ý kết nối nghề nghiệp tạo động lực mạnh mẽ để thanh niên trong họ chủ động tìm hiểu về cội nguồn.
3. **Mô hình triển khai linh hoạt:** Phù hợp với mọi quy mô từ gia đình nhỏ (tiểu gia đình), nhánh chi họ (vài chục hộ) cho đến các đại tộc lớn hàng nghìn thành viên trên khắp cả nước.

---

### 5. Tầm nhìn chiến lược của dự án (Vision)
Tầm nhìn của **FamilyConnect** là trở thành **Nền tảng số hóa di sản và mạng xã hội gia tộc số 1**, bảo tồn ký ức lịch sử của các dòng họ Việt Nam trên nền tảng công nghệ số bảo mật tuyệt đối.

Tầm nhìn được định hình qua 4 trụ cột cốt lõi:
1. **Di sản sống (Living Heritage):** Biến những trang phả ký Hán - Nôm hay sổ phả cũ thành cây gia phả tương tác sống động, đính kèm hình ảnh, tư liệu âm thanh, văn khấn và tiểu sử công đức của tổ tiên.
2. **Trợ lý gia tộc thông minh (Kinship AI Assistant):** Đưa AI thành "người giải nghĩa tôn ti họ tộc", tự động phân tích đồ thị quan hệ để chỉ ra mối quan hệ chính xác và đại từ xưng hô tôn kính theo lễ nghi truyền thống Việt Nam.
3. **Chủ quyền dữ liệu tuyệt đối (Data Sovereignty):** Triển khai mô hình Local-First / On-Premise, dữ liệu dòng họ được lưu trữ hoàn toàn trên máy chủ của gia đình, không chịu sự can thiệp hay phân tích dữ liệu từ các nền tảng mạng xã hội bên thứ ba.
4. **Hệ sinh thái tương trợ & gắn kết dòng tộc (Mutual Aid Network):** Không chỉ dừng lại ở việc xem phả hệ, FamilyConnect hỗ trợ kết nối tìm kiếm cơ hội việc làm, chia sẻ kinh nghiệm học tập, gây quỹ khuyến học và tổ chức ngày giỗ chạp trang nghiêm, thắt chặt tình đoàn kết thân tộc.

---

### 6. Phạm vi và Hạn chế của dự án (Scope & Limitations)

#### a. Các phân hệ chức năng chính (Core Features)
- **FE1. User & Authentication:** Đăng ký, đăng nhập JWT, phân quyền vai trò (Admin, Trưởng họ, Trưởng chi, Thành viên, Khách).
- **FE2. Family Tree & Genealogy:** Cây phả hệ tương tác đa thế hệ bằng React Flow, thuật toán chống chu trình vòng lặp quan hệ, quản lý quan hệ cha-con và hôn phối.
- **FE3. Community & Newsfeed:** Bản tin nội bộ họ tộc, thông cáo chính thức, chia sẻ khoảnh khắc kỷ niệm, bình luận và thả cảm xúc.
- **FE4. Event & Milestone Management:** Quản lý sự kiện giỗ tổ, giỗ chi phái theo lịch Âm, điểm danh và dự toán cỗ bàn qua tính năng xác nhận tham dự (RSVP).
- **FE5. Family Directory & Mutual Aid:** Danh bạ số hóa người thân đang sinh sống, tra cứu theo ngành nghề, học vấn để hỗ trợ hướng nghiệp và quỹ khuyến học.
- **FE6. Family Heritage & Digital Archives:** Tủ sách di sản số lưu trữ phả ký, hương ước cổ, tiểu sử danh nhân tiền bối và các bài văn khấn chuẩn mực.
- **FE7. AI-powered Kinship Assistant:** Trợ lý AI suy luận tôn ti trật tự, tính toán đại từ xưng hô thuần Việt (BFS/LCA), hỏi đáp tri thức gia đình và tóm tắt tiểu sử công đức.
- **FE8. Dashboard & Analytics:** Bảng điều khiển trực quan thống kê nhân khẩu học (tháp tuổi, phân bố giới tính, thế hệ, tăng trưởng dân số).
- **FE9. System Administration & Security:** Quản lý tài khoản, ma trận phân quyền RBAC, nhật ký kiểm toán hệ thống (Audit Logs) và sao lưu dữ liệu CSDL.

#### b. Giới hạn hệ thống (Limitations)
- Hệ thống ưu tiên vận hành trong môi trường mạng nội bộ (Localhost / Intranet / VPN riêng) để phục vụ tiêu chí bảo mật cục bộ cao nhất.
- Khả năng xử lý các mô hình ngôn ngữ lớn (LLM) phụ thuộc vào cấu hình phần cứng của máy chủ triển khai tại chỗ (khuyến nghị tối thiểu 8GB RAM, CPU từ 4 nhân hoặc có GPU hỗ trợ).
