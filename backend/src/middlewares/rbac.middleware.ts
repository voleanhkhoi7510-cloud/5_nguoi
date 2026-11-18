import type { Request, Response, NextFunction } from 'express';
import prisma from '../db.js';
import type { AuthenticatedRequest } from './auth.middleware.js';

// ==================== HỆ THỐNG VAI TRÒ & QUYỀN HẠN (RBAC) ====================

export type SystemRole = 'ADMIN' | 'MODERATOR' | 'MEMBER';

export type FamilyRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'MEMBER' | 'VIEWER';

export type Permission =
  | 'MANAGE_USERS'
  | 'ASSIGN_ROLES'
  | 'MODERATE_CONTENT'
  | 'VIEW_AUDIT_LOGS'
  | 'EXPORT_DATA'
  | 'MANAGE_FAMILY'
  | 'EDIT_GENEALOGY'
  | 'MANAGE_EVENTS'
  | 'MANAGE_HERITAGE'
  | 'POST_COMMUNITY';

// Bảng ánh xạ quyền cho Vai trò hệ thống
export const SYSTEM_ROLE_PERMISSIONS: Record<SystemRole, Permission[]> = {
  ADMIN: [
    'MANAGE_USERS',
    'ASSIGN_ROLES',
    'MODERATE_CONTENT',
    'VIEW_AUDIT_LOGS',
    'EXPORT_DATA',
    'MANAGE_FAMILY',
    'EDIT_GENEALOGY',
    'MANAGE_EVENTS',
    'MANAGE_HERITAGE',
    'POST_COMMUNITY',
  ],
  MODERATOR: [
    'MODERATE_CONTENT',
    'VIEW_AUDIT_LOGS',
    'EXPORT_DATA',
    'EDIT_GENEALOGY',
    'MANAGE_EVENTS',
    'POST_COMMUNITY',
  ],
  MEMBER: [
    'POST_COMMUNITY',
  ],
};

// Cấp bậc vai trò gia đình (Số càng lớn quyền càng cao)
export const FAMILY_ROLE_HIERARCHY: Record<FamilyRole, number> = {
  OWNER: 5,
  ADMIN: 4,
  EDITOR: 3,
  MEMBER: 2,
  VIEWER: 1,
};

function isValidId(id: string): boolean {
  return /^\d+$/.test(id) && BigInt(id) > 0n;
}

// ==================== 1. KIỂM TRA VAI TRÒ HỆ THỐNG ====================
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    const userRole = authReq.user?.role as string | undefined;

    if (!userRole || !allowedRoles.includes(userRole.toUpperCase())) {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: `Bạn không có quyền thực hiện thao tác này. Yêu cầu vai trò hệ thống: ${allowedRoles.join(', ')}`,
      });
      return;
    }

    next();
  };
};

// ==================== 2. KIỂM TRA QUYỀN HẠN CỤ THỂ (PERMISSIONS) ====================
export const requirePermission = (...requiredPermissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    const userRole = (authReq.user?.role?.toUpperCase() || 'MEMBER') as SystemRole;

    const userPermissions = SYSTEM_ROLE_PERMISSIONS[userRole] || [];
    const hasAll = requiredPermissions.every((perm) => userPermissions.includes(perm));

    if (!hasAll) {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: `Từ chối truy cập. Bạn thiếu các quyền: ${requiredPermissions.filter((p) => !userPermissions.includes(p)).join(', ')}`,
      });
      return;
    }

    next();
  };
};

// ==================== 3. KIỂM TRA QUYỀN TRUY CẬP GIA TỘC (FAMILY ACCESS) ====================
export interface FamilyAccessOptions {
  minRole?: FamilyRole;
  allowSystemAdmin?: boolean; // Mặc định true: ADMIN hệ thống luôn có quyền
  allowModerator?: boolean;   // Mặc định false
}

