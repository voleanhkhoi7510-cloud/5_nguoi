# 🧠 FamilyConnect AI Service

Khung dịch vụ AI chuyên biệt cho nền tảng Gia đình số & Gia phả trực tuyến **FamilyConnect**, được thiết kế theo kiến trúc module hoá độc lập, đặt riêng trong thư mục `AI/`.

---

## 🌟 Tính năng chính

1. **Khung AI Service & Cơ chế truy xuất dữ liệu thử nghiệm (Hybrid Data Connector)**:
   - Tự động nạp dữ liệu gia phả 4 thế hệ, sự kiện, di sản và bài viết mẫu.
   - Hỗ trợ kết nối liền mạch với cơ sở dữ liệu PostgreSQL qua Prisma và tự động fallback sang In-Memory Mock Store khi chạy kiểm thử độc lập.
2. **AI Q&A nguyên mẫu (Family Knowledge Q&A Engine)**:
   - Nhận diện ý định thông minh (Hỏi về quan hệ phả hệ, thông tin cá nhân, di sản gia quy, sự kiện, thống kê dòng tộc).
   - Truy xuất tri thức ngữ nghĩa (Retrieval-Augmented Generation - RAG) và sinh câu trả lời kính cẩn, chính xác, có dẫn chứng nguồn minh bạch.
   - Hỗ trợ lưu lịch sử hội thoại nhiều lượt (Multi-turn Conversation Context).
3. **Đồ thị phả hệ & Xưng hô Việt Nam chuẩn mực (Relationship Graph Engine)**:
   - Thuật toán tìm đường đi ngắn nhất (BFS) trên đồ thị gia phả.
   - Thuật toán tìm Tổ tiên chung gần nhất (LCA - Lowest Common Ancestor).
   - Tự động tính toán vai vế, bậc thế hệ và danh xưng chuẩn mực theo phong tục truyền thống Việt Nam: Cụ, Ông/Bà (Nội/Ngoại), Bác, Chú, Cô, Cậu, Dì, Anh/Chị/Em (ruột, họ), Con, Cháu (Nội/Ngoại), Chắt.
4. **AI Recommendation & Semantic Search**:
   - Gợi ý kết nối con cháu cùng ngành nghề, cùng thế hệ.
   - Nhắc nhở sự kiện giỗ tổ, ngày hội khuyến học và giới thiệu tài liệu di sản quý giá.

---

## 📂 Cấu trúc thư mục

```
AI/
├── package.json               # Cấu hình package, scripts test và build
├── tsconfig.json              # Cấu hình TypeScript NodeNext
├── README.md                  # Tài liệu hướng dẫn AI Service
├── src/
│   ├── types/index.ts         # Khai báo kiểu dữ liệu phả hệ, đồ thị, Q&A
│   ├── mockData.ts            # Dữ liệu thử nghiệm phong phú 4 thế hệ dòng họ Nguyễn
│   ├── dataConnector.ts       # Cơ chế kết nối dữ liệu (Database + Mock Store)
│   ├── relationshipGraph.ts   # Động cơ duyệt đồ thị, LCA và giải thuật xưng hô
│   ├── knowledgeRetrieval.ts  # Cơ chế truy xuất tri thức và Semantic Search
│   ├── qaEngine.ts            # Khung AI Q&A nguyên mẫu RAG
│   ├── recommendationService.ts # Gợi ý kết nối thông minh
│   └── index.ts               # Entrypoint & Lớp mặt tiền FamilyAIService
└── tests/
    └── ai.test.ts             # Bộ kiểm thử tự động toàn diện AI & Cây gia phả
```

---

## 🧪 Chạy Kiểm thử AI Service

Từ thư mục gốc dự án hoặc thư mục `AI`:
```bash
npx tsx AI/tests/ai.test.ts
```
