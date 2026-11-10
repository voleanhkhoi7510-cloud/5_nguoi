### Web Application Manager Screen Flow (Luồng màn hình Quản trị)


Home -> Login -> Manager Dashboard
 ├── Phả hệ & Cây Gia Phả:
 │    ├── Cây Gia Phả Tương Tác
 │    ├── Quản lý Chi Phái
 │    └── Duyệt Yêu Cầu Nhập Họ
 ├── Di sản & Phả ký số
 ├── Sự kiện & Giỗ chạp Âm lịch:
 │    ├── Lịch Giỗ Âm Lịch (Calendar)
 │    └── Chi Tiết Sự Kiện & Quản Lý RSVP
 ├── Bản tin & Kiểm duyệt
 ├── Danh bạ & Khuyến học
 ├── Trí tuệ Nhân tạo Local AI:
 │    ├── Khung Chat Suy Luận Danh Xưng
 │    └── Quản Trị Vector RAG Phả Ký
 ├── Báo cáo & Thống kê
 └── Quản trị Hệ thống Cục bộ:
      ├── Tài Khoản & Phân Quyền RBAC
      ├── Sao Lưu & Phục Hồi CSDL Local
      └── Cấu Hình Ollama & Tham Số Local


### Web Application Member Screen Flow (Luồng màn hình Thành viên)


Home -> Login -> Member Portal (Không gian Thành viên)
 ├── Cây Gia Phả Tương Tác:
 │    ├── Xem Hồ Sơ Nút Chi Tiết
 │    └── Đề Xuất Khai Báo Quan Hệ
 ├── Bản Tin & Cộng Đồng:
 │    ├── Đăng Bài & Tải Ảnh Kỷ Niệm
 │    └── Bình Luận & Thả Cảm Xúc
 ├── Lịch Giỗ & Sự Kiện Âm Lịch:
 │    ├── Xem Lịch Giỗ Âm Lịch
 │    └── Xác Nhận Tham Dự (RSVP)
 ├── Danh Bạ & Tương Trợ Họ Tộc
 ├── Tủ Sách Di Sản Dòng Họ
 ├── Trợ Lý Trí Tuệ Nhân Tạo AI:
 │    ├── Hội Thoại Trợ Lý AI
 │    └── Tra Cứu Danh Xưng Thuần Việt
 └── Hồ Sơ Cá Nhân & Cài Đặt

 ## Web Application Screen Descriptions

### 1. Web Application Manager Screen Description

