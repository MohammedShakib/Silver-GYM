import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class EventService {
  /**
   * Publishes a domain event into the outbox for reliable background processing.
   * @param {Object} options
   * @param {string} options.eventType
   * @param {string} options.aggregateType
   * @param {string} options.aggregateId
   * @param {Object} options.payload
   * @param {string} [options.dedupKey]
   * @param {Object} [tx] - Prisma transaction client
   */
  static async publishEvent({ eventType, aggregateType, aggregateId, payload, dedupKey }, tx = prisma) {
    if (dedupKey) {
      const existing = await tx.domainEventOutbox.findUnique({
        where: { dedupKey }
      });
      if (existing) {
        console.log(`[EventService] Skipping duplicate event ${eventType} with dedupKey ${dedupKey}`);
        return existing;
      }
    }

    const event = await tx.domainEventOutbox.create({
      data: {
        eventType,
        aggregateType,
        aggregateId,
        payload,
        dedupKey
      }
    });
    
    return event;
  }
}

export default EventService;
