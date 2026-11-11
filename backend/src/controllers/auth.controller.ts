import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';
import { logAudit } from '../middlewares/audit.middleware.js';

const JWT_SECRET = process.env.JWT_SECRET || 'FamilyConnect_SuperSecret_JWT_Key_2026';

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

// ==================== ĐĂNG KÝ ====================
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { full_name, email, password } = req.body;

    if (
      typeof full_name !== 'string' || !full_name.trim() ||
      typeof email !== 'string' || !email.trim() ||
      typeof password !== 'string' || password.length < 8
    ) {
      res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Vui lòng nhập họ tên, email và mật khẩu có ít nhất 8 ký tự',
      });
      return;
    }

    const existing = await prisma.users.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existing) {
      res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Email này đã được đăng ký',
      });
      return;
    }

    const password_hash = await bcrypt.hash(password, 12);

    const user = await prisma.users.create({
      data: {
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        password_hash,
        role: 'MEMBER',
      },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    await logAudit({
      userId: user.user_id.toString(),
      action: 'USER_REGISTER',
      entityType: 'users',
      entityId: user.user_id.toString(),
      details: `Người dùng ${user.email} đăng ký tài khoản thành công`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Đăng ký tài khoản thành công',
      data: {
        userId: user.user_id.toString(),
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Lỗi hệ thống máy chủ',
    });
  }
};

// ==================== ĐĂNG NHẬP ====================
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Vui lòng nhập đầy đủ Email và Mật khẩu',
      });
      return;
    }

    const user = await prisma.users.findUnique({
      where: { email: String(email).trim().toLowerCase() },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Email hoặc mật khẩu không chính xác',
      });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(String(password), user.password_hash);

    if (!isPasswordMatch) {
      res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Email hoặc mật khẩu không chính xác',
      });
      return;
    }

    const accessToken = jwt.sign(
      {
        userId: user.user_id.toString(),
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    await logAudit({
      userId: user.user_id.toString(),
      action: 'USER_LOGIN',
      entityType: 'users',
      entityId: user.user_id.toString(),
      details: `Người dùng ${user.email} đăng nhập hệ thống`,
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Đăng nhập thành công',
      data: {
        accessToken,
        user: {
          id: user.user_id.toString(),
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          avatarUrl: user.avatar_url,
        },
      },
    });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Lỗi hệ thống máy chủ',
    });
  }
};

// ==================== LẤY PROFILE HIỆN TẠI ====================
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId as string | undefined;

    if (!userId) {
      res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Không xác định được người dùng',
      });
      return;
    }

    const user = await prisma.users.findUnique({
      where: { user_id: BigInt(userId) },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        role: true,
        avatar_url: true,
        created_at: true,
        family_members: {
          include: {
            families: { select: { family_id: true, name: true } },
            roles: { select: { role_id: true, name: true } },
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Không tìm thấy tài khoản',
      });
      return;
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: convertBigInt({
        id: user.user_id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
        families: user.family_members.map((fm) => ({
          familyId: fm.family_id,
          familyName: fm.families.name,
          role: fm.roles.name,
          status: fm.status,
          joinedAt: fm.joined_at,
        })),
      }),
    });
  } catch (error) {
    console.error('Lỗi khi lấy profile:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Lỗi hệ thống máy chủ',
    });
  }
};

