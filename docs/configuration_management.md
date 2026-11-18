# 6. Configuration Management (Quản Lý Cấu Hình & Môi Trường)

### a. Quản lý Tài liệu kỹ thuật (Document Management)
Thay vì lưu trữ các tệp văn bản rời rạc dễ gây xung đột phiên bản, dự án áp dụng phương pháp **Docs-as-Code**:

- **Tài liệu kỹ thuật nội bộ (Internal Technical Docs):**
  - Các tài liệu đặc tả API (OpenAPI spec `backend/src/OpenAPI.yml`), tài liệu kiến trúc, lược đồ CSDL và hướng dẫn chạy cục bộ được viết bằng định dạng **Markdown** và lưu trực tiếp trong thư mục `/docs` của mã nguồn.
  - Mọi thay đổi trong tài liệu được kiểm soát phiên bản qua Git commit tương tự như mã nguồn.
  - Thư mục tài liệu bao gồm:
    - `/docs/00_cover_and_introduction.md`: Bìa báo cáo và giới thiệu dự án.
    - `/docs/product_overview.md`: Tổng quan sản phẩm và hạ tầng công nghệ.
    - `/docs/system_actors.md`: Danh mục tác nhân và ma trận quyền hạn.
    - `/docs/common_requirements.md`: Các yêu cầu kỹ thuật và phi chức năng chung.
    - `/docs/configuration_management.md`: Quy trình quản lý cấu hình và công cụ.
    - `/docs/requirement/`: Quy tắc nghiệp vụ (50 BRs), Use Cases (45 UCs), WBS & Dự toán nỗ lực, Bàn giao dự án.
    - `/docs/design/architecture/`: Kiến trúc hệ thống phân tầng và luồng màn hình chi tiết.
    - `/docs/design/database/`: Thiết kế CSDL quan hệ 17 bảng và từ điển dữ liệu.
    - `/docs/testing/`: Kế hoạch kiểm thử, kết quả 73 ca kiểm thử tự động đạt 100% PASS.

---

### b. Quản lý Mã nguồn (Source Code Management)

```text
[main]   ──────────────────────────────────────────● (Release v1.0.0)
            \                                    /
[feat/*]     ●──────────────●───────────────────● (Pull Request + Peer Review)
```

#### 1. Phân cấp nhánh (Branch Structure):
- `main` **(Protected Branch):** Nhánh chứa mã nguồn ổn định nhất, luôn ở trạng thái sẵn sàng khởi chạy thành công trên máy tính bằng `chay-tat-ca.bat` hoặc Docker Compose. Nhánh này được khóa (Branch Protection Rule), nghiêm cấm commit trực tiếp và chỉ nhận code thông qua Pull Request.
- `feat/<tên-tính-năng>`: Nhánh làm việc ngắn hạn của từng lập trình viên, ví dụ: `feat/genealogy-tree-reactflow`, `feat/auth-jwt-rbac`, `feat/ai-kinship-lca`, `feat/community-newsfeed`.
- `fix/<mã-lỗi>`: Nhánh xử lý nhanh các lỗi phát hiện trong quá trình kiểm thử (ví dụ: `fix/tree-cycle-validation`, `fix/cors-preflight`).

#### 2. Quy chuẩn thông điệp Commit (Conventional Commits 1.0):
```text
feat(genealogy): implement BFS shortest path and LCA algorithm
feat(rbac): add permission middleware for clan leader approval
fix(tree): prevent duplicate marriages between same member nodes
perf(db): optimize prisma queries with select projection
test(ai): add comprehensive test suite for vietnamese relationship calculation
chore(config): update environment configuration and startup scripts
```

#### 3. Quy tắc kiểm duyệt mã nguồn (Peer Review Gate):
- Mỗi Pull Request (PR) phải đi kèm mô tả ngắn về thay đổi và ảnh chụp màn hình kiểm thử tại máy local.
- Yêu cầu tối thiểu **01 Approved Review** từ thành viên phụ trách mảng tương ứng trước khi thực hiện hành động *Squash and Merge*.
- Bộ kiểm thử tự động (`npm test`) bắt buộc phải vượt qua 100% trước khi merge vào nhánh chính.

---

### c. Bảng công cụ & Cơ sở hạ tầng (Tools & Infrastructures)

| Phân loại (Category) | Công cụ / Hạ tầng (Tools / Infrastructure) | Ghi chú & Mục đích sử dụng |
| :--- | :--- | :--- |
| **Frontend Web Portal** | React 19, Vite, TypeScript, Tailwind CSS | Giao diện Single Page Application hiện đại, tốc độ phản hồi cực nhanh |
| **Tree Visualization** | React Flow (`reactflow ^11.11.4`) | Dựng sơ đồ phả hệ tương tác trực quan kéo thả, zoom pan, phân màu thế hệ |
| **Routing & Navigation** | React Router DOM v7 | Điều hướng trang mượt mà không reload trang |
| **Icons Library** | Lucide React (`lucide-react`) | Bộ biểu tượng đồ họa hiện đại chuẩn giao diện gia đình số |
| **Backend Framework** | Node.js (ES Modules), Express 5, TypeScript | Xây dựng RESTful API xử lý nghiệp vụ lõi, bảo mật phân quyền RBAC |
| **ORM & Database Client** | Prisma ORM 6 (`@prisma/client`, `prisma`) | Ánh xạ CSDL kiểu dữ liệu an toàn, quản lý migrations tự động |
| **Relational Database** | PostgreSQL 16 | Lưu trữ dữ liệu cấu trúc 17 bảng (thành viên, quan hệ, bài viết, sự kiện) |
| **Local AI Engine** | Module `AI/` (TypeScript), BFS/LCA/RAG | Khung AI độc lập: giải thuật đồ thị, suy luận xưng hô thuần Việt, RAG |
| **Authentication & Crypto** | JSON Web Token (`jsonwebtoken`), `bcrypt` | Cấp phiên làm việc Bearer Token và băm mật khẩu chuẩn công nghiệp |
| **Testing Framework** | `tsx` runner, Custom Assertions Test Suite | Bộ kiểm thử tự động 73 ca test (RBAC, AI, Modules) không cần external server |
| **Automation Startup** | Batch Script (`chay-tat-ca.bat`) | Kịch bản 1-chạm tự động khởi chạy song song Backend (Port 3000) và Frontend (Port 5173) |
| **IDEs / Code Editors** | Visual Studio Code, Cursor | Môi trường lập trình chính của các thành viên |
| **Version Control** | Git, GitHub | Quản lý mã nguồn, Pull Request và theo dõi lịch sử commit |
| **API Specification** | OpenAPI 3.0 (`backend/src/OpenAPI.yml`) | Đặc tả chi tiết toàn bộ endpoint và định dạng dữ liệu API |
