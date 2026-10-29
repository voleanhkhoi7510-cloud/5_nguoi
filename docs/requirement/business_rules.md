# FamilyConnect - Quy Tắc Nghiệp Vụ Hệ Thống (Business Rules)

> **Dự án:** FamilyConnect: AI-powered Digital Family Community Platform  
> **Tài liệu thuộc:** SRS - Phụ lục 5.1 Business Rules  
> **Môi trường thực thi:** Localhost / Intranet (Containerized via Docker)

---

## 1. Tổng quan (Overview)
Tài liệu này xác định 50 quy tắc nghiệp vụ cốt lõi (**BR-01** đến **BR-50**) ràng buộc các luồng logic của hệ thống FamilyConnect. Mọi logic xử lý tại tầng Backend (Spring Boot Validation), Ràng buộc CSDL (PostgreSQL Constraints), Thuật toán kiểm tra đồ thị phả hệ, và Trợ lý AI cục bộ (Ollama) bắt buộc phải tuân thủ nghiêm ngặt các quy tắc này.

---

## 2. Bảng Danh Mục Quy Tắc Nghiệp Vụ (Business Rules Catalog)

### Nhóm I: Tài khoản, Định danh & Phân quyền (Auth & RBAC)
| Mã BR | Tên quy tắc | Định nghĩa quy tắc nghiệp vụ (Logic Statement) |
| :---: | :--- | :--- |
| **BR-01** | Định danh duy nhất | Mỗi người dùng chỉ sở hữu duy nhất 01 tài khoản định danh trong hệ thống dựa trên Số điện thoại hoặc Email. Không cho phép trùng lặp. |
| **BR-02** | Giới hạn quyền hạn (RBAC) | Người dùng chỉ được phép truy cập và thực thi các API/Menu thuộc phạm vi quyền hạn được gán cho Vai trò (Role) của mình trong ma trận RBAC. |
| **BR-03** | Bảo tồn dữ liệu (Soft Delete) | Dữ liệu cốt lõi (Hồ sơ gia phả, tư liệu phả ký, lịch sử sự kiện) không bao giờ bị xóa vĩnh viễn khỏi CSDL, chỉ chuyển trạng thái sang `Inactive` hoặc `Deleted`. |
| **BR-04** | Đơn phiên đăng nhập | Một tài khoản người dùng không được phép duy trì phiên đăng nhập đồng thời trên hai thiết bị khác nhau tại cùng một thời điểm. |
| **BR-05** | Thông tin nhập tộc tối thiểu | Người dùng mới bắt buộc phải cung cấp đầy đủ Họ tên, Ngày tháng năm sinh và Số điện thoại trước khi gửi đơn xin xác minh nhập tộc. |
| **BR-45** | Hạn lưu phiên đăng nhập | Phiên làm việc (Session/JWT) của tài khoản người dùng tự động hết hạn và bắt buộc đăng nhập lại sau **07 ngày** liên tục không có hoạt động. |
| **BR-46** | Độ phức tạp mật khẩu | Mật khẩu tài khoản phải chứa tối thiểu **08 ký tự**, bao gồm ít nhất 01 chữ hoa, 01 chữ thường và 01 chữ số. |
| **BR-47** | Khóa tài khoản tạm thời | Hệ thống tự động khóa tài khoản tạm thời trong vòng **15 phút** nếu người dùng nhập sai mật khẩu liên tiếp **05 lần**. |

---