| # | Feature (Phân hệ) | Screen (Tên màn hình) | Description (Mô tả chi tiết chức năng) |
| :-: | :--- | :--- | :--- |
| **1** | General | Home | Trang chủ công khai giới thiệu về nguồn gốc dòng họ, các thông cáo chính thức mới nhất và cung cấp nút điều hướng đến cổng đăng nhập. |
| **2** | General | Login | Màn hình xác thực danh tính người dùng bằng Email/SĐT và mật khẩu, cấp phiên làm việc bằng JSON Web Token (JWT) và chuyển hướng theo vai trò (Role). |
| **3** | Dashboard | Manager Dashboard | Bảng điều khiển trung tâm hiển thị các thẻ chỉ số KPI tổng quan (tổng số thành viên, số chi nhánh, sự kiện giỗ sắp tới, yêu cầu nhập họ đang chờ duyệt) và các lối tắt dẫn đến các module quản trị. |
| **4** | Genealogy Management | Family Tree Canvas | Không gian đồ thị tương tác (xây dựng bằng React Flow / D3.js) hiển thị toàn bộ cây phả hệ đa thế hệ. Hỗ trợ thao tác thu phóng (zoom), kéo rê (pan), lọc theo chi phái và nhấp vào từng nút để xem quan hệ. |
| **5** | Genealogy Management | Member Node Details | Hộp thoại (Modal) hiển thị chi tiết hồ sơ của một nút thành viên trên cây gia phả: họ tên, thế hệ (đời thứ), ngày sinh/mất, nơi an táng, tên cha/mẹ, hôn phối và danh sách con cái. |
| **6** | Genealogy Management | Add / Link Relative Modal | Biểu mẫu cho phép Trưởng họ/Trưởng chi thêm nút thành viên mới hoặc thiết lập mối quan hệ phụ mẫu (cha-con, mẹ-con) và quan hệ hôn phối (vợ-chồng) cho một nút chỉ định. |
| **7** | Genealogy Management | Edit Node Modal | Form chỉnh sửa thông tin phả hệ của một cá nhân (tên hiệu, ngày sinh âm/dương lịch, tiểu sử vắn tắt) và cập nhật trạng thái còn sống hay đã tạ thế. |
| **8** | Genealogy Management | Branch Management | Màn hình danh sách quản lý các chi phái (nhánh họ), hiển thị mã chi, tên chi, người đứng đầu chi (Trưởng chi) và số lượng thành viên trực thuộc. |
| **9** | Genealogy Management | Lineage Verification Requests | Danh sách các đơn xin gia nhập dòng họ từ người dùng mới (Prospective Members) đang ở trạng thái "Chờ duyệt" (Pending). |
| **10** | Genealogy Management | Verification Dossier Review | Màn hình thẩm định hồ sơ xin nhập họ: hiển thị thông tin cha mẹ, tài liệu minh chứng huyết thống do người xin nhập họ tải lên; cung cấp nút hành động "Phê duyệt" (Approve) hoặc "Từ chối" (Reject). |
| **11** | Heritage & Archives | Digital Phả Ký Library | Thư viện lưu trữ phả ký số: hiển thị danh mục các bản phả ký, hương ước cổ và tài liệu chữ Hán - Nôm đã được số hóa. |
| **12** | Heritage & Archives | Document Viewer & OCR | Trình đọc tài liệu kỹ thuật số hỗ trợ lật trang, phóng to chữ cổ và hiển thị kết quả nhận diện văn bản (OCR) / bản dịch quốc ngữ song song. |
| **13** | Heritage & Archives | Ancestor Biographies | Danh sách bài viết tiểu sử công đức của các cụ tổ tiền nhân và những bậc tiền bối ưu tú có đóng góp lớn cho dòng tộc và xã hội. |
| **14** | Heritage & Archives | Create / Edit Biography | Trình soạn thảo văn bản đa phương tiện cho phép biên soạn tiểu sử tiền nhân, đính kèm tranh ảnh tư liệu và tích hợp nút xem trước bản tóm tắt tự động từ AI. |
| **15** | Heritage & Archives | Ceremonial Prayers | Kho lưu trữ các bài văn khấn chuẩn, bài văn tế cổ truyền và nghi thức hướng dẫn cúng lễ trong các dịp giỗ tổ, chạp họ và hội làng. |
| **16** | Events & Memorials | Lunar Memorial Calendar | Giao diện lịch biểu trực quan kết hợp song song lịch Âm và Dương, đánh dấu các ngày giỗ tổ, giỗ chi phái và các sự kiện tế lễ trong tháng. |
| **17** | Events & Memorials | Event Management List | Bảng dữ liệu quản lý tất cả sự kiện dòng họ (đã lên lịch, đang diễn ra, đã hoàn thành), hỗ trợ lọc theo chi nhánh và trạng thái tổ chức. |
| **18** | Events & Memorials | Create Event Form | Giao diện khởi tạo sự kiện mới: nhập tên lễ giỗ/họp họ, ngày âm lịch (hệ thống tự tính ngày dương lịch), thời gian, địa điểm tổ chức và kinh phí dự kiến. |
| **19** | Events & Memorials | Event Details & RSVP Tracker | Xem chi tiết sự kiện và theo dõi thời gian thực danh sách xác nhận tham dự (RSVP) của con cháu (Tham gia / Vắng mặt / Số lượng người đi cùng). |
| **20** | Events & Memorials | Duty Allocation Modal | Hộp thoại phân công nhiệm vụ chuẩn bị sự kiện (mua sắm lễ vật, nấu cỗ, tiếp tân, thủ từ tế lễ) cho các cá nhân hoặc chi nhánh phụ trách. |
| **21** | Community & Moderation | Official Announcements | Màn hình quản lý các thông cáo chính thức của Hội đồng gia tộc, hỗ trợ ghim bài viết lên đầu trang chủ và gửi thông báo hệ thống. |
| **22** | Community & Moderation | Post Moderation List | Danh sách toàn bộ bài viết, tin tức do thành viên đăng tải trên bản tin cộng đồng; hỗ trợ bộ lọc bài viết bị báo cáo (Reported). |
| **23** | Community & Moderation | Moderate Post Modal | Hộp thoại xem chi tiết nội dung bài viết và bình luận bị khiếu nại; cung cấp thao tác "Phê duyệt", "Ẩn nội dung" hoặc "Xóa vi phạm". |
| **24** | Community & Moderation | Clan Photo Gallery | Quản lý kho tư liệu ảnh và video kỷ niệm của dòng họ; cho phép tạo mới album theo từng năm, sự kiện và phân loại theo cành nhánh. |
| **25** | Directory & Mutual Aid | Member Directory | Danh bạ điện tử lưu trữ toàn bộ thành viên đang sinh sống, hỗ trợ tìm kiếm nhanh theo họ tên, thế hệ (đời), chi phái, tỉnh/thành phố cư trú. |
| **26** | Directory & Mutual Aid | Member Full Profile View | Xem hồ sơ toàn diện của một thành viên: trình độ học vấn, chuyên môn nghề nghiệp, đơn vị công tác và thông tin liên hệ được ủy quyền hiển thị. |
| **27** | Directory & Mutual Aid | Mutual Aid & Scholarships | Quản lý các chương trình quỹ khuyến học, quỹ vinh danh đỗ đạt đại học và quỹ tương trợ khó khăn cho con em trong dòng tộc. |
| **28** | Local AI Services | Kinship Reasoning Chat | Khung hội thoại tương tác trực tiếp với Trợ lý AI cục bộ (Ollama) để kiểm tra thuật toán suy luận thứ bậc và cách xưng hô chuẩn thuần Việt giữa 2 cá nhân bất kỳ. |
| **29** | Local AI Services | RAG Knowledge Base Status | Bảng giám sát cơ sở tri thức vector RAG: theo dõi số lượng đoạn phả ký đã được nhúng vector (embeddings), trạng thái chỉ mục trên pgvector và nút kích hoạt nạp lại tri thức (Re-index). |
| **30** | Analytics & Reporting | Demographics Dashboard | Biểu đồ trực quan hóa dữ liệu nhân khẩu học: tháp độ tuổi, tỷ lệ giới tính (nam/nữ), tỷ lệ còn sống/đã mất và bản đồ phân bố địa lý của con cháu. |
| **31** | Analytics & Reporting | Member Growth Report | Báo cáo xu hướng biến động dân số của dòng họ theo từng năm (số trẻ mới sinh, dâu/rể mới nhập họ, số người tạ thế). |
| **32** | Analytics & Reporting | Export Report Modal | Hộp thoại tùy chọn định dạng xuất báo cáo (Excel/PDF) danh sách đinh bộ, danh bạ liên lạc hoặc báo cáo nhân khẩu học phục vụ đại hội dòng họ. |
| **33** | System Admin | User Accounts Management | Màn hình quản lý danh sách tài khoản đăng nhập hệ thống: hiển thị tên đăng nhập, email, vai trò, trạng thái (Hoạt động / Bị khóa) và ngày tạo. |
| **34** | System Admin | Account Control Modal | Form tạo mới tài khoản cho Ban liên lạc hoặc chỉnh sửa trạng thái kích hoạt, đặt lại mật khẩu và khóa tài khoản vi phạm. |
| **35** | System Admin | Role & RBAC Management | Giao diện ma trận cấu hình phân quyền vai trò (Admin, Trưởng họ, Trưởng chi, Thành viên), cho phép bật/tắt quyền hạn chi tiết trên từng module. |
| **36** | System Admin | Audit Logs Viewer | Bảng hiển thị nhật ký kiểm toán hệ thống: ghi lại mọi hành vi nhạy cảm (Ai đã thêm/sửa/xóa nút gia phả, thời gian thực hiện, địa chỉ IP cục bộ). |
| **37** | System Admin | Backup & Restore Tool | Giao diện điều khiển sao lưu CSDL PostgreSQL và kho ảnh cục bộ ra tệp nén (`.sql` / `.tar.gz`) và khôi phục hệ thống khi cần thiết. |
| **38** | System Admin | Local System Config | Màn hình cấu hình các tham số môi trường nội bộ: cấu hình URL kết nối Ollama (`http://localhost:11434`), tên mô hình LLM (`llama3`), và giới hạn dung lượng tải tệp lên máy chủ. |

