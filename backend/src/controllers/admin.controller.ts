import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../db.js';
import { logAudit } from '../middlewares/audit.middleware.js';

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

// ==================== QUẢN LÝ NGƯỜI DÙNG: DANH SÁCH ====================
export const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(String(req.query['page'] ?? '1'), 10));
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query['limit'] ?? '20'), 10)));
    const search = req.query['search'] as string | undefined;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { full_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.users.count({ where }),
      prisma.users.findMany({
        where,
        select: {
          user_id: true,
          full_name: true,
          email: true,
          role: true,
          avatar_url: true,
          created_at: true,
        },
        orderBy: { user_id: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: convertBigInt(users),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách users:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== QUẢN LÝ NGƯỜI DÙNG: CẬP NHẬT VAI TRÒ ====================
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req as any).user?.userId as string | undefined;
    const targetUserId = String(req.params['id'] ?? '');
    const { role } = req.body;

    if (!isValidId(targetUserId)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'ID người dùng không hợp lệ' });
      return;
    }

    const validRoles = ['ADMIN', 'MODERATOR', 'MEMBER'];
    if (!validRoles.includes(String(role))) {
      res.status(400).json({ success: false, statusCode: 400, message: 'Vai trò phải là: ADMIN, MODERATOR, hoặc MEMBER' });
      return;
    }

    const updated = await prisma.users.update({
      where: { user_id: BigInt(targetUserId) },
      data: { role: String(role) },
      select: { user_id: true, full_name: true, email: true, role: true },
    });

    await logAudit({
      userId: adminId,
      action: 'UPDATE_USER_ROLE',
      entityType: 'users',
      entityId: targetUserId,
      details: `Phân quyền người dùng ${updated.email} thành ${updated.role}`,
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Cập nhật vai trò người dùng thành công',
      data: convertBigInt(updated),
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật vai trò:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== QUẢN LÝ NGƯỜI DÙNG: XÓA NGƯỜI DÙNG ====================
export const deleteUserByAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req as any).user?.userId as string | undefined;
    const targetUserId = String(req.params['id'] ?? '');

    if (!isValidId(targetUserId)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'ID người dùng không hợp lệ' });
      return;
    }

    if (adminId === targetUserId) {
      res.status(400).json({ success: false, statusCode: 400, message: 'Không thể tự xóa tài khoản của chính mình' });
      return;
    }

    await prisma.users.delete({ where: { user_id: BigInt(targetUserId) } });

    await logAudit({
      userId: adminId,
      action: 'DELETE_USER',
      entityType: 'users',
      entityId: targetUserId,
      details: `Xóa tài khoản người dùng ID: ${targetUserId}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ success: true, statusCode: 200, message: 'Đã xóa người dùng thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== KIỂM DUYỆT NỘI DUNG (CONTENT MODERATION) ====================
export const moderatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req as any).user?.userId as string | undefined;
    const postId = String(req.params['id'] ?? '');
    const { status } = req.body; // 'ACTIVE', 'HIDDEN', 'FLAGGED'

    if (!isValidId(postId)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'ID bài viết không hợp lệ' });
      return;
    }

    const validStatuses = ['ACTIVE', 'HIDDEN', 'FLAGGED'];
    if (!validStatuses.includes(String(status))) {
      res.status(400).json({ success: false, statusCode: 400, message: 'Trạng thái kiểm duyệt hợp lệ: ACTIVE, HIDDEN, FLAGGED' });
      return;
    }

    const updated = await prisma.posts.update({
      where: { post_id: BigInt(postId) },
      data: { status: String(status) },
    });

    await logAudit({
      userId: adminId,
      action: 'MODERATE_POST',
      entityType: 'posts',
      entityId: postId,
      details: `Kiểm duyệt bài viết sang trạng thái ${status}`,
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Đã cập nhật trạng thái bài viết thành ${status}`,
      data: convertBigInt(updated),
    });
  } catch (error) {
    console.error('Lỗi khi kiểm duyệt bài viết:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== XÁC MINH THÀNH VIÊN GIA ĐÌNH (VERIFICATION) ====================
export const verifyFamilyMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req as any).user?.userId as string | undefined;
    const familyMemberId = String(req.params['id'] ?? '');
    const { status } = req.body; // 'APPROVED' hoặc 'REJECTED'

    if (!isValidId(familyMemberId)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'ID liên kết gia đình không hợp lệ' });
      return;
    }

    const validStatuses = ['APPROVED', 'REJECTED', 'PENDING'];
    if (!validStatuses.includes(String(status))) {
      res.status(400).json({ success: false, statusCode: 400, message: 'Trạng thái xác minh: APPROVED, REJECTED, PENDING' });
      return;
    }

    const updated = await prisma.family_members.update({
      where: { family_member_id: BigInt(familyMemberId) },
      data: { status: String(status) },
      include: {
        users: { select: { user_id: true, full_name: true, email: true } },
        families: { select: { family_id: true, name: true } },
      },
    });

    await logAudit({
      userId: adminId,
      action: 'VERIFY_FAMILY_MEMBER',
      entityType: 'family_members',
      entityId: familyMemberId,
      details: `Xác minh thành viên ${updated.users.full_name} trong gia đình ${updated.families.name}: ${status}`,
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Đã cập nhật trạng thái thành viên: ${status}`,
      data: convertBigInt(updated),
    });
  } catch (error) {
    console.error('Lỗi khi xác minh thành viên:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== XEM NHẬT KÝ KIỂM TOÁN (AUDIT LOGS) ====================
export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(String(req.query['page'] ?? '1'), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query['limit'] ?? '20'), 10)));
    const action = req.query['action'] as string | undefined;

    const skip = (page - 1) * limit;
    const where: any = {};
    if (action) where.action = action;

    const [total, logs] = await Promise.all([
      prisma.audit_logs.count({ where }),
      prisma.audit_logs.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
        include: {
          users: { select: { user_id: true, full_name: true, email: true, role: true } },
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: convertBigInt(logs),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy nhật ký audit logs:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== SAO LƯU & XUẤT DỮ LIỆU GIA TỘC (BACKUP & RESTORE) ====================
export const exportFamilyData = async (req: Request, res: Response): Promise<void> => {
  try {
    const familyIdStr = String(req.params['familyId'] ?? '').replace(/^fam_/, '');

    if (!isValidId(familyIdStr)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'familyId không hợp lệ' });
      return;
    }

    const familyId = BigInt(familyIdStr);

    const [family, branches, members, parentChild, marriages, documents, events] = await Promise.all([
      prisma.families.findUnique({ where: { family_id: familyId } }),
      prisma.family_branches.findMany({ where: { family_id: familyId } }),
      prisma.members.findMany({ where: { family_id: familyId }, include: { member_profiles: true } }),
      prisma.parent_child_relationships.findMany({
        where: { members_parent_child_relationships_parent_idTomembers: { family_id: familyId } },
      }),
      prisma.marriages.findMany({
        where: { members_marriages_partner1_idTomembers: { family_id: familyId } },
      }),
      prisma.family_documents.findMany({ where: { family_id: familyId } }),
      prisma.events.findMany({ where: { family_id: familyId } }),
    ]);

    if (!family) {
      res.status(404).json({ success: false, statusCode: 404, message: 'Không tìm thấy gia tộc' });
      return;
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Xuất dữ liệu gia phả thành công (Full Backup)',
      backupTimestamp: new Date().toISOString(),
      data: convertBigInt({
        family,
        branches,
        members,
        parentChild,
        marriages,
        documents,
        events,
      }),
    });
  } catch (error) {
    console.error('Lỗi khi xuất dữ liệu:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};
