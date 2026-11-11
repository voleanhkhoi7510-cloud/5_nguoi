import { Router } from 'express';
import {
  getEvents,
  createEvent,
  rsvpEvent,
} from '../controllers/events.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// GET  /api/v1/events?familyId=1
router.get('/', authenticateJWT, getEvents);

// POST /api/v1/events
router.post('/', authenticateJWT, createEvent);

// POST /api/v1/events/:id/rsvp
router.post('/:id/rsvp', authenticateJWT, rsvpEvent);

export default router;

