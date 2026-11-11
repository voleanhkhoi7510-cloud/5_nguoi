import { Router } from 'express';
import { getMe, updateMe, requestJoinFamily } from '../controllers/auth.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/v1/users/me (Lấy profile cá nhân)
router.get('/me', authenticateJWT, getMe);

// PUT /api/v1/users/me (Cập nhật profile, avatar, đổi mật khẩu)
router.put('/me', authenticateJWT, updateMe);

// POST /api/v1/users/join-family (Gửi yêu cầu gia nhập gia đình)
router.post('/join-family', authenticateJWT, requestJoinFamily);

export default router;
