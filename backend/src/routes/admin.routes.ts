import { Router } from 'express';
import {
  listUsers,
  updateUserRole,
  deleteUserByAdmin,
  moderatePost,
  verifyFamilyMember,
  getAuditLogs,
  exportFamilyData,
} from '../controllers/admin.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/rbac.middleware.js';

const router = Router();

// Tất cả các routes trong admin đều cần đăng nhập và có vai trò ADMIN hoặc MODERATOR
router.use(authenticateJWT);

// Quản lý người dùng (User Management) - Yêu cầu ADMIN
router.get('/users', requireRole('ADMIN'), listUsers);
router.put('/users/:id/role', requireRole('ADMIN'), updateUserRole);
router.delete('/users/:id', requireRole('ADMIN'), deleteUserByAdmin);

// Kiểm duyệt nội dung (Content Moderation) - ADMIN hoặc MODERATOR
router.put('/posts/:id/moderate', requireRole('ADMIN', 'MODERATOR'), moderatePost);

// Xác minh thành viên tham gia gia đình - ADMIN hoặc MODERATOR
router.put('/family-members/:id/verify', requireRole('ADMIN', 'MODERATOR'), verifyFamilyMember);

// Xem nhật ký kiểm toán (Audit Logging) - Yêu cầu ADMIN
router.get('/audit-logs', requireRole('ADMIN'), getAuditLogs);

// Sao lưu & Xuất dữ liệu gia phả (Backup & Restore) - ADMIN hoặc MODERATOR
router.get('/export/:familyId', requireRole('ADMIN', 'MODERATOR'), exportFamilyData);

export default router;
