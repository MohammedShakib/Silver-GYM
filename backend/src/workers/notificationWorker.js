import { PrismaClient } from '@prisma/client';
import NotificationService from '../services/notification.service.js';
import emailProvider from '../providers/DevelopmentEmailProvider.js';

const prisma = new PrismaClient();

class NotificationWorker {
  constructor() {
    this.isRunning = false;
    this.interval = parseInt(process.env.NOTIFICATION_WORKER_INTERVAL) || 5000;
  }

  start() {
    console.log('[NotificationWorker] Starting...');
    this.isRunning = true;
    this.run();
  }

  stop() {
    this.isRunning = false;
  }

  async run() {
    while (this.isRunning) {
      try {
        await this.processOutboxEvents();
        await this.processEmailDeliveries();
      } catch (error) {
        console.error('[NotificationWorker] Error in run loop:', error);
      }
      await new Promise(resolve => setTimeout(resolve, this.interval));
    }
  }

  async processOutboxEvents() {
    const events = await prisma.domainEventOutbox.findMany({
      where: {
        status: 'PENDING',
        OR: [
          { nextAttemptAt: null },
          { nextAttemptAt: { lte: new Date() } }
        ]
      },
      take: 10,
      orderBy: { createdAt: 'asc' }
    });

    for (const event of events) {
      try {
        await prisma.domainEventOutbox.update({
          where: { id: event.id },
          data: { status: 'PROCESSING', attempts: event.attempts + 1 }
        });

        await NotificationService.processEvent(event);

        await prisma.domainEventOutbox.update({
          where: { id: event.id },
          data: { status: 'PROCESSED', processedAt: new Date() }
        });
      } catch (error) {
        console.error(`[NotificationWorker] Failed to process outbox event ${event.id}:`, error);
        
        const nextAttemptAt = event.attempts >= 3 ? null : new Date(Date.now() + 5000 * Math.pow(2, event.attempts));
        
        await prisma.domainEventOutbox.update({
          where: { id: event.id },
          data: { 
            status: event.attempts >= 3 ? 'FAILED' : 'PENDING',
            nextAttemptAt
          }
        });
      }
    }
  }

  async processEmailDeliveries() {
    const deliveries = await prisma.notificationDelivery.findMany({
      where: {
        status: 'QUEUED',
        channel: 'EMAIL',
        OR: [
          { nextAttemptAt: null },
          { nextAttemptAt: { lte: new Date() } }
        ]
      },
      take: 10,
      include: {
        notification: true
      }
    });

    for (const delivery of deliveries) {
      try {
        await prisma.notificationDelivery.update({
          where: { id: delivery.id },
          data: { status: 'PROCESSING', attempts: delivery.attempts + 1 }
        });

        const user = await prisma.member.findUnique({ where: { id: delivery.userId } });
        
        if (!user || !user.email) {
          throw new Error('User not found or has no email');
        }

        const result = await emailProvider.send({
          to: user.email,
          subject: delivery.notification.title,
          template: delivery.notification.type,
          data: {
            title: delivery.notification.title,
            message: delivery.notification.message,
            actionUrl: delivery.notification.actionUrl,
            actionLabel: delivery.notification.actionLabel
          }
        });

        await prisma.notificationDelivery.update({
          where: { id: delivery.id },
          data: { 
            status: result.status || 'SENT', 
            sentAt: new Date(),
            providerMessageId: result.messageId,
            destinationMasked: user.email.replace(/(.{2})(.*)(?=@)/, "$1***")
          }
        });
      } catch (error) {
        console.error(`[NotificationWorker] Failed to process email delivery ${delivery.id}:`, error);
        
        const maxRetries = parseInt(process.env.NOTIFICATION_MAX_RETRIES) || 3;
        const nextAttemptAt = delivery.attempts >= maxRetries ? null : new Date(Date.now() + 5000 * Math.pow(2, delivery.attempts));
        
        await prisma.notificationDelivery.update({
          where: { id: delivery.id },
          data: { 
            status: delivery.attempts >= maxRetries ? 'FAILED' : 'QUEUED',
            nextAttemptAt,
            errorCode: 'SEND_FAILED',
            errorMessage: error.message
          }
        });
      }
    }
  }
}

export default new NotificationWorker();
