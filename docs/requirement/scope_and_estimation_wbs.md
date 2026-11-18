# Phạm vi và Ước tính Nỗ lực (Scope & Estimation WBS)

Bảng phân rã công việc (*Work Breakdown Structure - WBS*) và ước tính độ phức tạp, nỗ lực thực hiện theo ngày công (*Man-days*) cho toàn bộ 9 phân hệ chức năng của dự án **FamilyConnect**:

| Mã WBS | Hạng mục công việc (WBS Item) | Độ phức tạp (Complexity) | Ước tính nỗ lực (Est. Effort - Man-days) |
| :---: | :--- | :---: | :---: |
| **1** | **FE1. User & Authentication (Xác thực & Người dùng)** | **Medium** | **12** |
| 1.1 | Đăng ký tài khoản và xác thực phiên đăng nhập (JWT, Bcrypt) | Medium | 4 |
| 1.2 | Ma trận kiểm soát truy cập dựa trên vai trò (RBAC Middleware) | High | 3 |
| 1.3 | Quản lý thông tin hồ sơ cá nhân và cài đặt quyền riêng tư | Low | 2 |
| 1.4 | Cơ chế thẩm định và xác minh thành viên nhập họ | Medium | 3 |
| **2** | **FE2. Family Tree & Genealogy (Phả hệ & Cây Gia Phả)** | **High** | **25** |
| 2.1 | Quản lý thông tin tổng quan gia tộc và họ tộc | Low | 2 |
| 2.2 | Quản lý phân cấp chi phái và cành nhánh dòng họ | Medium | 3 |
| 2.3 | Quản lý mối quan hệ cha mẹ - con cái (Parent-Child) | Medium | 4 |
| 2.4 | Quản lý mối quan hệ hôn phối (Hôn nhân & Bạn đời) | Medium | 3 |
| 2.5 | Dựng cây gia phả tương tác đa thế hệ bằng React Flow | High | 6 |
| 2.6 | Trực quan hóa liên kết đồ thị, tự động căn chỉnh vị trí (Auto-layout) | High | 4 |
| 2.7 | Truy vấn quan hệ phả hệ & Thuật toán chống chu trình vòng lặp | High | 3 |
| **3** | **FE3. Community & Newsfeed (Cộng đồng & Bản tin)** | **Medium** | **14** |
| 3.1 | Khởi tạo, chỉnh sửa và quản lý bài viết bản tin | Medium | 3 |
| 3.2 | Chức năng bình luận và thả biểu tượng cảm xúc (Like, Heart, Pray) | Medium | 3 |
| 3.3 | Chia sẻ tin tức, sự kiện mừng hỷ, tin buồn trong dòng tộc | Low | 2 |
| 3.4 | Quản lý album ảnh, tải lên và chia sẻ hình ảnh đa phương tiện | Medium | 3 |
| 3.5 | Ban hành thông cáo chính thức của Hội đồng gia tộc & Ghim tin | Medium | 3 |
| **4** | **FE4. Event & Milestone Management (Sự kiện & Lịch giỗ Âm lịch)** | **Medium** | **14** |
| 4.1 | Khởi tạo sự kiện gia đình theo ngày Âm lịch (tự tính Dương lịch) | Medium | 4 |
| 4.2 | Quản lý xác nhận tham dự (RSVP) và số lượng người đi cùng | Medium | 3 |
| 4.3 | Quản lý người tham dự và phân công nhiệm vụ hiếu hỉ (nấu cỗ, tế lễ) | Medium | 3 |
| 4.4 | Lưu trữ tư liệu hình ảnh và bộ sưu tập kỷ niệm sau sự kiện | Low | 2 |
| 4.5 | Lên lịch nhắc nhở ngày giỗ tự động trước 7 ngày và 1 ngày | Low | 2 |
| **5** | **FE5. Family Directory & Mutual Aid (Danh bạ & Khuyến học)** | **Low** | **9** |
| 5.1 | Danh bạ điện tử thành viên còn sống, lọc theo chi nhánh, nơi ở | Low | 2 |
| 5.2 | Quản lý hồ sơ nghề nghiệp và chuyên môn công tác | Low | 2 |
| 5.3 | Quản lý hồ sơ học vấn, bảng vàng thành tích & Quỹ khuyến học | Medium | 2 |
| 5.4 | Tìm kiếm nâng cao thành viên theo nghề nghiệp, địa phương, thế hệ | Medium | 3 |
| **6** | **FE6. Family Heritage & Digital Archives (Di sản & Phả ký số)** | **Medium** | **10** |
| 6.1 | Quản lý tài liệu lịch sử, hương ước cổ và bản scan chữ Hán - Nôm | Medium | 3 |
| 6.2 | Lưu trữ truyện kể dòng họ, sự tích lập làng và nguồn gốc cội nguồn | Low | 2 |
| 6.3 | Biên soạn tiểu sử và tôn vinh công đức danh nhân tiền bối | Medium | 2 |
| 6.4 | Thư viện trưng bày hiện vật, nhà thờ tổ và văn bia | Low | 1 |
| 6.5 | Kho lưu trữ phả ký số hóa và tuyển tập văn khấn cổ truyền | Medium | 2 |
| **7** | **FE7. AI-powered Assistant (Trợ lý Trí tuệ Nhân tạo Gia tộc)** | **High** | **18** |
| 7.1 | Tìm kiếm ngữ nghĩa phả ký và tư liệu gia đình (Semantic Search) | High | 4 |
| 7.2 | Khung hỏi đáp tri thức gia đình (Family Knowledge Q&A Engine) | High | 4 |
| 7.3 | Động cơ phân tích đồ thị quan hệ & Suy luận danh xưng thuần Việt | High | 5 |
| 7.4 | Trích xuất ý chính và tóm tắt tiểu sử công đức qua AI | Medium | 2 |
| 7.5 | Gợi ý kết nối con cháu cùng ngành nghề và tài liệu liên quan | Medium | 3 |
| **8** | **FE8. Dashboard & Analytics (Báo cáo & Thống kê)** | **Medium** | **9** |
| 8.1 | Bảng chỉ số KPI tổng quan (tổng đinh, số thế hệ, chi họ) | Medium | 2 |
| 8.2 | Bảng theo dõi mức độ hoạt động và tương tác cộng đồng | Low | 2 |
| 8.3 | Thống kê số lượng tham gia sự kiện và tỷ lệ điểm danh RSVP | Low | 1 |
| 8.4 | Phân tích nhân khẩu học (tháp độ tuổi, tỷ lệ nam/nữ, nơi sinh sống) | Medium | 2 |
| 8.5 | Xuất báo cáo thống kê phục vụ đại hội gia tộc (Excel / PDF) | Medium | 2 |
| **9** | **FE9. System Administration & Security (Quản trị Hệ thống)** | **Medium** | **7** |
| 9.1 | Quản trị tài khoản người dùng, kích hoạt và khóa tài khoản | Medium | 2 |
| 9.2 | Kiểm duyệt nội dung bài viết, hình ảnh vi phạm thuần phong mỹ tục | Low | 1 |
| 9.3 | Quản lý nhật ký kiểm toán hệ thống (Audit Logging & Tracing) | Medium | 2 |
| 9.4 | Công cụ sao lưu và khôi phục dữ liệu CSDL PostgreSQL cục bộ | Medium | 1 |
| 9.5 | Cấu hình tham số hệ thống nội bộ (Port, JWT Secret, Local Storage) | Low | 1 |
| **TỔNG** | **Toàn bộ 9 phân hệ dự án FamilyConnect** | **--** | **118 Man-days** |
