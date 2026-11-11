import type { Request, Response } from 'express';
import prisma from '../db.js';

function convertBigInt(data: any): any {
  if (typeof data === 'bigint') return data.toString();
  if (data instanceof Date) return data.toISOString();
  if (Array.isArray(data)) return data.map(convertBigInt);
  if (data !== null && typeof data === 'object') {
    const result: Record<string, any> = {};
    for (const key of Object.keys(data)) result[key] = convertBigInt(data[key]);
    return result;
  }
  return data;
}

function isValidId(id: string): boolean {
  return /^\d+$/.test(id) && BigInt(id) > 0n;
}

// ==================== LẤY DANH SÁCH SỰ KIỆN ====================
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const familyIdStr = String(req.query['familyId'] ?? '').replace(/^fam_/, '');

    if (!isValidId(familyIdStr)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'familyId không hợp lệ' });
      return;
    }

    const events = await prisma.events.findMany({
      where: { family_id: BigInt(familyIdStr) },
      orderBy: { event_date: 'asc' },
      include: {
        users: { select: { user_id: true, full_name: true } },
        _count: { select: { event_rsvps: true } },
      },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: convertBigInt(events.map((e) => ({
        id: e.event_id,
        title: e.title,
        description: e.description,
        eventDate: e.event_date,
        location: e.location,
        createdAt: e.created_at,
        creator: { id: e.users.user_id, fullName: e.users.full_name },
        rsvpCount: e._count.event_rsvps,
      }))),
    });
  } catch (error) {
    console.error('Lỗi khi lấy sự kiện:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== TẠO SỰ KIỆN ====================
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId as string | undefined;
    const { familyId, title, description, eventDate, location } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, statusCode: 401, message: 'Chưa xác thực' });
      return;
    }

    const familyIdStr = String(familyId ?? '').replace(/^fam_/, '');
    if (!isValidId(familyIdStr)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'familyId không hợp lệ' });
      return;
    }

    if (typeof title !== 'string' || !title.trim()) {
      res.status(400).json({ success: false, statusCode: 400, message: 'Tiêu đề sự kiện không được để trống' });
      return;
    }

    if (!eventDate || isNaN(Date.parse(String(eventDate)))) {
      res.status(400).json({ success: false, statusCode: 400, message: 'eventDate không hợp lệ (dùng ISO 8601)' });
      return;
    }

    const event = await prisma.events.create({
      data: {
        family_id: BigInt(familyIdStr),
        creator_id: BigInt(userId),
        title: title.trim(),
        description: typeof description === 'string' ? description : null,
        event_date: new Date(eventDate),
        location: typeof location === 'string' ? location : null,
      },
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Tạo sự kiện thành công',
      data: convertBigInt(event),
    });
  } catch (error) {
    console.error('Lỗi khi tạo sự kiện:', error);
    res.status(400).json({ success: false, statusCode: 400, message: 'Không thể tạo sự kiện' });
  }
};

// ==================== RSVP SỰ KIỆN ====================
export const rsvpEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId as string | undefined;
    const eventId = String(req.params['id'] ?? '');
    const { status } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, statusCode: 401, message: 'Chưa xác thực' });
      return;
    }

    if (!isValidId(eventId)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'ID sự kiện không hợp lệ' });
      return;
    }

    const validStatuses = ['GOING', 'DECLINED', 'TENTATIVE'];
    const rsvpStatus = validStatuses.includes(String(status ?? '')) ? String(status) : 'GOING';

    const existing = await prisma.event_rsvps.findFirst({
      where: { event_id: BigInt(eventId), user_id: BigInt(userId) },
    });

    let rsvp;
    if (existing) {
      rsvp = await prisma.event_rsvps.update({
        where: { rsvp_id: existing.rsvp_id },
        data: { status: rsvpStatus, updated_at: new Date() },
      });
    } else {
      rsvp = await prisma.event_rsvps.create({
        data: {
          event_id: BigInt(eventId),
          user_id: BigInt(userId),
          status: rsvpStatus,
        },
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Cập nhật RSVP thành công',
      data: convertBigInt(rsvp),
    });
  } catch (error) {
    console.error('Lỗi khi RSVP:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

