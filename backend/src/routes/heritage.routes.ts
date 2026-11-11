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

const router = Router();

// GET /api/v1/heritage/documents?familyId=1&documentType=HISTORICAL
router.get('/documents', authenticateJWT, getDocuments);

// GET /api/v1/heritage/documents/:id
router.get('/documents/:id', authenticateJWT, getDocumentById);

// POST /api/v1/heritage/documents
router.post('/documents', authenticateJWT, createDocument);

// PUT /api/v1/heritage/documents/:id
router.put('/documents/:id', authenticateJWT, updateDocument);

// DELETE /api/v1/heritage/documents/:id
router.delete('/documents/:id', authenticateJWT, deleteDocument);

// GET /api/v1/heritage/gallery?familyId=1 (Photo gallery tổng hợp)
router.get('/gallery', authenticateJWT, getPhotoGallery);

export default router;
