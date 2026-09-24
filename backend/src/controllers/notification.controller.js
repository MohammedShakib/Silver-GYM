import { PrismaClient } from '@prisma/client';
import { ApiError } from '../middlewares/errorHandler.js';

const prisma = new PrismaClient();

export const getNotifications = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const total = await prisma.notification.count({ where: { userId } });

    res.json({
      notifications,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    const count = await prisma.notification.count({
      where: { userId, readAt: null }
    });
    res.json({ count });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const notification = await prisma.notification.findFirst({
      where: { id, userId }
    });

    if (!notification) {
      throw new ApiError(404, 'NOT_FOUND', 'Notification not found');
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { readAt: new Date() }
    });

    res.json({ notification: updated });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    await prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getPreferences = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    let prefs = await prisma.notificationPreference.findUnique({
      where: { userId }
    });

    if (!prefs) {
      prefs = await prisma.notificationPreference.create({
        data: { userId }
      });
    }

    res.json({ preferences: prefs });
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    const data = req.body;

    const prefs = await prisma.notificationPreference.upsert({
      where: { userId },
      update: {
        membershipEmail: data.membershipEmail,
        paymentEmail: data.paymentEmail,
        checkInEmail: data.checkInEmail,
        partnerOpsEmail: data.partnerOpsEmail,
        payoutEmail: data.payoutEmail,
        supportEmail: data.supportEmail,
        inAppEnabled: data.inAppEnabled,
      },
      create: {
        userId,
        membershipEmail: data.membershipEmail ?? true,
        paymentEmail: data.paymentEmail ?? true,
        checkInEmail: data.checkInEmail ?? false,
        partnerOpsEmail: data.partnerOpsEmail ?? true,
        payoutEmail: data.payoutEmail ?? true,
        supportEmail: data.supportEmail ?? true,
        inAppEnabled: data.inAppEnabled ?? true,
      }
    });

    res.json({ preferences: prefs });
  } catch (error) {
    next(error);
  }
};