### Nhóm II: Cây Gia Phả & Toàn vẹn Đồ thị (Genealogy Graph Integrity)
| Mã BR | Tên quy tắc | Định nghĩa quy tắc nghiệp vụ (Logic Statement) |
| :---: | :--- | :--- |
| **BR-06** | Chống chu trình đồ thị (Anti-Cycle) | Hệ thống ngăn chặn tuyệt đối việc tạo vòng lặp quan hệ. Một nút thành viên không thể vừa là tổ tiên, vừa là con cháu của chính mình (Đồ thị phải là DAG). |
| **BR-07** | Giới hạn phụ mẫu | Một nút thành viên trên cây gia phả chỉ được phép liên kết với tối đa 01 Cha ruột và 01 Mẹ ruột. |
| **BR-08** | Khoảng cách tuổi thế hệ | Ngày sinh của cha/mẹ ruột bắt buộc phải sớm hơn ngày sinh của con ruột tối thiểu **15 năm**. |
| **BR-09** | Trạng thái tạ thế | Thành viên có trạng thái `isDeceased = true` bắt buộc phải có thông tin Năm mất; không được phép gán các hành động tài khoản còn sống (đăng nhập, RSVP). |
| **BR-10** | Kế thừa chi phái (Patrilineal) | Con cái sinh ra mặc định được gán theo Chi phái (Nhánh họ) của người Cha, trừ trường hợp đặc biệt được Trưởng họ phê duyệt ngoại lệ. |
| **BR-11** | Thẩm quyền duyệt phả hệ | Chỉ có tài khoản mang vai trò Trưởng họ (*Clan Leader*) hoặc Trưởng chi (*Branch Leader*) mới có quyền xác nhận một thành viên mới vào cây gia phả chính thức. |
| **BR-12** | Hôn nhân đơn vị thời gian | Một thành viên không được phép tồn tại hai mối quan hệ hôn phối cùng ở trạng thái "Đang kết hôn" (*Active Marriage*) tại cùng một thời điểm. |
| **BR-13** | Hôn nhân đồng thế hệ | Quan hệ hôn nhân thông thường chỉ được thiết lập giữa hai cá nhân có cùng bậc thế hệ (hoặc chênh lệch không quá 01 bậc thế hệ nếu có sự chấp thuận). |
| **BR-14** | Nhật ký kiểm toán phả hệ | Mọi thao tác thêm, sửa, xóa nút quan hệ gia phả bắt buộc phải được tự động ghi lại vào bảng `audit_logs` (Ai thao tác, Thời gian, Dữ liệu cũ/mới, IP). |
| **BR-50** | Định dạng mã định danh | Toàn bộ mã định danh sinh tự động phải tuân thủ chuẩn: Thành viên (`MB-xxxxxx`), Chi họ (`BR-xxx`), Sự kiện (`EV-YYYYMMDD-xxx`). |

---

### Nhóm III: Tôn Ti Trật Tự & Trợ Lý AI Cục Bộ (AI & Kinship Reasoning)
| Mã BR | Tên quy tắc | Định nghĩa quy tắc nghiệp vụ (Logic Statement) |
| :---: | :--- | :--- |
| **BR-17** | Thứ bậc ưu tiên hơn tuổi tác | Thuật toán suy luận danh xưng họ tộc bắt buộc phải ưu tiên **Thứ bậc thế hệ (Đời thứ mấy)** cao hơn tuổi tác sinh học thông thường (Chú/Bác ít tuổi hơn Cháu vẫn là bề trên). |
| **BR-18** | Quy tắc Cành trên - Cành dưới | Giữa hai người cùng thế hệ ngang hàng, người thuộc nhánh Trưởng (cành trên) luôn là bậc anh/chị của người thuộc nhánh Thứ (cành dưới), không phân biệt tuổi tác. |
| **BR-19** | Tính chất cố vấn của AI | Trợ lý AI chỉ đưa ra gợi ý cách xưng hô và giải thích phả hệ mang tính tham khảo; AI không được phép tự động can thiệp chỉnh sửa dữ liệu CSDL. |
| **BR-20** | Bảo mật Local AI (No Cloud) | Toàn bộ câu hỏi người dùng, văn bản phả ký và vector embeddings chỉ được xử lý nội bộ qua Ollama và `pgvector` cục bộ; nghiêm cấm truyền dữ liệu ra Internet. |
| **BR-21** | Kích thước phân đoạn phả ký | Kích thước mỗi đoạn văn bản phả ký (*Chunk size*) khi nạp vào vector database không được vượt quá **512 tokens** với độ trùng lặp cố định 50 tokens. |
| **BR-22** | Ngưỡng tương đồng RAG | Kết quả tìm kiếm ngữ nghĩa qua RAG chỉ được chấp nhận trả về cho người dùng nếu độ tương đồng Cosine đạt giá trị $\ge 0.72$. |
| **BR-49** | Dọn dẹp RAM mô hình AI | Tác vụ chạy ngầm giải phóng bộ nhớ RAM của Ollama tự động kích hoạt khi phiên hội thoại AI không phát sinh câu hỏi mới sau **30 phút**. |

