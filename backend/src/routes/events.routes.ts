import { Router } from 'express';
import {
  getEvents,
  createEvent,
  rsvpEvent,
  getEventAttendees,
} from '../controllers/events.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// GET  /api/v1/events?familyId=1 (Lấy danh sách sự kiện)
router.get('/', authenticateJWT, getEvents);

// POST /api/v1/events (Tạo sự kiện mới)
router.post('/', authenticateJWT, createEvent);

// POST /api/v1/events/:id/rsvp (Điểm danh / Đăng ký tham gia sự kiện)
router.post('/:id/rsvp', authenticateJWT, rsvpEvent);

// GET  /api/v1/events/:id/attendees (Danh sách người tham gia sự kiện)
router.get('/:id/attendees', authenticateJWT, getEventAttendees);

// GET  /api/v1/events/:id/rsvps (Alias danh sách RSVP)
router.get('/:id/rsvps', authenticateJWT, getEventAttendees);

export default router;
