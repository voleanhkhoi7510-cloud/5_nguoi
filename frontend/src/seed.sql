S-- 1. Bảng Vai trò (Roles)
INSERT INTO roles (id, name, description) VALUES
(1, 'Admin', 'Quản trị viên gia đình'),
(2, 'Member', 'Thành viên gia đình');

-- 2. Bảng Gia đình (Families)
INSERT INTO families (id, family_name, description, created_at) VALUES
(1, 'Gia đình Sum Vầy', 'Không gian kết nối các thế hệ gia đình', NOW());

-- 3. Bảng Tài khoản Người dùng (Users)
INSERT INTO users (id, full_name, email, password_hash, role_id, family_id, avatar_url) VALUES
(1, 'Nguyễn Đăng Long', 'long.nguyen@example.com', '$2a$10$SampleHash1', 1, 1, 'https://api.dicebear.com/7.x/bottts/svg?seed=Long'),
(2, 'Nguyễn Văn Hải', 'hai.nguyen@example.com', '$2a$10$SampleHash2', 2, 1, 'https://api.dicebear.com/7.x/bottts/svg?seed=Hai'),
(3, 'Lê Thị Hoa', 'hoa.le@example.com', '$2a$10$SampleHash3', 2, 1, 'https://api.dicebear.com/7.x/bottts/svg?seed=Hoa');

-- 4. Bảng Thành viên Gia phả (FamilyMembers)
INSERT INTO family_members (id, family_id, user_id, full_name, relationship, generation, birth_date) VALUES
(1, 1, 2, 'Nguyễn Văn Hải', 'Ông nội', 1, '1958-05-10'),
(2, 1, 3, 'Lê Thị Hoa', 'Mẹ Yêu', 2, '1982-10-15'),
(3, 1, 1, 'Nguyễn Đăng Long', 'Con trai', 3, '2005-03-20');

-- 5. Bảng Bài viết Bảng tin (Posts)
INSERT INTO posts (id, family_id, user_id, content, likes_count, comments_count, created_at) VALUES
(1, 1, 3, 'Cuối tuần này cả nhà mình tập trung đông đủ làm bữa lẩu thái nhé các con! Ai về sớm phụ mẹ đi chợ nào 🍲✨', 5, 2, NOW() - INTERVAL '2 hours'),
(2, 1, 1, 'Cuối tuần con về sớm phụ mẹ đi chợ ạ! 🎉', 3, 1, NOW());

-- 6. Bảng Sự kiện Gia đình (Events)
INSERT INTO events (id, family_id, title, event_date, event_type, description) VALUES
(1, 1, 'Sinh nhật Mẹ Yêu', '2026-10-15', 'Birthday', 'Tổ chức tiệc sinh nhật ấm cúng tại nhà'),
(2, 1, 'Ngày giỗ Ông Cố', '2026-11-20', 'Anniversary', 'Cả nhà tập trung về quê cúng giỗ');