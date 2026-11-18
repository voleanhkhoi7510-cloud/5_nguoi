import { Router } from 'express';
import { aiSearch, aiChat, aiExplainRelationship } from '../controllers/ai.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
const router = Router();
// POST /api/v1/ai/search
router.post('/search', authenticateJWT, aiSearch);
// POST /api/v1/ai/chat
router.post('/chat', authenticateJWT, aiChat);
// POST /api/v1/ai/explain-relationship
router.post('/explain-relationship', authenticateJWT, aiExplainRelationship);
export default router;
//# sourceMappingURL=ai.routes.js.map