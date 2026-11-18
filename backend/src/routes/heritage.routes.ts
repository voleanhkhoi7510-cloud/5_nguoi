import { Router } from 'express';
import {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  getPhotoGallery,
} from '../controllers/heritage.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { requirePermission, requireRole } from '../middlewares/rbac.middleware.js';

const router = Router();

// GET /api/v1/heritage/documents?familyId=1&documentType=HISTORICAL
router.get('/documents', authenticateJWT, getDocuments);

// GET /api/v1/heritage/documents/:id
router.get('/documents/:id', authenticateJWT, getDocumentById);

// POST /api/v1/heritage/documents (Tạo tài liệu di sản - Yêu cầu xác thực)
router.post('/documents', authenticateJWT, createDocument);

// PUT /api/v1/heritage/documents/:id (Chỉnh sửa tài liệu di sản)
router.put('/documents/:id', authenticateJWT, updateDocument);

// DELETE /api/v1/heritage/documents/:id (Xoá tài liệu di sản - Yêu cầu ADMIN/MODERATOR)
router.delete('/documents/:id', authenticateJWT, requireRole('ADMIN', 'MODERATOR'), deleteDocument);

// GET /api/v1/heritage/gallery?familyId=1 (Photo gallery tổng hợp)
router.get('/gallery', authenticateJWT, getPhotoGallery);

export default router;
