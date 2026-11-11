#  Software Design Description (SDD)
##  System Architecture (Kiến trúc hệ thống)

###  Mô hình tổng thể (3-Tier Local-First Architecture)
Hệ thống **FamilyConnect** tuân thủ mô hình kiến trúc phân tầng 3 lớp (3-Tier Client-Server Architecture), được đóng gói hoàn toàn trong môi trường mạng nội bộ cục bộ (Localhost) thông qua Docker Compose:

```text
+-----------------------------------------------------------------------------------+
|                            CLIENT / PRESENTATION LAYER                            |
|    - Web Management Portal (Next.js 15, TailwindCSS, React Flow / D3.js Canvas)    |
|    - Responsive Mobile View (Touch-optimized PWA / Responsive Layout)              |
+-----------------------------------------------------------------------------------+
                                         │  (HTTP / RESTful API & SSE Streams)
                                         ▼
+-----------------------------------------------------------------------------------+
|                        APPLICATION SERVER (BUSINESS LOGIC)                        |
|    - Java Spring Boot 3.x REST API Core Services                                  |
|    - Spring Security & JWT Token Enforcement (RBAC Middleware)                    |
|    - Anti-Cycle Graph Verification Engine (DFS/BFS Graph Validation)              |
|    - Lunar Calendar Conversion & Background Task Scheduler (@Scheduled)           |
+-----------------------------------------------------------------------------------+
                 │                                                │
                 ▼ (JDBC / Hibernate 6)                          ▼ (Internal HTTP: 11434)
+-------------------------------------+         +-----------------------------------+
|           DATABASE LAYER            |         |          LOCAL AI ENGINE          |
|  - PostgreSQL 16 (Relational Core)  |         |  - Ollama Runtime Engine          |
|  - pgvector Extension (Vector Store)|◄────────┤  - Llama-3-8B-Instruct (LLM)      |
|  - Local File Storage (/uploads)    |         |  - Nomic-Embed-Text (Embeddings)  |
+-------------------------------------+         +-----------------------------------+