---

### Nhóm IV: Sự Kiện & Lịch Giỗ Âm Lịch (Events & Memorials)
| Mã BR | Tên quy tắc | Định nghĩa quy tắc nghiệp vụ (Logic Statement) |
| :---: | :--- | :--- |
| **BR-23** | Mốc tính lịch Âm gốc | Lịch giỗ chạp bắt buộc phải lấy ngày Âm lịch làm mốc cố định gốc; hệ thống phải tự động tính toán ngày Dương lịch tương ứng theo từng năm cụ thể. |
| **BR-24** | Hạn chót khóa RSVP | Hệ thống tự động khóa tính năng thay đổi trạng thái tham dự sự kiện (RSVP) trước thời điểm diễn ra sự kiện đúng **24 giờ** để chốt cỗ bàn. |
| **BR-25** | Độ tuổi xác nhận RSVP | Chỉ những thành viên có trạng thái "Đã xác minh" (*Verified Member*) và từ đủ **16 tuổi trở lên** mới được quyền thực hiện xác nhận tham gia sự kiện. |
| **BR-26** | Đi kèm gia đình | Thành viên xác nhận "Tham gia cùng gia đình" bắt buộc phải khai báo số lượng người lớn và trẻ em đi kèm ($\ge 1$). |
| **BR-27** | Phân công việc hiếu hỉ | Phân công nhiệm vụ sự kiện giỗ chạp (nấu cỗ, tế lễ, khánh tiết) chỉ được chỉ định cho các thành viên từ đủ **18 tuổi trở lên**. |
| **BR-28** | Hai mốc nhắc giỗ tự động | Thông báo nhắc ngày giỗ âm lịch được hệ thống tự động kích hoạt gửi cho con cháu liên quan vào đúng **02 mốc thời gian**: trước ngày lễ 07 ngày và trước ngày lễ 01 ngày. |

---

### Nhóm V: Cộng Đồng & Bản Tin (Community & Feed)
| Mã BR | Tên quy tắc | Định nghĩa quy tắc nghiệp vụ (Logic Statement) |
| :---: | :--- | :--- |
| **BR-29** | Thẩm quyền thông cáo | Chỉ có Trưởng họ (*Clan Leader*) mới có quyền phát hành bài viết có gắn nhãn "Thông cáo Dòng họ" và ghim lên đầu trang chủ. |
| **BR-30** | Giới hạn kiểm duyệt chi phái | Trưởng chi (*Branch Leader*) chỉ có quyền kiểm duyệt, ẩn hoặc xóa các bài viết, hình ảnh thuộc phạm vi chi nhánh mà mình quản lý. |
| **BR-31** | Tự động ẩn bài vi phạm | Bài viết bị thành viên khiếu nại/báo cáo vi phạm từ **03 lượt trở lên** sẽ tự động bị chuyển sang trạng thái tạm ẩn chờ Ban liên lạc xem xét. |
| **BR-32** | Giới hạn ký tự bình luận | Bình luận và phản hồi bài viết không được vượt quá độ dài **1.000 ký tự**. |
| **BR-33** | Thời gian chỉnh sửa bài | Thành viên chỉ được phép chỉnh sửa hoặc xóa bài viết/bình luận của chính mình trong vòng **24 giờ** kể từ thời điểm đăng tải. |
| **BR-34** | Giới hạn tệp đa phương tiện | Tệp hình ảnh tải lên bắt buộc thuộc định dạng `.jpg`, `.jpeg`, `.png`, `.webp` và có dung lượng tối đa không quá **10MB/ảnh**. |

---

