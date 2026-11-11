import { Router } from 'express';
import {
  aiSearch,
  aiChat,
  aiExplainRelationship,
  aiSummarize,
  aiRecommendations,
} from '../controllers/ai.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// POST /api/v1/ai/search (Semantic Search)
router.post('/search', authenticateJWT, aiSearch);

// POST /api/v1/ai/chat (Hỏi đáp trợ lý gia đình)
router.post('/chat', authenticateJWT, aiChat);

// POST /api/v1/ai/explain-relationship (Giải thích cách xưng hô gia tộc)
router.post('/explain-relationship', authenticateJWT, aiExplainRelationship);

// POST /api/v1/ai/summarize (Tóm tắt nội dung bài viết, tiểu sử, tài liệu)
router.post('/summarize', authenticateJWT, aiSummarize);

// GET /api/v1/ai/recommendations?familyId=1 (Gợi ý kết nối thành viên và tài nguyên)
router.get('/recommendations', authenticateJWT, aiRecommendations);

export default router;