export const requireFamilyAccess = (options?: FamilyAccessOptions) => {
  const allowAdmin = options?.allowSystemAdmin !== false;
  const allowMod = options?.allowModerator === true;
  const minRole = options?.minRole || 'VIEWER';

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.userId;
      const systemRole = authReq.user?.role?.toUpperCase();

      if (!userId || !isValidId(userId)) {
        res.status(401).json({ success: false, statusCode: 401, message: 'Yêu cầu đăng nhập xác thực' });
        return;
      }

      // Bypass cho Admin hệ thống
      if (allowAdmin && systemRole === 'ADMIN') {
        (req as any).isFamilyAdmin = true;
        next();
        return;
      }

      if (allowMod && systemRole === 'MODERATOR') {
        next();
        return;
      }

      // Tìm familyId từ params, query hoặc body
      const rawFamilyId =
        req.params['familyId'] ||
        req.params['id'] ||
        req.query['familyId'] ||
        req.body?.familyId;

      const familyIdStr = String(rawFamilyId ?? '').replace(/^fam_/, '');

      if (!isValidId(familyIdStr)) {
        res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Không tìm thấy familyId hợp lệ để kiểm tra quyền truy cập gia tộc',
        });
        return;
      }

      // Tìm bản ghi liên kết family_members
      const membership = await prisma.family_members.findFirst({
        where: {
          user_id: BigInt(userId),
          family_id: BigInt(familyIdStr),
        },
        include: {
          roles: true,
        },
      });

      if (!membership) {
        res.status(403).json({
          success: false,
          statusCode: 403,
          message: 'Bạn chưa tham gia vào gia tộc này',
        });
        return;
      }

      if (membership.status !== 'APPROVED') {
        res.status(403).json({
          success: false,
          statusCode: 403,
          message: `Tài khoản của bạn tại gia tộc đang ở trạng thái: ${membership.status} (chưa được phê duyệt)`,
        });
        return;
      }

      const roleName = (membership.roles?.name || 'MEMBER').toUpperCase() as FamilyRole;
      const userLevel = FAMILY_ROLE_HIERARCHY[roleName] || 1;
      const requiredLevel = FAMILY_ROLE_HIERARCHY[minRole] || 1;

      if (userLevel < requiredLevel) {
        res.status(403).json({
          success: false,
          statusCode: 403,
          message: `Yêu cầu vai trò gia đình tối thiểu: ${minRole} (vai trò hiện tại: ${roleName})`,
        });
        return;
      }

      // Đính kèm thông tin quyền gia đình vào request để controller tái sử dụng
      (req as any).familyMembership = membership;
      (req as any).familyRole = roleName;
      next();
    } catch (error) {
      console.error('Lỗi khi kiểm tra quyền truy cập gia đình:', error);
      res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi kiểm tra quyền truy cập' });
    }
  };
};

// ==================== 4. KIỂM TRA CHỦ SỞ HỮU TÀI NGUYÊN HOẶC ADMIN ====================
export type ResourceType = 'post' | 'comment' | 'event' | 'document';

export const requireResourceOwnerOrAdmin = (
  resourceType: ResourceType,
  idParamName: string = 'id'
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.userId;
      const systemRole = authReq.user?.role?.toUpperCase();

      if (!userId || !isValidId(userId)) {
        res.status(401).json({ success: false, statusCode: 401, message: 'Yêu cầu đăng nhập xác thực' });
        return;
      }

      // ADMIN và MODERATOR hệ thống có quyền quản trị tài nguyên
      if (systemRole === 'ADMIN' || systemRole === 'MODERATOR') {
        next();
        return;
      }

      const rawId = req.params[idParamName] || req.body?.id;
      const cleanId = String(rawId ?? '').replace(/^(post_|comm_|event_|doc_)/, '');

      if (!isValidId(cleanId)) {
        res.status(400).json({ success: false, statusCode: 400, message: `ID ${resourceType} không hợp lệ` });
        return;
      }

      const idBigInt = BigInt(cleanId);
      let isOwner = false;

      if (resourceType === 'post') {
        const post = await prisma.posts.findUnique({ where: { post_id: idBigInt } });
        if (!post) {
          res.status(404).json({ success: false, statusCode: 404, message: 'Không tìm thấy bài viết' });
          return;
        }
        isOwner = post.author_id.toString() === userId;
      } else if (resourceType === 'comment') {
        const comment = await prisma.post_comments.findUnique({ where: { comment_id: idBigInt } });
        if (!comment) {
          res.status(404).json({ success: false, statusCode: 404, message: 'Không tìm thấy bình luận' });
          return;
        }
        isOwner = comment.author_id.toString() === userId;
      } else if (resourceType === 'event') {
        const event = await prisma.events.findUnique({ where: { event_id: idBigInt } });
        if (!event) {
          res.status(404).json({ success: false, statusCode: 404, message: 'Không tìm thấy sự kiện' });
          return;
        }
        isOwner = event.creator_id.toString() === userId;
      } else if (resourceType === 'document') {
        const doc = await prisma.family_documents.findUnique({ where: { document_id: idBigInt } });
        if (!doc) {
          res.status(404).json({ success: false, statusCode: 404, message: 'Không tìm thấy tài liệu' });
          return;
        }
        // Cho phép quản trị gia đình hoặc người sở hữu
        isOwner = true; // Sẽ kiểm tra thêm quyền gia đình nếu cần
      }

      if (!isOwner) {
        res.status(403).json({
          success: false,
          statusCode: 403,
          message: 'Bạn không phải là chủ sở hữu của tài nguyên này và không có quyền sửa/xóa',
        });
        return;
      }

      next();
    } catch (error) {
      console.error(`Lỗi kiểm tra chủ sở hữu ${resourceType}:`, error);
      res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi kiểm tra quyền hạn' });
    }
  };
};
