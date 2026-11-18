import prisma from '../db.js';

export interface AuditLogParams {
  userId?: string | bigint | null | undefined;
  action: string;
  entityType: string;
  entityId?: string | bigint | null | undefined;
  details?: string | null | undefined;
  ipAddress?: string | null | undefined;
}

export const logAudit = async (params: AuditLogParams): Promise<void> => {
  try {
    const { userId, action, entityType, entityId, details, ipAddress } = params;

    await prisma.audit_logs.create({
      data: {
        user_id: userId ? BigInt(userId) : null,
        action,
        entity_type: entityType,
        entity_id: entityId ? String(entityId) : null,
        details: details || null,
        ip_address: ipAddress || null,
      },
    });
  } catch (error) {
    // Không làm sập ứng dụng nếu logging audit gặp lỗi
    console.error('Lỗi khi ghi audit log:', error);
  }
};
