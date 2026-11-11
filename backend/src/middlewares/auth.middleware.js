import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'FamilyConnect_SuperSecret_JWT_Key_2026';
export const authenticateJWT = (req, res, next) => {
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
        req.user = decoded;
        next();
    });
};
//# sourceMappingURL=auth.middleware.js.map