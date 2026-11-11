import { Router } from 'express';
import { getGenealogyTree, addMember, queryRelationship, getDashboardStats, } from '../controllers/genealogy.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
const router = Router();
// GET /api/v1/genealogy/tree?familyId=1
router.get('/tree', authenticateJWT, getGenealogyTree);
// GET /api/v1/genealogy/relationships/query?memberAId=1&memberBId=2
router.get('/relationships/query', authenticateJWT, queryRelationship);
// POST /api/v1/members hoặc /api/v1/genealogy/members
router.post('/members', authenticateJWT, addMember);
router.post('/', authenticateJWT, addMember);
// GET /api/v1/dashboard/stats hoặc /api/v1/genealogy/dashboard/stats
router.get('/dashboard/stats', authenticateJWT, getDashboardStats);
router.get('/stats', authenticateJWT, getDashboardStats);
export default router;
//# sourceMappingURL=genealogy.routes.js.map