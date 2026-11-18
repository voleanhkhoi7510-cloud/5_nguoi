import { Router } from 'express';
import { getPosts, createPost, deletePost, addComment, toggleReaction, } from '../controllers/posts.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
const router = Router();
// GET  /api/v1/posts?familyId=1&page=1&limit=10
router.get('/', authenticateJWT, getPosts);
// POST /api/v1/posts
router.post('/', authenticateJWT, createPost);
// DELETE /api/v1/posts/:id
router.delete('/:id', authenticateJWT, deletePost);
// POST /api/v1/posts/:postId/comments
router.post('/:postId/comments', authenticateJWT, addComment);
// POST /api/v1/posts/:postId/reactions
router.post('/:postId/reactions', authenticateJWT, toggleReaction);
export default router;
//# sourceMappingURL=posts.routes.js.map