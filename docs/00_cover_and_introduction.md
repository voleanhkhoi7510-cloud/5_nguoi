# Project Report
## I. Project Introduction

### 1. Overview

#### 1.1. Project Information
- **Tên project:** FamilyConnect: AI-powered Digital Family Community Platform
- **Tên nhóm:** 5_nguoi
- **Kiểu phần mềm:** Web App

#### 1.2. Thành viên nhóm
| NAME | EMAIL |
| :--- | :--- |
| Võ Lê Anh Khôi | khoivla792254@ut.edu.vn |
| Phan Thanh Bình | |
| Trần Quang Huy | |
| Lê Võ Tuấn Hùng | |

---

### 2. Project Background
Trong bối cảnh hội nhập và toàn cầu hóa, cấu trúc gia đình truyền thống đang trải qua những thay đổi sâu sắc. Các cơ hội giáo dục, nghề nghiệp và sự dịch chuyển dân cư đã khiến các thành viên trong cùng một gia đình, dòng họ ngày càng phân tán về mặt địa lý. Hệ quả tất yếu là tần suất giao tiếp trực tiếp giảm sút, việc duy trì và cập nhật gia phả gặp nhiều khó khăn. Đặc biệt, thế hệ trẻ hiện nay có ít cơ hội được tiếp xúc, tìm hiểu về di sản gia tộc, dẫn đến sự lỏng lẻo trong các mối quan hệ họ hàng và nguy cơ phai nhạt bản sắc, cội nguồn.

Sự bùng nổ của công nghệ Trí tuệ nhân tạo và xử lý dữ liệu ngữ nghĩa đã mở ra cơ hội mới. AI không chỉ có thể số hóa thông tin mà còn đóng vai trò như một "trợ lý gia tộc", giúp giải thích các mối quan hệ họ hàng phức tạp (cách xưng hô), tìm kiếm thông minh các tài liệu lịch sử, tóm tắt tiểu sử của các nhân vật tiêu biểu và đề xuất những thông tin kết nối phù hợp giữa các thành viên.

---

### 3. Các hệ thống hiện có

#### a. Gramps
- **Mô tả:** Là phần mềm mã nguồn mở số 1 về quản lý phả hệ chạy offline trên máy tính.
- **Hạn chế:** Giao diện rất cũ, giống phần mềm kế toán, thiếu hoàn toàn các tính năng mạng xã hội cộng đồng, không có AI, khó sử dụng với người không chuyên.

#### b. Webtrees
- **Mô tả:** Nền tảng phả hệ mã nguồn mở tự lưu trữ (self-hosted) trên nền web.
- **Hạn chế:** Chủ yếu chỉ tập trung hiển thị cây gia phả và dữ liệu tĩnh (GEDCOM), không có tính năng tương tác sự kiện, không có trợ lý AI ngữ nghĩa.

#### c. MyHeritage / Ancestry / FamilySearch
- **Mô tả:** Các "ông lớn" trong ngành gia phả học, có tích hợp AI (ví dụ: phục chế ảnh, tìm người thân qua DNA, gợi ý tài liệu).
- **Hạn chế:** Chạy trên Cloud (không đảm bảo tính riêng tư tuyệt đối cho dữ liệu cá nhân nhạy cảm của gia tộc), chi phí thuê bao cao, thiên về tìm kiếm tổ tiên trong quá khứ hơn là kết nối, tương tác cộng đồng hàng ngày.

#### d. FamilyWall / 23snaps / Kinzoo
- **Mô tả:** Tập trung vào các tính năng như mạng xã hội thu nhỏ: lịch chung, danh sách việc làm, chia sẻ ảnh, nhắn tin riêng tư.
- **Hạn chế:** Hoàn toàn không có cây gia phả (Genealogy Tree), thiếu kho lưu trữ di sản thế hệ, không có trợ lý AI và dữ liệu bị phụ thuộc vào máy chủ của nhà phát hành (Cloud).

---

### 4. Cơ hội kinh doanh
Hiện nay, để duy trì liên lạc, các gia đình thường phụ thuộc vào các mạng xã hội phổ biến (như Zalo, Facebook). Tuy nhiên, các nền tảng này được thiết kế cho giao tiếp đại chúng, hoàn toàn thiếu vắng các tính năng chuyên biệt để lưu trữ gia phả, tổ chức dữ liệu dòng họ hay lưu truyền di sản lâu dài. 

