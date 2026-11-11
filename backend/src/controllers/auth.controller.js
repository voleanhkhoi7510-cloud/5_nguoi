import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';
const JWT_SECRET = process.env.JWT_SECRET || 'FamilyConnect_SuperSecret_JWT_Key_2026';
// ==================== ĐĂNG KÝ ====================
export const register = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;
        if (typeof full_name !== 'string' || !full_name.trim() ||
            typeof email !== 'string' || !email.trim() ||
            typeof password !== 'string' || password.length < 8) {
            res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'Vui lòng nhập họ tên, email và mật khẩu có ít nhất 8 ký tự',
            });
            return;
        }
        // Kiểm tra email đã tồn tại
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
    }
    catch (error) {
        console.error('Lỗi khi đăng ký:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Lỗi hệ thống máy chủ',
        });
    }
};
// ==================== ĐĂNG NHẬP ====================
export const login = async (req, res) => {
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
        const accessToken = jwt.sign({
            userId: user.user_id.toString(),
            email: user.email,
            role: user.role,
        }, JWT_SECRET, { expiresIn: '24h' });
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
    }
    catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Lỗi hệ thống máy chủ',
        });
    }
};
// ==================== LẤY PROFILE HIỆN TẠI ====================
export const getMe = async (req, res) => {
    try {
        const userId = req.user?.userId;
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
            data: {
                id: user.user_id.toString(),
                email: user.email,
                fullName: user.full_name,
                role: user.role,
                avatarUrl: user.avatar_url,
                createdAt: user.created_at,
            },
        });
    }
    catch (error) {
        console.error('Lỗi khi lấy profile:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Lỗi hệ thống máy chủ',
        });
    }
};
//# sourceMappingURL=auth.controller.js.map