# 6. Configuration Management

### a. Document Management
Thay vì lưu trữ các tệp văn bản Word rời rạc dễ gây xung đột phiên bản, dự án áp dụng phương pháp **Docs-as-Code** kết hợp không gian làm việc số:

- **Tài liệu kỹ thuật nội bộ (Internal Technical Docs):**
  - Các tài liệu đặc tả API (Swagger/OpenAPI), tài liệu kiến trúc, lược đồ CSDL và hướng dẫn chạy cục bộ được viết bằng định dạng **Markdown** và lưu trực tiếp trong thư mục `/docs` của mã nguồn.
  - Mọi thay đổi trong tài liệu được kiểm soát phiên bản qua Git commit tương tự như mã nguồn.

- **Tài liệu bàn giao học thuật (Formal Academic Deliverables):**
  - Các báo cáo chính thức gửi Hội đồng (PMP, SRS, SDD, Final Report) được soạn thảo trên nền tảng **Google Docs** và chia sẻ nội bộ.
  - **Cơ chế gắn tag phiên bản (Semantic Document Tagging):** Áp dụng quy tắc `MAJOR.MINOR.PATCH`:
    - `v0.x.x`: Các bản thảo trong quá trình phân tích Sprint 1–2.
    - `v1.0.0`: Bản chốt nộp cuối tuần 3 (SRS & Architecture Baseline).
    - `v2.0.0`: Báo cáo nghiệm thu hoàn chỉnh tại tuần 6.

---

### b. Source Code Management

```text
[main]   ──────────────────────────────────────────●
            \                                    /
[feat/*]     ●──────────────● (Pull Request + Peer Review)
```

#### 1. Phân cấp nhánh (Branch Structure):
- `main` **(Protected Branch):** Nhánh chứa mã nguồn ổn định nhất, luôn ở trạng thái sẵn sàng khởi chạy thành công trên máy tính bằng Docker. Nhánh này được khóa (Branch Protection Rule), nghiêm cấm commit trực tiếp và chỉ nhận code thông qua Pull Request.
- `feat/<tên-tính-năng>`: Nhánh làm việc ngắn ngày của từng lập trình viên (thời gian sống $\le 3$ ngày), ví dụ: `feat/family-tree-d3`, `feat/auth-jwt-local`, `feat/kinship-reasoning`.
- `fix/<mã-lỗi>`: Nhánh xử lý nhanh các bug phát hiện trong các buổi demo nội bộ (ví dụ: `fix/tree-cycle-validation`).

#### 2. Quy chuẩn thông điệp Commit (Conventional Commits 1.0):
```text
feat: add ancestor search endpoint
fix: prevent duplicate spouse relation in tree builder
perf: optimize pgvector similarity query threshold
chore: update local docker-compose for ollama memory limit
```

#### 3. Quy tắc kiểm duyệt mã nguồn (Peer Review Gate):
- Mỗi Pull Request (PR) phải đi kèm mô tả ngắn về thay đổi và ảnh chụp màn hình kiểm thử tại máy local.
- Yêu cầu tối thiểu **01 Approved Review** từ thành viên phụ trách mảng tương ứng trước khi thực hiện hành động *Squash and Merge*.

---

### c. Bảng công cụ & Cơ sở hạ tầng (Tools & Infrastructures)

| Category | Tools / Infrastructure | Notes |
| :--- | :--- | :--- |
| **Frontend Web Portal** | Next.js 14/15, Tailwind CSS | Xây dựng giao diện web quản trị |
| **Tree Graph Visualization** | D3.js / SVG Hierarchy Canvas | Dựng sơ đồ phả hệ tương tác trực quan |
| **Backend Framework** | Java Spring Boot 3.x | Xây dựng RESTful API xử lý nghiệp vụ lõi |
| **Relational Database** | PostgreSQL 16 | Lưu trữ dữ liệu cấu trúc thành viên & quan hệ |
| **Vector Storage (RAG)** | PostgreSQL with pgvector extension | Lưu trữ vector embeddings phả ký gia tộc |
| **Local AI Engine** | LMstudio ( Qwen2.5-7B-Instruct ) | Mô hình ngôn ngữ lớn chạy cục bộ trên Localhost |
| **Container & Runtime** | Docker Desktop, Docker Compose | Đóng gói và chạy toàn bộ giải pháp tại Local |
| **IDEs / Code Editors** | Visual Studio Code, IntelliJ IDEA Ultimate | Môi trường lập trình chính của các thành viên |
| **Diagramming Tools** | Flowchart Maker, Database Diagram Tool, Figma | Thiết kế luồng, ERD, Class/Sequence Diagrams |
| **Documentation Tools** | Google Docs, Google Sheets, MS Office | Soạn thảo báo cáo, biểu mẫu và kế hoạch |
| **Version Control** | Git, GitHub | Quản lý mã nguồn, Pull Request và sao lưu tài liệu |
| **Project Management** | GitHub Projects (Kanban Board) | Quản lý task, phân công WBS và theo dõi tiến độ |
| **API Testing Tools** | Swagger / OpenAPI | Kiểm thử endpoint và xuất tài liệu đặc tả API |
