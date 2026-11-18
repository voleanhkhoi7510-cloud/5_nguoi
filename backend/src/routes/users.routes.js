import { Router } from 'express';
import { getMe } from '../controllers/auth.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
const router = Router();
// GET /api/v1/users/me
router.get('/me', authenticateJWT, getMe);
export default router;
//# sourceMappingURL=users.routes.js.map