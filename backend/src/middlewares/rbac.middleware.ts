import type { Request, Response, NextFunction } from 'express';

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = (req as any).user?.role as string | undefined;

    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: 'Bạn không có quyền thực hiện thao tác này (yêu cầu vai trò: ' + allowedRoles.join(', ') + ')',
      });
      return;
    }

    next();
  };
};