---

### 2. Web Application Member Screen Description

| # | Feature (Phân hệ) | Screen (Tên màn hình) | Description (Mô tả chi tiết chức năng) |
| :-: | :--- | :--- | :--- |
| **1** | General | Home | Trang chủ giới thiệu khái quát về cội nguồn dòng họ, lịch sử cụ tổ, các tin tức nổi bật và cung cấp lối tắt để đăng nhập vào không gian nội bộ. |
| **2** | General | Login / Register | Màn hình xác thực đăng nhập bằng Email/SĐT và mật khẩu, hoặc cho phép người mới tạo tài khoản và chuyển tiếp sang luồng xin nhập họ. |
| **3** | General | Member Portal | Trang tổng quan cá nhân của thành viên sau khi đăng nhập: hiển thị lời chào, thông báo sự kiện giỗ chạp sắp tới, lối tắt đến cây gia phả và bài viết mới nhất trên bảng tin. |
| **4** | Genealogy Management | Interactive Tree Canvas | Sơ đồ phả hệ trực quan (React Flow) cho phép thành viên tự do kéo rê, phóng to, thu nhỏ, tìm kiếm vị trí của bản thân hoặc người thân qua nhiều đời, tô màu theo từng nhánh chi. |
| **5** | Genealogy Management | Node Profile Modal | Hộp thoại hiển thị thông tin khi nhấp vào một người trên cây: họ tên, tên tự, đời thứ mấy, ngày sinh/ngày mất, mộ phần, cha mẹ, vợ/chồng và danh sách con cái. |
| **6** | Genealogy Management | Claim Kinship Relation Modal | Giao diện cho phép thành viên gửi yêu cầu khai báo thêm người thân: nhập thông tin vợ/chồng mới kết hôn hoặc con cái mới sinh để gửi lên Trưởng họ/Trưởng chi phê duyệt. |
| **7** | Genealogy Management | Export Tree Modal | Cửa sổ tùy chọn vùng phả hệ cần xuất bản (toàn họ tộc hoặc riêng chi phái của mình) và tải về tệp ảnh độ phân giải cao hoặc tệp PDF phục vụ in ấn. |
| **8** | Community & Feed | Newsfeed View | Dòng thời gian hiển thị bài viết, hình ảnh sinh hoạt, tin mừng (đỗ đạt, cưới hỏi) và tin buồn của gia đình; hỗ trợ lọc tin theo phạm vi toàn họ hoặc nội bộ chi phái. |
| **9** | Community & Feed | Create Post Modal | Biểu mẫu soạn thảo bài viết mới: cho phép nhập văn bản chia sẻ cảm nghĩ, đính kèm hình ảnh kỷ niệm, video ngắn và chọn chế độ chia sẻ (Nội bộ chi / Toàn dòng họ). |
| **10** | Community & Feed | Post Details & Comments | Màn hình xem chi tiết một bài viết cụ thể, hiển thị danh sách bình luận thảo luận của các cô chú, anh em và hỗ trợ thả các biểu tượng cảm xúc (Thích, Tự hào, Tưởng nhớ). |
| **11** | Community & Feed | Clan Photo Albums | Không gian lưu trữ các bộ sưu tập ảnh số hóa theo từng sự kiện (Lễ giỗ tổ 2026, Họp mặt đầu xuân, Trùng tu từ đường), phân loại theo năm. |
| **12** | Community & Feed | Album Slideshow Viewer | Trình xem ảnh toàn màn hình với các tiện ích: chuyển ảnh mượt mà, phóng to chi tiết và xem chú thích những người xuất hiện trong bức ảnh. |
| **13** | Events & Memorials | Lunar Memorial Calendar | Lịch biểu kết hợp Âm - Dương lịch hiển thị trực quan các ngày kỵ nhật (ngày giỗ), ngày lễ thanh minh, giỗ tổ; tô màu nổi bật các ngày giỗ cận kề trong tháng. |
| **14** | Events & Memorials | Event Details Page | Trang chi tiết một sự kiện cụ thể: tên lễ cúng/họp mặt, thời gian âm/dương lịch, địa chỉ từ đường/nhà chi trưởng kèm bản đồ chỉ đường, chương trình buổi lễ. |
| **15** | Events & Memorials | RSVP Modal | Hộp thoại xác nhận tham dự sự kiện: thành viên chọn trạng thái "Tham gia", "Bận việc vắng mặt", hoặc "Tham gia cùng gia đình" (kèm số lượng người lớn/trẻ em đi cùng). |
| **16** | Events & Memorials | View Assigned Duties | Màn hình hiển thị danh sách nhiệm vụ được Trưởng chi phân công riêng cho thành viên hoặc gia đình (ví dụ: phụ trách khánh tiết, tiếp khách, chuẩn bị mâm cỗ). |
| **17** | Directory & Mutual Aid | Member Directory List | Danh bạ điện tử danh sách người thân còn sống: hỗ trợ tìm kiếm nhanh theo họ tên, phân loại theo thế hệ (bậc chú bác, anh chị em, con cháu) hoặc nơi sinh sống hiện tại. |
| **18** | Directory & Mutual Aid | Career Profile Modal | Xem hồ sơ nghề nghiệp và học vấn của một thành viên: trường đại học từng học, ngành nghề chuyên môn, công ty/cơ quan công tác để tiện kết nối tương trợ. |
| **19** | Directory & Mutual Aid | Clan Funds & Mutual Aid | Trang thông tin về Quỹ khuyến học và Quỹ tương trợ dòng họ: báo cáo thu chi minh bạch, tôn vinh các nhà hảo tâm và thông báo phát học bổng hàng năm. |
| **20** | Directory & Mutual Aid | Honored Students List | Bảng vàng vinh danh con em trong dòng tộc đạt thành tích cao trong học tập, đỗ đạt thủ khoa, đại học hoặc đạt giải thưởng quốc gia/quốc tế. |
| **21** | Heritage Library | Digital Phả Ký Reader | Trình đọc sách điện tử cho phép lật xem các trang phả ký cổ đã được scan số hóa, đọc bản dịch quốc ngữ có chú giải nguồn gốc tổ tiên từ thời lập làng. |
| **22** | Heritage Library | Ancestor Biographies View | Trang đọc các bài viết văn bia, tiểu sử danh nhân tiền bối; cung cấp nút nghe đọc tự động hoặc xem bản tóm tắt nhanh công trạng do AI trích xuất. |
| **23** | Heritage Library | Ceremonial Prayers Reader | Thư viện tra cứu văn khấn cổ truyền: tổng hợp các bài cúng chuẩn mực (văn khấn tết, giỗ đầu, chạp họ) giúp các thành viên trẻ thực hiện đúng nghi lễ truyền thống. |
| **24** | Local AI Services | Conversational Chatbot | Khung chat trực tiếp với Trợ lý AI cục bộ (chạy trên Ollama): cho phép gõ câu hỏi tự nhiên về nguồn gốc họ tộc, phong tục thờ cúng và nhận câu trả lời tức thì. |
| **25** | Local AI Services | Kinship Pronoun Calculator | Công cụ tra cứu xưng hô thông minh: thành viên chọn một người bất kỳ trong danh bạ hoặc trên cây gia phả, AI sẽ phân tích tôn ti và đưa ra đại từ xưng hô chuẩn thuần Việt. |
| **26** | Local AI Services | Semantic RAG Search Results | Màn hình hiển thị kết quả tìm kiếm thông tin lịch sử gia tộc theo ngữ nghĩa, đính kèm đoạn trích dẫn đối chiếu từ các trang phả ký gốc đã được vector hóa. |
| **27** | Profile & Settings | Edit Profile Form | Biểu mẫu cho phép thành viên cập nhật thông tin cá nhân: số điện thoại, email, địa chỉ thường trú, nghề nghiệp, tiểu sử ngắn và ảnh chân dung đại diện. |
| **28** | Profile & Settings | Privacy Settings | Màn hình cấu hình quyền riêng tư: cho phép bật/tắt hiển thị số điện thoại cá nhân và địa chỉ nhà đối với các thành viên thuộc nhánh họ khác. |
| **29** | Profile & Settings | Change Password & Security | Màn hình đổi mật khẩu đăng nhập cá nhân, xem lịch sử phiên đăng nhập cục bộ để bảo vệ an toàn tài khoản. |