Ngược lại, các phần mềm quản lý gia phả truyền thống lại quá khô khan, chủ yếu tập trung vào việc ghi chép thông tin phả hệ một chiều (static information) mà thiếu đi hệ sinh thái cộng đồng để các thành viên tương tác, chia sẻ tin tức hay tổ chức sự kiện. Các hệ thống này chưa tạo ra được "động lực" để các thế hệ, đặc biệt là người trẻ, chủ động tham gia.

---

### 5. Tầm nhìn của dự án
Tầm nhìn của dự án **FamilyConnect** là trở thành nền tảng công nghệ tiên phong trong việc số hóa di sản và kết nối cộng đồng gia tộc, nơi công nghệ AI hiện đại giao thoa với các giá trị truyền thống trên nền tảng bảo mật tuyệt đối.

Tầm nhìn chiến lược này được định hình qua 4 trụ cột chính:
1. **Bảo tồn di sản sống (Living Heritage):** Chuyển đổi gia phả từ các cuốn sổ giấy hay dữ liệu tĩnh thành một "di sản số sống động". Nơi lưu giữ trọn vẹn lịch sử, hình ảnh, video và câu chuyện của nhiều thế hệ, giúp di sản gia tộc không bị phai mờ theo thời gian.
2. **Thu hẹp khoảng cách thế hệ nhờ AI:** Biến AI thành "người truyền ngôn gia tộc", giúp thế hệ trẻ tiếp cận lịch sử dòng họ một cách tự nhiên và thú vị qua các tính năng truy vấn ngữ nghĩa, giải thích mối quan hệ xưng hô và gợi ý kết nối dựa trên sở thích, nghề nghiệp.
3. **Chuẩn mực mới về Tự chủ Dữ liệu (Data Sovereignty):** Định hình xu hướng sử dụng "Máy chủ gia đình" (Home Server), chứng minh rằng một ứng dụng thông minh, hiện đại hoàn toàn có thể vận hành cục bộ (Local-first) mà không cần đánh đổi quyền riêng tư hay phụ thuộc vào các tập đoàn công nghệ bên thứ ba.
4. **Xây dựng Hệ sinh thái Dòng họ vững mạnh:** Mở rộng vai trò từ một ứng dụng gia phả thành mạng lưới hỗ trợ lẫn nhau trong dòng họ — từ tổ chức sự kiện, quỹ học bổng, đến kết nối cơ hội nghề nghiệp và kinh doanh giữa các thành viên, tạo tiền đề cho sự phát triển bền vững của toàn gia tộc.

---

### 6. Phạm vi và hạn chế của dự án

#### a. Các tính năng chính
- **FE1. User & Authentication:** Đăng ký, đăng nhập JWT, xác thực thành viên họ tộc.
- **FE2. Family Tree & Genealogy:** Cây gia phả tương tác đa thế hệ, tra cứu xưng hô họ tộc.
- **FE3. Community & Newsfeed:** Bảng tin gia tộc, chia sẻ thông báo, bài viết, bình luận, tương tác.
- **FE4. Event & Milestone Management:** Tạo lịch họp họ, giỗ chạp, quản lý người tham dự (RSVP), nhắc nhở.
- **FE5. Family Directory & Mutual Aid:** Danh bạ người thân, nghề nghiệp, nơi ở, hỗ trợ hướng nghiệp.
- **FE6. Family Heritage & Digital Archives:** Tủ sách truyền thống, ghi chép tiểu sử cụ tổ, tư liệu lịch sử.
- **FE7. AI-powered Assistant:** Trợ lý AI giải thích mối quan hệ họ hàng phức tạp, tìm kiếm ngữ nghĩa thông tin gia phả, tóm tắt sự kiện dòng họ.
- **FE8. Dashboard & Analytics:** Thống kê nhân khẩu học gia tộc (độ tuổi, phân bố địa lý, tăng trưởng).
- **FE9. System Administration:** Phân quyền Trưởng họ, Trưởng chi, Thành viên; kiểm duyệt nội dung.

#### b. Các hạn chế
- Vận hành trên môi trường mạng nội bộ / Localhost để đảm bảo bảo mật dữ liệu riêng tư.
- Khả năng xử lý của mô hình AI phụ thuộc vào cấu hình tài nguyên phần cứng máy chủ cục bộ (RAM, CPU/GPU).
