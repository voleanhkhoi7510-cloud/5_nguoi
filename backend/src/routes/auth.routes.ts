import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', register);

// POST /api/v1/auth/login
router.post('/login', login);

// GET /api/v1/auth/me (alias)
router.get('/me', authenticateJWT, getMe);

export default router;
