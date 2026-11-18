# Software Requirement Specification (SRS)
## 2. System Actors (Các Tác Nhân Hệ Thống)

Hệ thống **FamilyConnect** định nghĩa 6 tác nhân chính tham gia tương tác với nền tảng, bao gồm 5 tác nhân con người và 1 tác nhân hệ thống tự động:

| STT | Tác nhân (Actor) | Tên tiếng Việt | Mô tả vai trò & Quyền hạn chính trong hệ thống |
| :-: | :--- | :--- | :--- |
| **1** | **System Administrator** | Quản trị viên Kỹ thuật | Phụ trách cấu hình hạ tầng kỹ thuật, quản lý danh sách tài khoản người dùng, thiết lập ma trận phân quyền RBAC, giám sát nhật ký kiểm toán hệ thống (`audit_logs`), quản lý sao lưu/khôi phục CSDL cục bộ và cấu hình các tham số môi trường (Port, Database URL, JWT Secret). |
| **2** | **Clan Leader / Council** | Trưởng họ / Ban liên lạc Gia tộc | Nắm giữ thẩm quyền tối cao đối với phả hệ dòng họ. Chịu trách nhiệm thẩm định và phê duyệt các đơn xin nhập họ, duyệt các nút liên kết thành viên mới vào cây gia phả chính thức, quản lý phân chia các chi phái, ban hành các thông cáo chính thức của họ tộc, vinh danh con cháu đỗ đạt và quản lý tủ sách di sản phả ký. |
| **3** | **Branch Leader** | Trưởng chi tộc | Đại diện quản lý và điều hành sinh hoạt trong phạm vi một chi phái (*nhánh họ*). Chịu trách nhiệm lên lịch giỗ chạp và họp mặt chi nhánh theo lịch Âm, phân công nhiệm vụ hiếu hỉ cho con cháu, theo dõi danh sách xác nhận tham dự (RSVP), kiểm duyệt bài viết và hình ảnh trong phạm vi chi họ của mình. |
| **4** | **Verified Family Member** | Thành viên chính thức | Con cháu đã được xác thực huyết thống và liên kết với một nút định danh trên cây phả hệ. Được toàn quyền khám phá cây gia phả tương tác, cập nhật hồ sơ cá nhân/nghề nghiệp, đăng bài chia sẻ, bình luận, điểm danh tham dự sự kiện giỗ, tra cứu danh bạ người thân và sử dụng Trợ lý AI để hỏi đáp phả ký, tính toán xưng hô thuần Việt. |
| **5** | **Prospective Member / Guest** | Khách / Người xin gia nhập họ | Người dùng mới đăng ký tài khoản chưa được xác minh huyết thống hoặc khách thăm quan. Chỉ được xem các trang giới thiệu cội nguồn công khai và được cung cấp biểu mẫu nộp hồ sơ xin nhập họ (khai báo cha mẹ, nhánh họ, tải minh chứng gia phả) gửi lên Hội đồng gia tộc xem xét phê duyệt. |
| **6** | **Local AI Agent** *(System Actor)* | Trợ lý Trí tuệ Nhân tạo Gia tộc | Tác nhân hệ thống chạy ngầm được vận hành bởi khung dịch vụ AI chuyên biệt (`FamilyAIService`). Tự động phân tích đồ thị gia phả để suy luận vai vế, bậc thế hệ và danh xưng chuẩn mực theo phong tục truyền thống; truy xuất tri thức phả ký ngữ nghĩa (RAG) để giải đáp thắc mắc của con cháu và gợi ý kết nối nghề nghiệp tương trợ trong dòng họ. |

---

### Ma trận mối quan hệ giữa Tác nhân và Quyền hạn cốt lõi:

```text
+------------------------+-----------+-----------+---------------+-----------------+-------------+
| Phân hệ nghiệp vụ      | Sys Admin | Trưởng họ | Trưởng chi    | Thành viên chính| Người mới   |
|                        |           | (Council) | (Branch Lead) | (Verified Mem)  | (Guest)     |
+------------------------+-----------+-----------+---------------+-----------------+-------------+
| Cấu hình kỹ thuật & DB |   Toàn quyền  |   Không   |     Không     |      Không      |    Không    |
| Duyệt nhập họ & Nút cây|   Không   |   Toàn quyền  | Trong phạm vi |      Đề xuất    |    Gửi đơn  |
| Biên tập Cây Gia Phả   |   Không   |   Toàn quyền  | Trong phạm vi |     Chỉ xem     |    Không    |
| Đăng thông cáo chính   |   Không   |   Toàn quyền  |     Không     |      Không      |    Không    |
| Quản lý Sự kiện & Giỗ  |   Không   |   Toàn quyền  | Trong phạm vi |      RSVP       |    Không    |
| Đăng bài & Chia sẻ ảnh |   Không   |    Có     |      Có       |       Có        |    Không    |
| Sử dụng Trợ lý AI      |    Có     |    Có     |      Có       |       Có        |   Giới hạn  |
| Xem Danh bạ & Di sản   |    Có     |    Có     |      Có       |       Có        |  Công khai  |
+------------------------+-----------+-----------+---------------+-----------------+-------------+
```
