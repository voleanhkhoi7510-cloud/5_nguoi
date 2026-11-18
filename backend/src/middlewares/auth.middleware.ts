import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    iat?: number | undefined;
    exp?: number | undefined;
  } | undefined;
}

const JWT_SECRET = process.env.JWT_SECRET || 'FamilyConnect_SuperSecret_JWT_Key_2026';

export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Yêu cầu Token xác thực (Authorization: Bearer <token>)',
    });
    return;
  }

  const token = authHeader.split(' ')[1] ?? '';

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: 'Token không hợp lệ hoặc đã hết hạn',
      });
      return;
    }

    req.user = decoded as AuthenticatedRequest['user'];
    next();
  });
};
