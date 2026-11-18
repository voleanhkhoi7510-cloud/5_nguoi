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
        users: { select: { user_id: true, full_name: true, email: true, avatar_url: true } },
        _count: { select: { event_rsvps: true } },
      },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: convertBigInt(
        events.map((e) => ({
          id: e.event_id,
          title: e.title,
          description: e.description,
          eventDate: e.event_date,
          location: e.location,
          createdAt: e.created_at,
          creator: {
            id: e.users.user_id,
            fullName: e.users.full_name,
            email: e.users.email,
            avatarUrl: e.users.avatar_url,
          },
          rsvpCount: e._count.event_rsvps,
        }))
      ),
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
    const { familyId, title, description, eventDate, location, mediaUrls } = req.body;

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
        media_urls: Array.isArray(mediaUrls) ? mediaUrls : [],
      },
      include: {
        users: { select: { user_id: true, full_name: true, email: true, avatar_url: true } },
      },
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Tạo sự kiện thành công',
      data: convertBigInt({
        id: event.event_id,
        title: event.title,
        description: event.description,
        eventDate: event.event_date,
        location: event.location,
        mediaUrls: event.media_urls,
        createdAt: event.created_at,
        creator: {
          id: event.users.user_id,
          fullName: event.users.full_name,
        },
      }),
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
    const rawId = req.params['id'] ?? '';
    const eventId = String(rawId).replace(/^event_/, '');
    const { status } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, statusCode: 401, message: 'Chưa xác thực' });
      return;
    }

    if (!isValidId(eventId)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'ID sự kiện không hợp lệ' });
      return;
    }

    const event = await prisma.events.findUnique({
      where: { event_id: BigInt(eventId) },
    });

    if (!event) {
      res.status(404).json({ success: false, statusCode: 404, message: 'Không tìm thấy sự kiện' });
      return;
    }

    const validStatuses = ['GOING', 'DECLINED', 'TENTATIVE'];
    const rsvpStatus = validStatuses.includes(String(status ?? '').toUpperCase())
      ? String(status).toUpperCase()
      : 'GOING';

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

    // Lấy tổng số lượng RSVP cập nhật
    const countGoing = await prisma.event_rsvps.count({
      where: { event_id: BigInt(eventId), status: 'GOING' },
    });
    const countTentative = await prisma.event_rsvps.count({
      where: { event_id: BigInt(eventId), status: 'TENTATIVE' },
    });
    const countDeclined = await prisma.event_rsvps.count({
      where: { event_id: BigInt(eventId), status: 'DECLINED' },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Cập nhật RSVP thành công',
      data: {
        rsvp: convertBigInt(rsvp),
        stats: {
          total: countGoing + countTentative + countDeclined,
          going: countGoing,
          tentative: countTentative,
          declined: countDeclined,
        },
      },
    });
  } catch (error) {
    console.error('Lỗi khi RSVP:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== LẤY DANH SÁCH NGƯỜI THAM GIA (ATTENDEES / RSVPs) ====================
export const getEventAttendees = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params['id'] ?? '';
    const eventId = String(rawId).replace(/^event_/, '');
    const filterStatus = req.query['status'] as string | undefined;

    if (!isValidId(eventId)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'ID sự kiện không hợp lệ' });
      return;
    }

    const event = await prisma.events.findUnique({
      where: { event_id: BigInt(eventId) },
      select: { event_id: true, title: true, event_date: true, location: true },
    });

    if (!event) {
      res.status(404).json({ success: false, statusCode: 404, message: 'Không tìm thấy sự kiện' });
      return;
    }

    const whereClause: any = { event_id: BigInt(eventId) };
    if (filterStatus && ['GOING', 'DECLINED', 'TENTATIVE'].includes(filterStatus.toUpperCase())) {
      whereClause.status = filterStatus.toUpperCase();
    }

    const rsvps = await prisma.event_rsvps.findMany({
      where: whereClause,
      include: {
        users: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
            avatar_url: true,
            role: true,
          },
        },
      },
      orderBy: { updated_at: 'desc' },
    });

    // Thống kê phân loại
    const attendees = rsvps.map((r) => ({
      rsvpId: r.rsvp_id.toString(),
      status: r.status,
      updatedAt: r.updated_at,
      user: {
        id: r.users.user_id.toString(),
        fullName: r.users.full_name,
        email: r.users.email,
        avatarUrl: r.users.avatar_url,
        systemRole: r.users.role,
      },
    }));

    const going = attendees.filter((a) => a.status === 'GOING');
    const tentative = attendees.filter((a) => a.status === 'TENTATIVE');
    const declined = attendees.filter((a) => a.status === 'DECLINED');

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        event: convertBigInt(event),
        total: attendees.length,
        summary: {
          goingCount: going.length,
          tentativeCount: tentative.length,
          declinedCount: declined.length,
        },
        attendees,
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người tham gia sự kiện:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};
