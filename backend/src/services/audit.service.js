import prisma from '../utils/prisma.js';

class AuditService {
  /**
   * Records an action in the audit log.
   * 
   * @param {Object} params
   * @param {string} [params.actorUserId] - ID of the user performing the action (null if system)
   * @param {string} [params.actorRole] - Role of the actor (e.g., 'ADMIN', 'SYSTEM')
   * @param {string} params.action - Action performed (e.g., 'USER_SUSPENDED')
   * @param {string} params.entityType - Type of entity affected (e.g., 'USER', 'GYM', 'PAYMENT')
   * @param {string} params.entityId - ID of the entity affected
   * @param {Object} [params.metadata] - Additional context/data
   */
  async record({ actorUserId = null, actorRole = null, action, entityType, entityId, metadata = null }) {
    try {
      await prisma.auditLog.create({
        data: {
          actorUserId,
          actorRole,
          action,
          entityType,
          entityId,
          metadata
        }
      });
    } catch (error) {
      // Audit failure shouldn't crash the main process, but should be logged.
      console.error('Failed to write audit log:', error);
    }
  }

  async getLogs(page = 1, limit = 50, filters = {}) {
    const offset = (page - 1) * limit;
    
    const where = {};
    if (filters.action) where.action = filters.action;
    if (filters.entityType) where.entityType = filters.entityType;
    if (filters.entityId) where.entityId = filters.entityId;
    if (filters.actorUserId) where.actorUserId = filters.actorUserId;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.auditLog.count({ where })
    ]);

    return { logs, total, page, totalPages: Math.ceil(total / limit) };
  }
}

export const auditService = new AuditService();
