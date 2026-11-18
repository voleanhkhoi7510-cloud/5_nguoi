import { Router } from 'express';
import {
  getGenealogyTree,
  addMember,
  getMemberById,
  updateMember,
  deleteMember,
  queryRelationship,
  searchDirectory,
  getDashboardStats,
  getCommunityStats,
  getEventStats,
} from '../controllers/genealogy.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Tất cả endpoints cần xác thực JWT
router.use(authenticateJWT);

// Cây gia phả (Graph Tree)
router.get('/tree', getGenealogyTree);

// Tra cứu mối quan hệ giữa 2 người
router.get('/relationships/query', queryRelationship);

// Danh bạ gia đình & Tra cứu đa tiêu chí (Nghề nghiệp, địa phương, thế hệ)
router.get('/directory', searchDirectory);

// Quản lý thành viên (Member CRUD)
router.post('/members', addMember);
router.post('/', addMember);
router.get('/members/:id', getMemberById);
router.put('/members/:id', updateMember);
router.delete('/members/:id', deleteMember);

// Báo cáo & Thống kê (Dashboard & Reporting)
router.get('/dashboard/stats', getDashboardStats);
router.get('/stats', getDashboardStats);
router.get('/dashboard/community', getCommunityStats);
router.get('/dashboard/events', getEventStats);

export default router;
