# Software Requirement Specification
## 1. Product Overview

Hệ thống được thiết kế tối ưu hóa cho mô hình triển khai độc lập trong mạng nội bộ (*Intranet / Localhost*), triệt tiêu hoàn toàn rủi ro bảo mật dữ liệu từ các dịch vụ máy chủ đám mây công cộng:

### a. Nền tảng ứng dụng (Platform)
- **Cổng quản trị Web & Giao diện thành viên:** Xây dựng dưới dạng ứng dụng Web đáp ứng đa thiết bị (*Responsive Web Application*) sử dụng công nghệ **Next.js (App Router)** và **Tailwind CSS**. Giao diện được tối ưu hóa cho cả màn hình máy tính cá nhân (phục vụ thao tác quản trị, biên tập cây gia phả chi tiết) lẫn thiết bị di động/máy tính bảng (phục vụ việc đọc bản tin, tra cứu danh bạ và theo dõi sự kiện).
- **Bộ dựng cây gia phả đồ họa:** Ứng dụng thư viện đồ thị hiện đại (`React Flow` / `D3.js`) chạy trên nền SVG và Canvas để render sơ đồ phả hệ nhiều tầng, hỗ trợ kéo thả, phóng to/thu nhỏ mượt mà mà không gây giật lag giao diện.

### b. Môi trường kết nối mạng (Connectivity)
- **Mạng cục bộ (Localhost / LAN):** Hệ thống có khả năng vận hành hoàn toàn offline, không phụ thuộc vào đường truyền Internet ra bên ngoài. Toàn bộ các kết nối nội bộ giữa `Giao diện ↔ Backend API ↔ Cơ sở dữ liệu ↔ Dịch vụ AI` đều giao tiếp qua cổng TCP cục bộ hoặc mạng ảo do Docker thiết lập.

### c. Hạ tầng thực thi cục bộ (Infrastructure)
- **Ảo hóa ứng dụng:** Toàn bộ hệ thống được container hóa thông qua **Docker & Docker Compose**, cho phép thiết lập và khởi chạy toàn bộ dịch vụ (Web, Backend, Database, AI) chỉ bằng một câu lệnh duy nhất trên máy tính.
- **Hệ quản trị CSDL:** Sử dụng **PostgreSQL 16** tích hợp phần mở rộng **`pgvector`**, vừa đảm bảo tính toàn vẹn dữ liệu giao dịch cho gia phả, vừa hỗ trợ đánh chỉ mục và truy vấn vector phục vụ tìm kiếm ngữ nghĩa.
- **Môi trường chạy AI:** Sử dụng **Ollama Engine** chạy trực tiếp trên tài nguyên phần cứng máy trạm nội bộ (tận dụng năng lực xử lý của CPU đa nhân hoặc GPU rời).