### Nhóm VI: Di Sản & Tư Liệu Lịch Sử (Heritage & Archives)
| Mã BR | Tên quy tắc | Định nghĩa quy tắc nghiệp vụ (Logic Statement) |
| :---: | :--- | :--- |
| **BR-15** | Quyền hạn tài khoản Khách | Người dùng mang vai trò Khách (*Guest*) chỉ được xem các bài viết và tư liệu lịch sử được đánh dấu ở chế độ "Công khai" (*Public*). |
| **BR-35** | Giới hạn tệp phả ký scan | Tệp phả ký cổ số hóa quét dạng PDF không được vượt quá dung lượng **50MB/tệp**. |
| **BR-36** | Bất biến phả ký gốc | Các trang tư liệu phả ký lịch sử đã quét sau khi được Trưởng họ ký duyệt thì không thể bị ghi đè; mọi đính chính phải ghi dạng phụ lục. |

---

### Nhóm VII: Danh Bạ & Khuyến Học (Directory & Mutual Aid)
| Mã BR | Tên quy tắc | Định nghĩa quy tắc nghiệp vụ (Logic Statement) |
| :---: | :--- | :--- |
| **BR-16** | Quyền riêng tư liên lạc | Số điện thoại và Địa chỉ nhà riêng của thành viên chỉ được hiển thị cho người cùng chi nhánh, trừ khi thành viên chủ động bật công khai. |
| **BR-37** | Chia sẻ kết nối nghề nghiệp | Danh bạ nghề nghiệp họ tộc chỉ cho phép hiển thị các tài khoản đã được xác thực huyết thống và tự nguyện bật tính năng chia sẻ kết nối. |
| **BR-38** | Minh chứng quỹ khuyến học | Tiêu chuẩn vinh danh Quỹ khuyến học yêu cầu thành viên đính kèm minh chứng rõ ràng (Giấy báo trúng tuyển, bằng khen) trước khi duyệt. |
| **BR-39** | Minh bạch tài chính nội bộ | Báo cáo tài chính thu chi của Quỹ tương trợ/khuyến học dòng họ phải được cập nhật định kỳ và chỉ hiển thị ở chế độ đọc (*Read-only*) đối với thành viên. |

---

### Nhóm VIII: Thẩm Định Nhập Họ (Lineage Claim Intake)
| Mã BR | Tên quy tắc | Định nghĩa quy tắc nghiệp vụ (Logic Statement) |
| :---: | :--- | :--- |
| **BR-40** | Đơn xin nhập họ quá hạn | Đơn xin gia nhập dòng họ của người dùng mới ở trạng thái "Chờ duyệt" (*Pending*) quá **30 ngày** sẽ tự động chuyển sang trạng thái "Hết hạn" (*Expired*). |
| **BR-41** | Lý do từ chối bắt buộc | Trưởng họ hoặc Trưởng chi khi từ chối một đơn xin nhập tộc bắt buộc phải nhập rõ **Lý do từ chối** vào hệ thống. |
| **BR-42** | Thời gian chờ gửi lại đơn | Người dùng bị từ chối đơn xin nhập tộc phải đợi tối thiểu **07 ngày** mới được phép gửi lại đơn mới. |

---

### Nhóm IX: Quản Trị Hệ Thống & Vận Hành Local (Administration)
| Mã BR | Tên quy tắc | Định nghĩa quy tắc nghiệp vụ (Logic Statement) |
| :---: | :--- | :--- |
| **BR-43** | Dữ liệu thống kê hợp lệ | Dữ liệu thống kê nhân khẩu dòng họ trên Dashboard chỉ tính toán dựa trên các thành viên có trạng thái hoạt động hợp lệ (bỏ qua tài khoản đã xóa mềm). |
| **BR-44** | Giới hạn quyền Admin kỹ thuật | Quản trị viên hệ thống (*System Administrator*) không được phép tự ý thay đổi mối quan hệ thân tộc trên cây gia phả nếu không có yêu cầu bằng văn bản từ Hội đồng gia tộc. |
| **BR-48** | Số lượng bản sao lưu Local | Bản sao lưu cơ sở dữ liệu định kỳ trên máy Local phải được tự động duy trì tối thiểu **04 bản gần nhất**; bản cũ hơn 30 ngày sẽ tự động bị xóa. |