// ==================== CẬP NHẬT PROFILE CÁ NHÂN (USER PROFILE MANAGEMENT) ====================
export const updateMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId as string | undefined;
    const { fullName, avatarUrl, oldPassword, newPassword } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, statusCode: 401, message: 'Chưa xác thực' });
      return;
    }

    const user = await prisma.users.findUnique({ where: { user_id: BigInt(userId) } });
    if (!user) {
      res.status(404).json({ success: false, statusCode: 404, message: 'Không tìm thấy tài khoản' });
      return;
    }

    const updateData: any = {};
    if (fullName && typeof fullName === 'string' && fullName.trim()) {
      updateData.full_name = fullName.trim();
    }

    if (avatarUrl !== undefined) {
      updateData.avatar_url = avatarUrl ? String(avatarUrl).trim() : null;
    }

    // Đổi mật khẩu nếu có
    if (newPassword) {
      if (!oldPassword) {
        res.status(400).json({ success: false, statusCode: 400, message: 'Vui lòng nhập mật khẩu cũ để đổi mật khẩu mới' });
        return;
      }

      const isOldMatch = await bcrypt.compare(String(oldPassword), user.password_hash);
      if (!isOldMatch) {
        res.status(400).json({ success: false, statusCode: 400, message: 'Mật khẩu cũ không chính xác' });
        return;
      }

      if (String(newPassword).length < 8) {
        res.status(400).json({ success: false, statusCode: 400, message: 'Mật khẩu mới phải có ít nhất 8 ký tự' });
        return;
      }

      updateData.password_hash = await bcrypt.hash(String(newPassword), 12);
    }

    const updated = await prisma.users.update({
      where: { user_id: BigInt(userId) },
      data: updateData,
      select: {
        user_id: true,
        full_name: true,
        email: true,
        role: true,
        avatar_url: true,
      },
    });

    await logAudit({
      userId,
      action: 'UPDATE_PROFILE',
      entityType: 'users',
      entityId: userId,
      details: `Người dùng ${updated.email} cập nhật thông tin cá nhân`,
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Cập nhật thông tin cá nhân thành công',
      data: convertBigInt(updated),
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật profile:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== YÊU CẦU GIA NHẬP GIA TỘC (FAMILY MEMBER VERIFICATION FLOW) ====================
export const requestJoinFamily = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId as string | undefined;
    const { familyId } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, statusCode: 401, message: 'Chưa xác thực' });
      return;
    }

    const familyIdStr = String(familyId ?? '').replace(/^fam_/, '');
    if (!/^\d+$/.test(familyIdStr)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'familyId không hợp lệ' });
      return;
    }

    // Kiểm tra gia đình tồn tại
    const family = await prisma.families.findUnique({ where: { family_id: BigInt(familyIdStr) } });
    if (!family) {
      res.status(404).json({ success: false, statusCode: 404, message: 'Không tìm thấy gia đình' });
      return;
    }

    // Kiểm tra đã liên kết hoặc gửi yêu cầu trước đó chưa
    const existing = await prisma.family_members.findFirst({
      where: { user_id: BigInt(userId), family_id: BigInt(familyIdStr) },
    });

    if (existing) {
      res.status(400).json({
        success: false,
        statusCode: 400,
        message: `Bạn đã tham gia hoặc đang chờ xác minh cho gia đình này (Trạng thái: ${existing.status})`,
      });
      return;
    }

    // Lấy hoặc tạo role mặc định 'MEMBER'
    let memberRole = await prisma.roles.findFirst({ where: { name: 'MEMBER' } });
    if (!memberRole) {
      memberRole = await prisma.roles.create({ data: { name: 'MEMBER', description: 'Thành viên gia đình' } });
    }

    const joinRequest = await prisma.family_members.create({
      data: {
        user_id: BigInt(userId),
        family_id: BigInt(familyIdStr),
        role_id: memberRole.role_id,
        status: 'PENDING', // Chờ Quản trị viên duyệt
      },
    });

    await logAudit({
      userId,
      action: 'REQUEST_JOIN_FAMILY',
      entityType: 'family_members',
      entityId: joinRequest.family_member_id.toString(),
      details: `Gửi yêu cầu tham gia gia đình: ${family.name}`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Gửi yêu cầu gia nhập gia đình thành công. Vui lòng chờ quản trị viên phê duyệt!',
      data: convertBigInt(joinRequest),
    });
  } catch (error) {
    console.error('Lỗi khi xin gia nhập gia đình:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};
